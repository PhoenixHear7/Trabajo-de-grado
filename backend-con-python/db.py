import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

# Cargar las variables de entorno desde el archivo .env
load_dotenv()

def get_db_connection():
    try:
        conn = psycopg2.connect(
            host=os.getenv("DB_HOST"),
            database=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            port=os.getenv("DB_PORT"),
            cursor_factory=RealDictCursor
        )
        return conn
    except Exception as e:
        print(f"Error al conectar a la base de datos: {e}")
        raise e
