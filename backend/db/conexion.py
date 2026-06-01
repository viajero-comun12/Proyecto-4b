import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# ============================================================
# MODO DUAL: MySQL (local/Laragon) o SQLite (EC2/demo/GitHub)
# ------------------------------------------------------------
# Si existe DATABASE_URL en el entorno → úsala (SQLite en EC2)
# Si no existe                         → usa MySQL de Laragon
# ============================================================

DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    # Modo SQLite (EC2, demo, GitHub Actions, etc.)
    SQLALCHEMY_DATABASE_URL = DATABASE_URL
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False}  # Necesario para SQLite
    )
    print(f"[DB] Usando SQLite: {SQLALCHEMY_DATABASE_URL}")
else:
    # Modo MySQL - Laragon por defecto (desarrollo local)
    SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:@localhost:3306/proyecto_4b"
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    print(f"[DB] Usando MySQL: proyecto_4b en localhost")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
