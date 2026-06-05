"""
export_to_sqlite.py
====================
Exporta todos los datos de MySQL (Laragon/proyecto_4b)
a un archivo SQLite portable: mosaiko_demo.db

Uso:
    python export_to_sqlite.py

Resultado:
    backend/mosaiko_demo.db  ← listo para GitHub y EC2
"""

import sys
import os
import sqlite3
from datetime import datetime

# ── Añadir el directorio raíz al path ──────────────────────
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

SQLITE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "mosaiko_demo.db")

def log(msg):
    # Reemplazar emojis por texto ASCII para compatibilidad con consola Windows
    msg = msg.replace("✅","[OK]").replace("🗑️","[DEL]").replace("📐","[ESQ]")
    msg = msg.replace("📦","[TAB]").replace("⚠️","[WARN]").replace("📁","[DIR]")
    msg = msg.replace("•","*")
    print(f"  {msg}")


def exportar():
    print("\n" + "="*55)
    print("  EXPORTANDO MySQL -> SQLite (mosaiko_demo.db)")
    print("="*55)

    # ── 1. Conectar a MySQL ─────────────────────────────────
    try:
        import pymysql
        mysql_conn = pymysql.connect(
            host='localhost', port=3306,
            user='root', password='',
            database='proyecto_4b',
            charset='utf8mb4'
        )
        mysql_cur = mysql_conn.cursor(pymysql.cursors.DictCursor)
        log("✅ Conectado a MySQL (Laragon/proyecto_4b)")
    except Exception as e:
        print(f"\n❌ No se pudo conectar a MySQL: {e}")
        print("   Asegúrate de que Laragon esté encendido y la BDD 'proyecto_4b' exista.")
        sys.exit(1)

    # ── 2. Borrar SQLite anterior y crear uno nuevo ─────────
    if os.path.exists(SQLITE_PATH):
        os.remove(SQLITE_PATH)
        log("🗑️  Eliminado mosaiko_demo.db anterior")

    sqlite_conn = sqlite3.connect(SQLITE_PATH)
    sqlite_conn.execute("PRAGMA foreign_keys = ON")
    sqlite_cur = sqlite_conn.cursor()
    log("✅ Creado nuevo mosaiko_demo.db")

    # ── 3. Crear esquema SQLite ─────────────────────────────
    log("📐 Creando esquema...")
    sqlite_cur.executescript("""
        CREATE TABLE IF NOT EXISTS usuarios (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            username        TEXT UNIQUE NOT NULL,
            email           TEXT UNIQUE NOT NULL,
            hashed_password TEXT NOT NULL,
            profile_pic     TEXT,
            biografia       TEXT,
            fecha_registro  TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS publicaciones (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo          TEXT NOT NULL,
            descripcion     TEXT,
            tags            TEXT,
            categoria_id    INTEGER,
            url_multimedia  TEXT NOT NULL,
            fecha_creacion  TEXT DEFAULT (datetime('now')),
            usuario_id      INTEGER REFERENCES usuarios(id)
        );

        CREATE TABLE IF NOT EXISTS comentarios (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            texto           TEXT,
            fecha_creacion  TEXT DEFAULT (datetime('now')),
            publicacion_id  INTEGER REFERENCES publicaciones(id),
            usuario_id      INTEGER REFERENCES usuarios(id)
        );

        CREATE TABLE IF NOT EXISTS tableros (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre          TEXT NOT NULL,
            secreto         INTEGER DEFAULT 0,
            fecha_creacion  TEXT DEFAULT (datetime('now')),
            usuario_id      INTEGER REFERENCES usuarios(id)
        );

        CREATE TABLE IF NOT EXISTS tablero_publicacion (
            tablero_id      INTEGER REFERENCES tableros(id),
            publicacion_id  INTEGER REFERENCES publicaciones(id),
            PRIMARY KEY (tablero_id, publicacion_id)
        );

        CREATE TABLE IF NOT EXISTS collages (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo          TEXT NOT NULL,
            layout_data     TEXT,
            fecha_creacion  TEXT DEFAULT (datetime('now')),
            usuario_id      INTEGER REFERENCES usuarios(id)
        );

        CREATE TABLE IF NOT EXISTS notificaciones (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            texto           TEXT,
            leida           INTEGER DEFAULT 0,
            fecha_creacion  TEXT DEFAULT (datetime('now')),
            usuario_id      INTEGER REFERENCES usuarios(id)
        );

        CREATE TABLE IF NOT EXISTS mensajes (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            texto           TEXT,
            fecha_envio     TEXT DEFAULT (datetime('now')),
            remitente_id    INTEGER REFERENCES usuarios(id),
            destinatario_id INTEGER REFERENCES usuarios(id)
        );
    """)
    sqlite_conn.commit()
    log("✅ Esquema creado")

    # ── 4. Función genérica de copia ────────────────────────
    def copiar_tabla(tabla, columnas):
        mysql_cur.execute(f"SELECT {', '.join(columnas)} FROM {tabla}")
        filas = mysql_cur.fetchall()
        if not filas:
            log(f"   ⚠️  {tabla}: sin datos")
            return 0

        placeholders = ", ".join(["?"] * len(columnas))
        cols_str = ", ".join(columnas)
        sql = f"INSERT OR IGNORE INTO {tabla} ({cols_str}) VALUES ({placeholders})"

        for fila in filas:
            valores = []
            for col in columnas:
                val = fila[col]
                # Convertir datetime a string ISO
                if isinstance(val, datetime):
                    val = val.strftime("%Y-%m-%d %H:%M:%S")
                # Convertir bool a int para SQLite
                elif isinstance(val, bool):
                    val = int(val)
                valores.append(val)
            sqlite_cur.execute(sql, valores)

        sqlite_conn.commit()
        log(f"   ✅ {tabla}: {len(filas)} fila(s) exportada(s)")
        return len(filas)

    # ── 5. Exportar cada tabla en orden (respetando FKs) ────
    print("\nExportando tablas:")
    total = 0
    total += copiar_tabla("usuarios",     ["id","username","email","hashed_password","profile_pic","biografia","fecha_registro"])
    total += copiar_tabla("publicaciones",["id","titulo","descripcion","tags","categoria_id","url_multimedia","fecha_creacion","usuario_id"])
    total += copiar_tabla("comentarios",  ["id","texto","fecha_creacion","publicacion_id","usuario_id"])
    total += copiar_tabla("tableros",     ["id","nombre","secreto","fecha_creacion","usuario_id"])
    total += copiar_tabla("tablero_publicacion", ["tablero_id","publicacion_id"])
    total += copiar_tabla("collages",     ["id","titulo","layout_data","fecha_creacion","usuario_id"])
    total += copiar_tabla("notificaciones",["id","texto","leida","fecha_creacion","usuario_id"])
    total += copiar_tabla("mensajes",     ["id","texto","fecha_envio","remitente_id","destinatario_id"])

    # ── 6. Cerrar conexiones ────────────────────────────────
    mysql_cur.close()
    mysql_conn.close()
    sqlite_conn.close()

    print("\n" + "="*55)
    print(f"  [OK] EXPORTACION COMPLETA - {total} filas en total")
    print(f"  [DIR] Archivo: {SQLITE_PATH}")
    print("="*55)
    print("\n  El archivo mosaiko_demo.db esta listo para:")
    print("  * Subir a GitHub como respaldo de datos")
    print("  * Usar en EC2 con DATABASE_URL=sqlite:///./mosaiko_demo.db")
    print()

if __name__ == "__main__":
    exportar()
