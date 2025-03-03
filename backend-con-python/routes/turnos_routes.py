from flask import Blueprint, jsonify
from db import get_db_connection
from models.turno import Turno

turnos_bp = Blueprint("turnos", __name__)

@turnos_bp.route("/", methods=["GET"])
def obtener_turnos():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM turnos WHERE estado ='espera' ")
    turnos_data = cur.fetchall()
    cur.close()
    conn.close()

    turnos = [Turno(*turno).to_dict() for turno in turnos_data]
    return jsonify(turnos)
