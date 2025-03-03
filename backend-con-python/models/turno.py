class Turno:
    def __init__(self, id_turno, codigo, servicio, estado, fecha, veterinario_id):
        self.id_turno = id_turno
        self.codigo = codigo
        self.servicio = servicio
        self.estado = estado
        self.fecha = fecha
        self.veterinario_id = veterinario_id

    def to_dict(self):
        return {
            "id_turno": self.id_turno,
            "codigo": self.codigo,
            "servicio": self.servicio,
            "estado": self.estado,
            "fecha": self.fecha,
            "veterinario_id": self.veterinario_id
        }
