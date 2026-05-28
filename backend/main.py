from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models, schemas
from db.conexion import engine, get_db
from s3_utils import upload_file_to_s3

# Crear las tablas en la base de datos
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Backend Proyecto-4b - Mosaiko API")

# Configuración CORS para que el frontend pueda hacer peticiones
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # En producción cambiar por el dominio real
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "API de Proyecto 4b funcionando correctamente"}

# ==========================================
# ENDPOINTS PUBLICACIONES
# ==========================================

@app.post("/publicaciones/", response_model=schemas.Publicacion)
def create_publicacion(
    titulo: str = Form(...),
    descripcion: str = Form(None),
    tags: str = Form(None),
    categoria_id: int = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # 1. Subir el archivo a Amazon S3
    # Leemos el contenido del archivo
    file_obj = file.file
    # Subimos a S3 y obtenemos la URL
    s3_url = upload_file_to_s3(file_obj, file.filename)
    
    if not s3_url:
        # En caso de no tener configurado S3 aún, podemos poner una URL de prueba o lanzar un error
        # Por ahora usaremos una URL de placeholder o levantamos excepción
        s3_url = f"http://placeholder-s3-url.com/{file.filename}"
        # Si prefieres que falle cuando no hay S3 usa esto:
        # raise HTTPException(status_code=500, detail="Error al subir el archivo a S3")

    # 2. Guardar los datos en la base de datos
    db_publicacion = models.Publicacion(
        titulo=titulo,
        descripcion=descripcion,
        tags=tags,
        categoria_id=categoria_id,
        url_multimedia=s3_url
    )
    db.add(db_publicacion)
    db.commit()
    db.refresh(db_publicacion)
    return db_publicacion

@app.get("/publicaciones/", response_model=List[schemas.Publicacion])
def get_publicaciones(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    publicaciones = db.query(models.Publicacion).offset(skip).limit(limit).all()
    return publicaciones

@app.get("/publicaciones/{publicacion_id}", response_model=schemas.Publicacion)
def get_publicacion(publicacion_id: int, db: Session = Depends(get_db)):
    publicacion = db.query(models.Publicacion).filter(models.Publicacion.id == publicacion_id).first()
    if publicacion is None:
        raise HTTPException(status_code=404, detail="Publicación no encontrada")
    return publicacion

# ==========================================
# ENDPOINTS COMENTARIOS
# ==========================================

@app.post("/publicaciones/{publicacion_id}/comentarios/", response_model=schemas.Comentario)
def create_comentario(
    publicacion_id: int, 
    comentario: schemas.ComentarioCreate, 
    db: Session = Depends(get_db)
):
    # Verificar si la publicación existe
    db_publicacion = db.query(models.Publicacion).filter(models.Publicacion.id == publicacion_id).first()
    if not db_publicacion:
        raise HTTPException(status_code=404, detail="Publicación no encontrada")
    
    db_comentario = models.Comentario(
        texto=comentario.texto,
        publicacion_id=publicacion_id
    )
    db.add(db_comentario)
    db.commit()
    db.refresh(db_comentario)
    return db_comentario

@app.get("/publicaciones/{publicacion_id}/comentarios/", response_model=List[schemas.Comentario])
def get_comentarios_publicacion(publicacion_id: int, db: Session = Depends(get_db)):
    comentarios = db.query(models.Comentario).filter(models.Comentario.publicacion_id == publicacion_id).all()
    return comentarios
