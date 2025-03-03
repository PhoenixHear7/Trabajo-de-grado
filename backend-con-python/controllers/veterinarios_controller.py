from db import get_db_connection
from flask import jsonify

def obtener_veterinarios():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM veterinarios")
    veterinarios = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(veterinarios)
