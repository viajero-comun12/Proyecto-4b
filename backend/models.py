from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from db.conexion import Base

class Publicacion(Base):
    __tablename__ = "publicaciones"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, index=True)
    descripcion = Column(Text)
    tags = Column(String) # Guardaremos los hashtags separados por comas, ej: "#arte,#fotografia"
    categoria_id = Column(Integer)
    url_multimedia = Column(String) # URL del archivo en AWS S3
    fecha_creacion = Column(DateTime, default=datetime.utcnow)

    comentarios = relationship("Comentario", back_populates="publicacion")

class Comentario(Base):
    __tablename__ = "comentarios"

    id = Column(Integer, primary_key=True, index=True)
    publicacion_id = Column(Integer, ForeignKey("publicaciones.id"))
    texto = Column(Text)
    fecha_creacion = Column(DateTime, default=datetime.utcnow)

    publicacion = relationship("Publicacion", back_populates="comentarios")
