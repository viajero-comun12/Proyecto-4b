@echo off
echo Iniciando servidor FastAPI de Proyecto 4b...
call venv\Scripts\activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
pause
