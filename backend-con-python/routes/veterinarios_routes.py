from flask import Blueprint, jsonify
from db import get_db_connection
from models.veterinario import Veterinario

veterinarios_bp = Blueprint("veterinarios", __name__)

@veterinarios_bp.route("/", methods=["GET"])
def obtener_veterinarios():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM veterinarios")
    veterinarios_data = cur.fetchall()
    cur.close()
    conn.close()

    veterinarios = [Veterinario(*vet).to_dict() for vet in veterinarios_data]
    return jsonify(veterinarios)
