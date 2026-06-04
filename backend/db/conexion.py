import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Usamos SQLite permanentemente para todas las etapas del proyecto
SQLALCHEMY_DATABASE_URL = "sqlite:///./mosaiko_demo.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}  # Necesario para SQLite
)
print(f"[DB] Usando SQLite permanentemente: {SQLALCHEMY_DATABASE_URL}")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
