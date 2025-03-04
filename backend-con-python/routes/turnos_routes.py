from flask import Blueprint, jsonify
from db import get_db_connection
from models.turno import Turno
from controllers.turnos_controller import registrar_turno, obtener_turnos, eliminar_turno, actualizar_turno  # Importar las funciones

turnos_bp = Blueprint("turnos", __name__, url_prefix="/turnos")

@turnos_bp.route("/", methods=["GET"])
def obtener_turnos_route():
    return obtener_turnos()

# Registrar la ruta POST para crear un turno
@turnos_bp.route("/", methods=["POST"])
def crear_turno():
    return registrar_turno()

# Registrar la ruta DELETE para eliminar un turno
@turnos_bp.route("/<int:turno_id>", methods=["DELETE"])
def eliminar_turno_route(turno_id):
    return eliminar_turno(turno_id)

# Registrar la ruta PUT para actualizar un turno
@turnos_bp.route("/<int:turno_id>", methods=["PUT"])
def actualizar_turno_route(turno_id):
    return actualizar_turno(turno_id)
