@echo off
setlocal
echo ==============================================
echo       RESTAURAR O CAMBIAR BASE DE DATOS
echo ==============================================

echo A continuacion, se reemplazara la base de datos principal (mosaiko_demo.db)
echo por el archivo de backup o de prueba que elijas.
echo.
echo Los backups disponibles en esta carpeta son:
dir /b *.db | findstr /v "^mosaiko_demo.db$"
echo.

set /p backup_file="Ingresa el nombre del archivo exacto para restaurar (ej. mosaiko_backup_2023.db): "

if not exist "%backup_file%" (
    echo [ERROR] El archivo '%backup_file%' no existe en esta carpeta.
    pause
    exit /b
)

echo.
echo ADVERTENCIA: Esto sobrescribira los datos actuales de mosaiko_demo.db
echo Puedes hacer un backup antes si lo deseas.
set /p confirm="Estas seguro de continuar? (S/N): "

if /i "%confirm%" neq "S" (
    echo Operacion cancelada.
    pause
    exit /b
)

copy /Y "%backup_file%" mosaiko_demo.db >nul
if %errorlevel% equ 0 (
    echo [OK] Base de datos '%backup_file%' restaurada exitosamente como la base principal.
) else (
    echo [ERROR] Hubo un problema al restaurar la base de datos.
)

pause
