from db.conexion import engine, Base
import models

print("¡ADVERTENCIA! Esto borrará todas las tablas existentes y las volverá a crear.")
confirmacion = input("¿Estás seguro? Escribe 'si' para continuar: ")

if confirmacion.lower() == 'si':
    print("Borrando tablas antiguas...")
    Base.metadata.drop_all(bind=engine)
    print("Creando nuevas tablas con relaciones...")
    Base.metadata.create_all(bind=engine)
    print("¡Base de datos restablecida correctamente!")
else:
    print("Operación cancelada.")
