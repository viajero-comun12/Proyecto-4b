from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# --- USUARIOS ---
class UsuarioLogin(BaseModel):
    username: str
    password: str

class UsuarioCreate(BaseModel):
    username: str
    email: str
    password: str

class UsuarioUpdate(BaseModel):
    profile_pic: Optional[str] = None
    biografia: Optional[str] = None

class Usuario(BaseModel):
    id: int
    username: str
    email: str
    profile_pic: Optional[str] = None
    biografia: Optional[str] = None
    fecha_registro: datetime

    class Config:
        from_attributes = True

# --- COMENTARIOS ---
class ComentarioBase(BaseModel):
    texto: str
    usuario_id: int

class ComentarioCreate(ComentarioBase):
    pass

class Comentario(ComentarioBase):
    id: int
    publicacion_id: int
    fecha_creacion: datetime

    class Config:
        from_attributes = True

# --- PUBLICACIONES ---
class PublicacionBase(BaseModel):
    titulo: str
    descripcion: Optional[str] = None
    tags: Optional[str] = None
    categoria_id: Optional[int] = None
    usuario_id: int

class PublicacionCreate(PublicacionBase):
    pass

class Publicacion(PublicacionBase):
    id: int
    url_multimedia: str
    fecha_creacion: datetime
    comentarios: List[Comentario] = []

    class Config:
        from_attributes = True

# --- TABLEROS ---
class TableroCreate(BaseModel):
    nombre: str
    secreto: bool = False
    usuario_id: int

class Tablero(BaseModel):
    id: int
    nombre: str
    secreto: bool
    usuario_id: int
    fecha_creacion: datetime
    publicaciones: List[Publicacion] = []

    class Config:
        from_attributes = True

# --- COLLAGES ---
class CollageCreate(BaseModel):
    titulo: str
    layout_data: str # JSON format as string
    usuario_id: int

class Collage(BaseModel):
    id: int
    titulo: str
    layout_data: str
    usuario_id: int
    fecha_creacion: datetime

    class Config:
        from_attributes = True

# --- NOTIFICACIONES ---
class NotificacionCreate(BaseModel):
    texto: str
    usuario_id: int

class Notificacion(BaseModel):
    id: int
    texto: str
    leida: bool
    usuario_id: int
    fecha_creacion: datetime

    class Config:
        from_attributes = True

# --- MENSAJES ---
class MensajeCreate(BaseModel):
    texto: str
    remitente_id: int
    destinatario_id: int

class Mensaje(BaseModel):
    id: int
    texto: str
    remitente_id: int
    destinatario_id: int
    fecha_envio: datetime

    class Config:
        from_attributes = True
