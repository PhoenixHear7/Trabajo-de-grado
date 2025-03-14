document.addEventListener("DOMContentLoaded", function () {
    const nombreVeterinarioInput = document.getElementById("nombreVeterinario");
    const apellidoVeterinarioInput = document.getElementById("apellidoVeterinario");
    const rolInput = document.getElementById("rol");
    const crearVeterinarioButton = document.getElementById("crearVeterinario");
    const listaVeterinarios = document.getElementById("listaVeterinarios");

    async function registrarVeterinario() {
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
            const response = await fetch("http://127.0.0.1:5000/veterinarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(veterinarioData)
            });

            if (response.ok) {
                const result = await response.json();
                alert("Veterinario registrado exitosamente");
                cargarVeterinarios();
            } else {
                const error = await response.json();
                alert("Error al registrar el veterinario: " + error.error);
            }
        } catch (error) {
            console.error("Error al registrar el veterinario:", error);
        }
    }

    async function cargarVeterinarios() {
        try {
            const response = await fetch("http://127.0.0.1:5000/veterinarios");
            const veterinarios = await response.json();
            listaVeterinarios.innerHTML = "";

            veterinarios.forEach(vet => {
                const vetElement = document.createElement("li");
                vetElement.innerHTML = `
                    ${vet.nombre} - ${vet.rol}
                    <button class="delete-button" data-id="${vet.id}">Eliminar</button>
                `;
                listaVeterinarios.appendChild(vetElement);

                vetElement.querySelector(".delete-button").addEventListener("click", async () => {
                    try {
                        const response = await fetch(`http://127.0.0.1:5000/veterinarios/${vet.id}`, { method: "DELETE" });
                        if (response.ok) {
                            alert("Veterinario eliminado exitosamente");
                            cargarVeterinarios();
                        } else {
                            const error = await response.json();
                            alert("Error al eliminar el veterinario: " + error.error);
                        }
                    } catch (error) {
                        console.error("Error al eliminar el veterinario:", error);
                    }
                });
            });
        } catch (error) {
            console.error("Error al cargar los veterinarios:", error);
        }
    }

    crearVeterinarioButton.addEventListener("click", registrarVeterinario);
    cargarVeterinarios();
});
