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

def registrar_veterinarios():
    try:
        data = request.get_json()
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("INSERT * FROM veterinarios")
        veterinarios = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify(veterinarios)
    except Exception as e:
        return jsonify({"error": str(e)}), 500