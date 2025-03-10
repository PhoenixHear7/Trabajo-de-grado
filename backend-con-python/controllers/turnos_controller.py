from db import get_db_connection
from flask import jsonify, request
from datetime import datetime

def registrar_turno():
    try:
        data = request.get_json()
        nombre_mascota = data.get("nombre_mascota")
        servicio = data.get("servicio")
        id_veterinario = data.get("id_veterinario") or None
        estado = "espera"
        fecha = datetime.now().strftime("%Y-%m-%d")

        conn = get_db_connection()
        cur = conn.cursor()

        # Verificar si la mascota ya está registrada
        cur.execute("SELECT id FROM mascotas WHERE nombre = %s", (nombre_mascota,))
        mascota = cur.fetchone()

        if mascota:
            id_mascota = mascota[0]
        else:
            # Insertar nueva mascota
            cur.execute("INSERT INTO mascotas (nombre) VALUES (%s) RETURNING id", (nombre_mascota,))
            id_mascota = cur.fetchone()[0]

        # Obtener último turno del día para el servicio
        cur.execute(
            "SELECT codigo FROM turnos WHERE servicio = %s ORDER BY id DESC LIMIT 1",
            (servicio,)
        )
        last_turno = cur.fetchone()
        if last_turno:
            last_num = int(last_turno[0][2:])
            numero = (last_num + 1) if last_num < 99 else 1
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

        # Estructurar la respuesta
        turno_dict = {
            "id": nuevo_turno[0],
            "codigo": nuevo_turno[1],
            "servicio": nuevo_turno[2],
            "estado": nuevo_turno[3],
            "fecha": nuevo_turno[4],
            "mascota_id": nuevo_turno[5],
            "veterinario_id": nuevo_turno[6],
        }

        return jsonify({"message": "Turno registrado", "turno": turno_dict}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

def obtener_turnos():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT t.id, t.codigo, t.servicio, t.estado, t.fecha, t.mascota_id, t.veterinario_id, 
                   m.nombre AS nombre_mascota, v.nombre AS nombre_veterinario 
            FROM turnos t 
            JOIN mascotas m ON t.mascota_id = m.id 
            LEFT JOIN veterinarios v ON t.veterinario_id = v.id 
            WHERE t.estado = 'espera'
        """)
        turnos_data = cur.fetchall()
        cur.close()
        conn.close()

        turnos = []
        for turno in turnos_data:
            turnos.append({
                "id": turno[0],
                "codigo": turno[1],
                "servicio": turno[2],
                "estado": turno[3],
                "fecha": turno[4],
                "mascota_id": turno[5],
                "veterinario_id": turno[6],
                "nombre_mascota": turno[7],
                "nombre_veterinario": turno[8]
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
        return jsonify({"error": str(e)}), 500
