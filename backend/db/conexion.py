from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Cambiamos a MySQL. Asumiendo la configuración por defecto de Laragon (usuario root, sin contraseña)
# Si la base de datos "proyecto_4b" no existe, el script init_db.py la creará.
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:@localhost:3306/proyecto_4b"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
