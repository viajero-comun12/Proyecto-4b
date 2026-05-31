@echo off
echo Iniciando configuracion del backend...
echo Creando entorno virtual...
python -m venv venv

echo Activando entorno virtual e instalando dependencias...
call venv\Scripts\activate
pip install -r requirements.txt

echo Inicializando la base de datos (Asegurate de que Laragon/MySQL este encendido)...
python db\init_db.py

echo Todo listo! Puedes iniciar el servidor usando el archivo iniciar_servidor.bat
pause
