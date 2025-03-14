from db import get_db_connection
from flask import jsonify, request

def obtener_veterinarios():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT id, nombre, rol FROM veterinarios")
        veterinarios_data = cur.fetchall()
        cur.close()
        conn.close()

        veterinarios = []
        for veterinario in veterinarios_data:
            veterinarios.append({
                "id": veterinario["id"],
                "nombre": veterinario["nombre"],
                "rol": veterinario["rol"]
            })

        return jsonify(veterinarios)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def registrar_veterinarios():
    try:
        data = request.get_json()
        nombre = data.get("nombre")
        apellido = data.get("apellido")
        rol = data.get("rol")

        if not nombre or not apellido or not rol:
            return jsonify({"error": "Faltan datos obligatorios"}), 400

        nombre_completo = f"{nombre} {apellido}"

        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("INSERT INTO veterinarios (nombre, rol) VALUES (%s, %s) RETURNING id, nombre, rol", (nombre_completo, rol))
        nuevo_veterinario = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"message": "Veterinario registrado", "veterinario": nuevo_veterinario}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def actualizar_veterinario(veterinario_id):
    try:
        data = request.get_json()
        nombre = data.get("nombre")
        apellido = data.get("apellido")
        rol = data.get("rol")

        if not nombre or not apellido or not rol:
            return jsonify({"error": "Faltan datos obligatorios"}), 400

        nombre_completo = f"{nombre} {apellido}"

        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("UPDATE veterinarios SET nombre = %s, rol = %s WHERE id = %s RETURNING id, nombre, rol", (nombre_completo, rol, veterinario_id))
        veterinario_actualizado = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"message": "Veterinario actualizado", "veterinario": veterinario_actualizado}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def eliminar_veterinario(veterinario_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM veterinarios WHERE id = %s", (veterinario_id,))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"message": "Veterinario eliminado"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500