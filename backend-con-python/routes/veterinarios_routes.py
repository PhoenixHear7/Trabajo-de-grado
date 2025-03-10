from flask import Blueprint
from controllers.veterinarios_controller import obtener_veterinarios

veterinarios_bp = Blueprint("veterinarios", __name__, url_prefix="/veterinarios")

@veterinarios_bp.route("/", methods=["GET"])
def obtener_veterinarios_route():
    return obtener_veterinarios()