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
            "SELECT codigo FROM turnos WHERE servicio = %s AND fecha = %s ORDER BY id DESC LIMIT 1",
            (servicio, fecha),
        )
        last_turno = cur.fetchone()
        numero = int(last_turno[0][1:]) + 1 if last_turno else 1
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
