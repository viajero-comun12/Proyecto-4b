from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean, Table
from sqlalchemy.orm import relationship
from datetime import datetime
from db.conexion import Base

# Tabla de asociación para Tableros y Publicaciones (Muchos a Muchos)
tablero_publicacion = Table(
    'tablero_publicacion',
    Base.metadata,
    Column('tablero_id', Integer, ForeignKey('tableros.id'), primary_key=True),
    Column('publicacion_id', Integer, ForeignKey('publicaciones.id'), primary_key=True)
)

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(255))
    profile_pic = Column(String(1000), nullable=True)
    biografia = Column(Text, nullable=True)
    fecha_registro = Column(DateTime, default=datetime.utcnow)

    publicaciones = relationship("Publicacion", back_populates="autor")
    comentarios = relationship("Comentario", back_populates="autor")
    tableros = relationship("Tablero", back_populates="usuario")
    collages = relationship("Collage", back_populates="usuario")

class Publicacion(Base):
    __tablename__ = "publicaciones"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(255), index=True)
    descripcion = Column(Text)
    tags = Column(String(255)) 
    categoria_id = Column(Integer)
    url_multimedia = Column(String(1000))
    fecha_creacion = Column(DateTime, default=datetime.utcnow)
    
    usuario_id = Column(Integer, ForeignKey("usuarios.id"))
    autor = relationship("Usuario", back_populates="publicaciones")

    comentarios = relationship("Comentario", back_populates="publicacion")
    tableros = relationship("Tablero", secondary=tablero_publicacion, back_populates="publicaciones")

class Comentario(Base):
    __tablename__ = "comentarios"

    id = Column(Integer, primary_key=True, index=True)
    texto = Column(Text)
    fecha_creacion = Column(DateTime, default=datetime.utcnow)
    
    publicacion_id = Column(Integer, ForeignKey("publicaciones.id"))
    publicacion = relationship("Publicacion", back_populates="comentarios")
    
    usuario_id = Column(Integer, ForeignKey("usuarios.id"))
    autor = relationship("Usuario", back_populates="comentarios")

class Tablero(Base):
    __tablename__ = "tableros"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100))
    secreto = Column(Boolean, default=False)
    fecha_creacion = Column(DateTime, default=datetime.utcnow)

    usuario_id = Column(Integer, ForeignKey("usuarios.id"))
    usuario = relationship("Usuario", back_populates="tableros")

    publicaciones = relationship("Publicacion", secondary=tablero_publicacion, back_populates="tableros")

class Collage(Base):
    __tablename__ = "collages"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(100))
    layout_data = Column(Text) # Guardaremos un JSON en texto con las posiciones
    fecha_creacion = Column(DateTime, default=datetime.utcnow)

    usuario_id = Column(Integer, ForeignKey("usuarios.id"))
    usuario = relationship("Usuario", back_populates="collages")

class Notificacion(Base):
    __tablename__ = "notificaciones"

    id = Column(Integer, primary_key=True, index=True)
    texto = Column(Text)
    leida = Column(Boolean, default=False)
    fecha_creacion = Column(DateTime, default=datetime.utcnow)

    usuario_id = Column(Integer, ForeignKey("usuarios.id")) # Usuario que la recibe

class Mensaje(Base):
    __tablename__ = "mensajes"

    id = Column(Integer, primary_key=True, index=True)
    texto = Column(Text)
    fecha_envio = Column(DateTime, default=datetime.utcnow)

    remitente_id = Column(Integer, ForeignKey("usuarios.id"))
    destinatario_id = Column(Integer, ForeignKey("usuarios.id"))
