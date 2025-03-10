document.addEventListener("DOMContentLoaded", function () {
    const mascotaInput = document.getElementById("mascota");
    const codigoMascotaInput = document.getElementById("codigo_mascota");
    const servicioInput = document.getElementById("servicio");
    const veterinarioSelect = document.getElementById("veterinario");
    const crearButton = document.getElementById("crearTurno");
    const emergencyButton = document.getElementById("emergencyButton");
    const listaTurnos = document.getElementById("listaTurnos");
    const settingsButton = document.getElementById("settings-button");
    const modal = document.getElementById("myModal");
    const modalIframe = document.getElementById("modal-iframe");
    const closeModal = document.querySelector(".close");
    const nombreVeterinarioInput = document.getElementById("nombreVeterinario");
    const apellidoVeterinarioInput = document.getElementById("apellidoVeterinario");
    const rolInput = document.getElementById("rol");
    const crearVeterinarioButton = document.getElementById("crearVeterinario");
    const listaVeterinarios = document.getElementById("listaVeterinarios");

    let turnoEnEdicion = null;

    if (!mascotaInput || !codigoMascotaInput || !servicioInput || !veterinarioSelect || !crearButton || !emergencyButton || !listaTurnos || !settingsButton || !modal || !modalIframe || !closeModal) {
        console.error("Error: No se encontraron todos los elementos necesarios en el DOM.");
        return;
    }

    settingsButton.addEventListener("click", () => {
        modalIframe.src = "ajusteMedicos.html";
        modal.style.display = "flex";
    });

    closeModal.addEventListener("click", () => modal.style.display = "none");
    window.addEventListener("click", (event) => { if (event.target == modal) modal.style.display = "none"; });

    async function crearTurno(esEmergencia = false) {
        const codigo_mascota = codigoMascotaInput.value.trim();
        const nombre_mascota = mascotaInput.value.trim();
        const servicio = servicioInput.value;
        const id_veterinario = veterinarioSelect.value ? parseInt(veterinarioSelect.value) : null;

        if (!codigo_mascota || !nombre_mascota || !servicio) {
            alert("Por favor, completa todos los campos antes de crear el turno.");
            return;
        }

        const turnoData = {
            codigo_mascota,
            nombre_mascota,
            servicio,
            id_veterinario: id_veterinario ? parseInt(id_veterinario) : null
        };

        try {
            const method = turnoEnEdicion ? "PUT" : "POST";
            const url = turnoEnEdicion ? `http://127.0.0.1:5000/turnos/${turnoEnEdicion}` : "http://127.0.0.1:5000/turnos/";

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(turnoData)
            });

            if (response.ok) {
                const result = await response.json();
                alert(turnoEnEdicion ? "Turno actualizado exitosamente" : "Turno registrado exitosamente");
                turnoEnEdicion = null;
                actualizarListaTurnos();
            } else {
                const error = await response.json();
                alert("Error al registrar el turno: " + error.error);
            }
        } catch (error) {
            console.error("Error al registrar el turno:", error);
        }
    }

    async function actualizarListaTurnos() {
        try {
            const response = await fetch("http://127.0.0.1:5000/turnos/");
            const turnos = await response.json();
            listaTurnos.innerHTML = "";

            turnos.forEach(turno => {
                const turnoElement = document.createElement("div");
                turnoElement.classList.add("turno-item");
                turnoElement.innerHTML = `
                    <strong>Código:</strong> <span style="color: red;">${turno.codigo}</span><br>
                    <strong>Mascota:</strong> ${turno.nombre_mascota} <br>
                    <strong>Servicio:</strong> ${turno.servicio} <br>
                    <strong>Veterinario:</strong> ${turno.nombre_veterinario || 'N/A'} <br>
                    <strong>Estado:</strong> <span class="turno-estado">${turno.estado}</span> <br>
                    <div class="button-container">
                        <button class="edit-button">Editar</button>
                        <button class="delete-button">Eliminar</button>
                    </div>
                `;

                turnoElement.querySelector(".delete-button").addEventListener("click", async () => {
                    try {
                        const response = await fetch(`http://127.0.0.1:5000/turnos/${turno.id}`, { method: "DELETE" });
                        if (response.ok) {
                            turnoElement.remove();
                            alert("Turno eliminado exitosamente");
                        } else {
                            const error = await response.json();
                            alert("Error al eliminar el turno: " + error.error);
                        }
                    } catch (error) {
                        console.error("Error al eliminar el turno:", error);
                    }
                });

                turnoElement.querySelector(".edit-button").addEventListener("click", () => {
                    codigoMascotaInput.value = turno.codigo_mascota;
                    mascotaInput.value = turno.nombre_mascota;
                    servicioInput.value = turno.servicio;
                    veterinarioSelect.value = turno.veterinario_id;
                    turnoEnEdicion = turno.id;
                });

                listaTurnos.appendChild(turnoElement);
            });
        } catch (error) {
            console.error("Error al actualizar la lista de turnos:", error);
        }
    }

    async function cargarVeterinarios() {
        try {
            const response = await fetch("http://127.0.0.1:5000/veterinarios");
            const veterinarios = await response.json();
            veterinarioSelect.innerHTML = '<option value="">Seleccione un veterinario</option>';
            veterinarios.forEach(vet => {
                const option = document.createElement("option");
                option.value = vet.id;
                option.textContent = `${vet.nombre} `;
                veterinarioSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Error cargando veterinarios:", error);
        }
    }

    crearButton.addEventListener("click", () => crearTurno(false));
    emergencyButton.addEventListener("click", () => { servicioInput.value = "E"; crearTurno(true); });
    cargarVeterinarios();
    actualizarListaTurnos();
});
