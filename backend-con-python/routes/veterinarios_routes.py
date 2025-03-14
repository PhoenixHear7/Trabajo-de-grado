from flask import Blueprint
from controllers.veterinarios_controller import obtener_veterinarios, registrar_veterinarios, actualizar_veterinario, eliminar_veterinario

veterinarios_bp = Blueprint("veterinarios", __name__, url_prefix="/veterinarios")

@veterinarios_bp.route("/", methods=["GET"])
def obtener_veterinarios_route():
    return obtener_veterinarios()

@veterinarios_bp.route("/", methods=["POST"])
def registrar_veterinarios_route():
    return registrar_veterinarios()

@veterinarios_bp.route("/<int:veterinario_id>", methods=["PUT"])
def actualizar_veterinario_route(veterinario_id):
    return actualizar_veterinario(veterinario_id)

@veterinarios_bp.route("/<int:veterinario_id>", methods=["DELETE"])
def eliminar_veterinario_route(veterinario_id):
    return eliminar_veterinario(veterinario_id)