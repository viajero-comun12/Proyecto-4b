@echo off
echo Iniciando servidor FastAPI de Proyecto 4b...
call venv\Scripts\activate
pip install --upgrade --force-reinstall pydantic pydantic-core fastapi
uvicorn main:app --reload --host 0.0.0.0 --port 8000
npm install react-icons --save
pause
