from flask import Blueprint
from controllers.turnos_controller import obtener_turnos, actualizar_turno, eliminar_turno, registrar_turno

turnos_bp = Blueprint("turnos", __name__, url_prefix="/turnos")

@turnos_bp.route("/", methods=["GET"])
def obtener_turnos_route():
    return obtener_turnos()

@turnos_bp.route("/", methods=["POST"])
def registrar_turno_route():
    return registrar_turno()

@turnos_bp.route("/<int:turno_id>", methods=["PUT"])
def actualizar_turno_route(turno_id):
    return actualizar_turno(turno_id)

@turnos_bp.route("/<int:turno_id>", methods=["DELETE"])
def eliminar_turno_route(turno_id):
    return eliminar_turno(turno_id)
