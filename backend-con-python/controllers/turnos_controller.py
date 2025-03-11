from db import get_db_connection
from flask import jsonify, request
from datetime import datetime
from models.turno import Turno

def registrar_turno():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No se proporcionaron datos"}), 400

        try:
            codigo_mascota = int(data.get("codigo_mascota"))
        except (TypeError, ValueError):
            return jsonify({"error": "Código de mascota inválido"}), 400

        nombre_mascota = data.get("nombre_mascota")
        servicio = data.get("servicio")
        id_veterinario = data.get("id_veterinario") or None
        estado = "espera"
        fecha = datetime.now().strftime("%Y-%m-%d")

        if not codigo_mascota or not nombre_mascota or not servicio:
            return jsonify({"error": "Faltan datos obligatorios"}), 400

        conn = get_db_connection()
        cur = conn.cursor()

        # Verificar si la mascota ya está registrada por su código
        cur.execute("SELECT id FROM mascotas WHERE id = %s", (codigo_mascota,))
        mascota = cur.fetchone()

        if mascota:
            id_mascota = mascota["id"]
        else:
            # Insertar nueva mascota
            cur.execute("INSERT INTO mascotas (id, nombre) VALUES (%s, %s) RETURNING id", (codigo_mascota, nombre_mascota))
            id_mascota = cur.fetchone()["id"]
            print("Nueva mascota registrada:", id_mascota)  # Depuración

        # Obtener último turno del día para el servicio
        cur.execute(
            "SELECT codigo FROM turnos WHERE servicio = %s AND fecha = %s ORDER BY id DESC LIMIT 1",
            (servicio, fecha)
        )
        last_turno = cur.fetchone()
        print("Último turno obtenido:", last_turno)  # Depuración
        if last_turno:
            try:
                last_num = int(last_turno["codigo"][2:])
                numero = (last_num + 1) if last_num < 99 else 1
            except ValueError:
                return jsonify({"error": "Formato de código inválido"}), 500
        else:
            numero = 1

        # Generar el código según el servicio
        if servicio == "control":
            codigo = "CL" + str(numero).zfill(2)
        else:
            codigo = servicio[0].upper() + str(numero).zfill(2)

        # Insertar el nuevo turno
        cur.execute(
            "INSERT INTO turnos (codigo, servicio, estado, fecha, mascota_id, veterinario_id) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id, codigo, servicio, estado, fecha, mascota_id, veterinario_id",
            (codigo, servicio, estado, fecha, id_mascota, id_veterinario),
        )
        nuevo_turno = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()

        print("Turno registrado exitosamente:", nuevo_turno)  # Depuración
        # Estructurar la respuesta
        turno_dict = {
            "id": nuevo_turno["id"],
            "codigo": nuevo_turno["codigo"],
            "servicio": nuevo_turno["servicio"],
            "estado": nuevo_turno["estado"],
            "fecha": nuevo_turno["fecha"],
            "mascota_id": nuevo_turno["mascota_id"],  
            "veterinario_id": nuevo_turno["veterinario_id"],
        }

        return jsonify({"message": "Turno registrado", "turno": turno_dict}), 201

    except Exception as e:
        print("Error en registrar_turno:", str(e))  # Depuración
        return jsonify({"error": str(e)}), 500

def obtener_turnos():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT t.id, t.codigo, t.servicio, t.estado, t.fecha, t.veterinario_id, t.modulo, m.nombre AS nombre_mascota, v.nombre AS nombre_veterinario
            FROM turnos t
            LEFT JOIN mascotas m ON t.mascota_id = m.id
            LEFT JOIN veterinarios v ON t.veterinario_id = v.id
        """)
        turnos_data = cur.fetchall()
        cur.close()
        conn.close()

        turnos = []
        for turno in turnos_data:
            turnos.append({
                "id": turno["id"],
                "codigo": turno["codigo"],
                "servicio": turno["servicio"],
                "estado": turno["estado"],
                "fecha": turno["fecha"],
                "veterinario_id": turno["veterinario_id"],
                "modulo": turno["modulo"],
                "nombre_mascota": turno["nombre_mascota"],
                "nombre_veterinario": turno["nombre_veterinario"]
            })

        return jsonify(turnos)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def eliminar_turno(turno_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM turnos WHERE id = %s", (turno_id,))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"message": "Turno eliminado"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def actualizar_turno(turno_id):
    try:
        data = request.get_json()
        estado = data.get("estado")
        modulo = data.get("modulo")

        if estado not in ["espera", "proceso", "finalizado"]:
            return jsonify({"error": "Estado inválido"}), 400

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            "UPDATE turnos SET estado = %s, modulo = %s WHERE id = %s",
            (estado, modulo, turno_id)
        )
        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"message": "Turno actualizado"}), 200
    except Exception as e:
        print("Error en actualizar_turno:", str(e))  # Depuración
        return jsonify({"error": str(e)}), 500

