from flask import Blueprint, jsonify
from db import get_db_connection
from models.turno import Turno
from controllers.turnos_controller import registrar_turno  # Importar la función

turnos_bp = Blueprint("turnos", __name__, url_prefix="/turnos")

@turnos_bp.route("/", methods=["GET"])
def obtener_turnos():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM turno WHERE estado = 'en espera'")  # Asegúrate de que el nombre de la tabla es correcto
    turnos_data = cur.fetchall()
    cur.close()
    conn.close()

    turnos = [Turno(*turno).to_dict() for turno in turnos_data]
    return jsonify(turnos)

# Registrar la ruta POST para crear un turno
@turnos_bp.route("/", methods=["POST"])
def crear_turno():
    return registrar_turno()
