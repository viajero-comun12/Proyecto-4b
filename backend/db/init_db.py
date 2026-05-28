import pymysql
import sys
import os

# Asegurar que podemos importar modelos y conexión
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db.conexion import engine, Base, SessionLocal
from models import Publicacion

def init_database():
    print("Conectando a MySQL para crear la base de datos si no existe...")
    try:
        # Conectar al servidor MySQL (asumiendo configuración de Laragon: root, sin clave)
        conn = pymysql.connect(host='localhost', user='root', password='')
        cursor = conn.cursor()
        
        # Crear la base de datos
        cursor.execute("CREATE DATABASE IF NOT EXISTS proyecto_4b;")
        print("Base de datos 'proyecto_4b' creada o ya existía.")
        
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error al conectar a MySQL: {e}")
        print("Asegúrate de que Laragon/MySQL esté encendido.")
        return

    print("Creando tablas en la base de datos...")
    # Crear las tablas
    Base.metadata.create_all(bind=engine)
    print("Tablas creadas.")

    print("Insertando objeto de prueba...")
    db = SessionLocal()
    try:
        # Verificar si ya existe alguna publicación para no duplicar el objeto de prueba
        if db.query(Publicacion).count() == 0:
            publicacion_prueba = Publicacion(
                titulo="Mi primera publicación",
                descripcion="Esta es una publicación de prueba generada automáticamente.",
                tags="#prueba,#mosaiko",
                categoria_id=1,
                url_multimedia="https://via.placeholder.com/600x400.png?text=Objeto+de+Prueba"
            )
            db.add(publicacion_prueba)
            db.commit()
            print("Objeto de prueba insertado correctamente.")
        else:
            print("Ya existen publicaciones, no se insertó el objeto de prueba.")
    except Exception as e:
        print(f"Error al insertar el objeto de prueba: {e}")
    finally:
        db.close()
        
    print("¡Base de datos lista para usarse!")

if __name__ == "__main__":
    init_database()
