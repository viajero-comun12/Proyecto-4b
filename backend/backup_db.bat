@echo off
setlocal
echo ==============================================
echo       REALIZANDO BACKUP DE LA BASE DE DATOS
echo ==============================================

if not exist "mosaiko_demo.db" (
    echo [ERROR] No se encuentra mosaiko_demo.db en la carpeta actual.
    echo Asegurese de ejecutar este script desde la carpeta backend.
    pause
    exit /b
)

:: Obtener fecha y hora en formato YYYY-MM-DD_HH-MM
for /f "tokens=1-3 delims=/ " %%a in ('date /t') do (set mydate=%%c-%%b-%%a)
for /f "tokens=1-2 delims=: " %%a in ('time /t') do (set mytime=%%a-%%b)
set timestamp=%mydate%_%mytime%

set backup_filename=mosaiko_backup_%timestamp%.db

copy mosaiko_demo.db "%backup_filename%" >nul
if %errorlevel% equ 0 (
    echo [OK] Copia de seguridad creada con exito: %backup_filename%
) else (
    echo [ERROR] Hubo un problema al crear la copia de seguridad.
)

pause
