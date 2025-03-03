from db import get_db_connection
from flask import jsonify, request

def obtener_turnos():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM turnos WHERE estado ='espera' ")
    turnos = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(turnos)

def crear_turno():
    data = request.json
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO turnos (codigo, servicio, estado, fecha) VALUES (%s, %s, %s, NOW()) RETURNING *",
                (data['codigo'], data['servicio'], data['estado']))
    turno = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return jsonify(turno)
