class Veterinario:
    def __init__(self, id_veterinario, nombre, rol):
        self.id_veterinario = id_veterinario
        self.nombre = nombre
        self.rol = rol

    def to_dict(self):
        return {
            "id_veterinario": self.id_veterinario,
            "nombre": self.nombre,
            "rol": self.rol
        }
