import boto3
from botocore.exceptions import NoCredentialsError
import os
import uuid

# ==========================================
# CONFIGURACIÓN DE AWS S3
# ==========================================


AWS_ACCESS_KEY_ID = "lacredencial"
AWS_SECRET_ACCESS_KEY = "laotracredencial"
AWS_REGION = "us-east-1" 
S3_BUCKET_NAME = "proyecto-multimedia-gridly"

def get_s3_client():
    return boto3.client(
        's3',
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name=AWS_REGION
    )

def upload_file_to_s3(file_obj, filename: str) -> str:
    """
    Sube un archivo a S3 y retorna la URL pública.
    """
    s3 = get_s3_client()
    
    # Generar un nombre único para no sobrescribir archivos
    unique_filename = f"{uuid.uuid4()}_{filename}"
    
    try:
        # Subir archivo al bucket
        # Extra: se puede configurar ExtraArgs={'ACL': 'public-read'} si el bucket lo permite
        # para que la URL sea pública directamente.
        s3.upload_fileobj(
            file_obj, 
            S3_BUCKET_NAME, 
            unique_filename,
            ExtraArgs={'ContentType': 'auto'} # Puedes mejorar esto detectando el content_type
        )
        
        # Construir y retornar la URL
        url = f"https://{S3_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{unique_filename}"
        return url
        
    except NoCredentialsError:
        print("Error: No se encontraron credenciales de AWS S3.")
        return ""
    except Exception as e:
        print(f"Error al subir a S3: {e}")
        return ""
