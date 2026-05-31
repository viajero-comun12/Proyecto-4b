from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models, schemas
from db.conexion import engine, get_db
from s3_utils import upload_file_to_s3

# Crear las tablas en la base de datos
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Backend Proyecto-4b - Mosaiko API Completa")

# Configuración CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "API de Proyecto 4b funcionando correctamente"}

# ==========================================
# ENDPOINTS USUARIOS
# ==========================================

@app.post("/usuarios/", response_model=schemas.Usuario)
def create_usuario(usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.Usuario).filter(models.Usuario.username == usuario.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="El nombre de usuario ya existe")
    db_email = db.query(models.Usuario).filter(models.Usuario.email == usuario.email).first()
    if db_email:
        raise HTTPException(status_code=400, detail="El email ya está registrado")
    
    # Nota: En producción esto debería estar encriptado (ej. usando bcrypt/passlib)
    nuevo_usuario = models.Usuario(
        username=usuario.username,
        email=usuario.email,
        hashed_password=usuario.password # Hash simulado/texto plano para el prototipo
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    return nuevo_usuario

@app.post("/login/")
def login(usuario: schemas.UsuarioLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.Usuario).filter(
        models.Usuario.username == usuario.username,
        models.Usuario.hashed_password == usuario.password
    ).first()
    if not db_user:
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    
    return {"message": "Login exitoso", "usuario_id": db_user.id, "username": db_user.username}

@app.get("/usuarios/{usuario_id}", response_model=schemas.Usuario)
def get_usuario(usuario_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return db_user

@app.put("/usuarios/{usuario_id}", response_model=schemas.Usuario)
def update_usuario(usuario_id: int, update_data: schemas.UsuarioUpdate, db: Session = Depends(get_db)):
    db_user = db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    if update_data.profile_pic is not None:
        db_user.profile_pic = update_data.profile_pic
    if update_data.biografia is not None:
        db_user.biografia = update_data.biografia
        
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/usuarios/{usuario_id}/avatar", response_model=schemas.Usuario)
def upload_avatar(usuario_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    db_user = db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
    s3_url = upload_file_to_s3(file.file, file.filename)
    if not s3_url:
        raise HTTPException(status_code=500, detail="Error al subir imagen a S3")
        
    db_user.profile_pic = s3_url
    db.commit()
    db.refresh(db_user)
    return db_user

# ==========================================
# ENDPOINTS PUBLICACIONES
# ==========================================

@app.post("/publicaciones/", response_model=schemas.Publicacion)
def create_publicacion(
    titulo: str = Form(...),
    descripcion: str = Form(None),
    tags: str = Form(None),
    categoria_id: int = Form(None),
    usuario_id: int = Form(...), # Obligatorio para asociar
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    db_user = db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    file_obj = file.file
    s3_url = upload_file_to_s3(file_obj, file.filename)
    if not s3_url:
        s3_url = f"http://placeholder-s3-url.com/{file.filename}"

    db_publicacion = models.Publicacion(
        titulo=titulo,
        descripcion=descripcion,
        tags=tags,
        categoria_id=categoria_id,
        url_multimedia=s3_url,
        usuario_id=usuario_id
    )
    db.add(db_publicacion)
    db.commit()
    db.refresh(db_publicacion)
    return db_publicacion

@app.get("/publicaciones/", response_model=List[schemas.Publicacion])
def get_publicaciones(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Publicacion).offset(skip).limit(limit).all()

# ==========================================
# ENDPOINTS TABLEROS
# ==========================================

@app.post("/tableros/", response_model=schemas.Tablero)
def create_tablero(tablero: schemas.TableroCreate, db: Session = Depends(get_db)):
    db_tablero = models.Tablero(
        nombre=tablero.nombre,
        secreto=tablero.secreto,
        usuario_id=tablero.usuario_id
    )
    db.add(db_tablero)
    db.commit()
    db.refresh(db_tablero)
    return db_tablero

@app.post("/tableros/{tablero_id}/publicaciones/{publicacion_id}")
def add_publicacion_to_tablero(tablero_id: int, publicacion_id: int, db: Session = Depends(get_db)):
    tablero = db.query(models.Tablero).filter(models.Tablero.id == tablero_id).first()
    publicacion = db.query(models.Publicacion).filter(models.Publicacion.id == publicacion_id).first()
    if not tablero or not publicacion:
        raise HTTPException(status_code=404, detail="Tablero o Publicación no encontrados")
    
    tablero.publicaciones.append(publicacion)
    db.commit()
    return {"message": "Publicación añadida al tablero correctamente"}

@app.get("/usuarios/{usuario_id}/tableros/", response_model=List[schemas.Tablero])
def get_tableros_usuario(usuario_id: int, db: Session = Depends(get_db)):
    return db.query(models.Tablero).filter(models.Tablero.usuario_id == usuario_id).all()

# ==========================================
# ENDPOINTS COLLAGES
# ==========================================

@app.post("/collages/", response_model=schemas.Collage)
def create_collage(collage: schemas.CollageCreate, db: Session = Depends(get_db)):
    db_collage = models.Collage(
        titulo=collage.titulo,
        layout_data=collage.layout_data,
        usuario_id=collage.usuario_id
    )
    db.add(db_collage)
    db.commit()
    db.refresh(db_collage)
    return db_collage

# ==========================================
# ENDPOINTS NOTIFICACIONES
# ==========================================

@app.get("/usuarios/{usuario_id}/notificaciones/", response_model=List[schemas.Notificacion])
def get_notificaciones(usuario_id: int, db: Session = Depends(get_db)):
    return db.query(models.Notificacion).filter(models.Notificacion.usuario_id == usuario_id).order_by(models.Notificacion.fecha_creacion.desc()).all()

@app.post("/notificaciones/", response_model=schemas.Notificacion)
def create_notificacion(notificacion: schemas.NotificacionCreate, db: Session = Depends(get_db)):
    db_notif = models.Notificacion(
        texto=notificacion.texto,
        usuario_id=notificacion.usuario_id
    )
    db.add(db_notif)
    db.commit()
    db.refresh(db_notif)
    return db_notif

# ==========================================
# ENDPOINTS MENSAJERIA
# ==========================================

@app.post("/mensajes/", response_model=schemas.Mensaje)
def send_mensaje(mensaje: schemas.MensajeCreate, db: Session = Depends(get_db)):
    db_mensaje = models.Mensaje(
        texto=mensaje.texto,
        remitente_id=mensaje.remitente_id,
        destinatario_id=mensaje.destinatario_id
    )
    db.add(db_mensaje)
    db.commit()
    db.refresh(db_mensaje)
    return db_mensaje

@app.get("/mensajes/{usuario_id}", response_model=List[schemas.Mensaje])
def get_mensajes(usuario_id: int, db: Session = Depends(get_db)):
    from sqlalchemy import or_
    mensajes = db.query(models.Mensaje).filter(
        or_(models.Mensaje.remitente_id == usuario_id, models.Mensaje.destinatario_id == usuario_id)
    ).order_by(models.Mensaje.fecha_envio.asc()).all()
    return mensajes
