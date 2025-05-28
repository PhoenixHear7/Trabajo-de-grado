class Turno:
    def __init__(self, id_turno, codigo, servicio, estado, fecha, 
                 veterinario_id=None, modulo=None, codigo_mascota=None, 
                 nombre_mascota=None, nombre_veterinario=None):
        self.id_turno = id_turno
        self.codigo = codigo
        self.servicio = servicio
        self.estado = estado
        self.fecha = fecha
        self.veterinario_id = veterinario_id
        self.modulo = modulo
        self.codigo_mascota = codigo_mascota
        self.nombre_mascota = nombre_mascota
        self.nombre_veterinario = nombre_veterinario

    def to_dict(self):
        return {
            "id_turno": self.id_turno,
            "codigo": self.codigo,
            "servicio": self.servicio,
            "estado": self.estado,
            "fecha": self.fecha,
            "veterinario_id": self.veterinario_id,
            "modulo": self.modulo,
            "codigo_mascota": self.codigo_mascota,
            "nombre_mascota": self.nombre_mascota,
            "nombre_veterinario": self.nombre_veterinario
        }
