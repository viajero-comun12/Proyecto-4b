from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ComentarioBase(BaseModel):
    texto: str

class ComentarioCreate(ComentarioBase):
    pass

class Comentario(ComentarioBase):
    id: int
    publicacion_id: int
    fecha_creacion: datetime

    class Config:
        from_attributes = True

class PublicacionBase(BaseModel):
    titulo: str
    descripcion: Optional[str] = None
    tags: Optional[str] = None
    categoria_id: Optional[int] = None

class PublicacionCreate(PublicacionBase):
    pass

class Publicacion(PublicacionBase):
    id: int
    url_multimedia: str
    fecha_creacion: datetime
    comentarios: List[Comentario] = []

    class Config:
        from_attributes = True
