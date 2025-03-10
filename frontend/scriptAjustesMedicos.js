document.addEventListener("DOMContentLoaded", function () {
    const nombre_Veterinario = document.getElementById("nombreVetrinario");
    const apellido_Veterinario = document.getElementById("apellidoVeterinario");
    const rol = document.getElementById("rol");
    const crearVeterinarioButton = document.getElementById("crearVeterinario");
    const listaVeterinarios = document.getElementById("listaVeterinarios");

async function registra_veterinario() {
        const nombre = nombreVeterinarioInput.value.trim();
        const apellido = apellidoVeterinarioInput.value.trim();
        const rol = rolInput.value.trim();

        if (!nombre || !apellido || !rol) {
            alert("Por favor, completa todos los campos antes de crear el veterinario.");
            return;
        }

        const veterinarioData = {
            nombre,
            apellido,
            rol
        };

        try {
            const response = await fetch("http://127.0.0.1:5000/veterinarios"){
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(veterinarioData)
            }
    }