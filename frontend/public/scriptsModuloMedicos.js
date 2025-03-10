document.addEventListener("DOMContentLoaded", function () {
    const listaTurnosEnEspera = document.getElementById("listaTurnosEnEspera");
    const listaTurnosEnProceso = document.getElementById("listaTurnosEnProceso");
    const muestra = document.getElementById("muestra");

    const consultorioId = 1; // Cambia este valor según el consultorio correspondiente

    async function cargarTurnos() {
        try {
            const response = await fetch("http://127.0.0.1:5000/turnos");
            const turnos = await response.json();

            listaTurnosEnEspera.innerHTML = "";
            listaTurnosEnProceso.innerHTML = "";

            turnos.forEach(turno => {
                const turnoElement = document.createElement("li");
                turnoElement.classList.add("turno-item");
                turnoElement.innerHTML = `
                    <strong>Mascota:</strong> ${turno.nombre_mascota} <br>
                    <strong>Servicio:</strong> ${turno.servicio} <br>
                    <strong>Veterinario:</strong> ${turno.nombre_veterinario || 'N/A'} <br>
                    <strong>Estado:</strong> <span class="turno-estado">${turno.estado}</span> <br>
                    <div class="button-container">
                        ${turno.estado === 'espera' ? `
                            <select class="consultorio-select">
                                ${Array.from({ length: 8 }, (_, i) => `<option value="${i + 1}">Consultorio ${i + 1}</option>`).join('')}
                            </select>
                            <button class="aceptar-button">Aceptar</button>
                        ` : `
                            <button class="retornar-button">Retornar</button>
                            <button class="finalizar-button">Finalizar</button>
                        `}
                    </div>
                `;

                if (turno.estado === 'espera') {
                    listaTurnosEnEspera.appendChild(turnoElement);

                    turnoElement.querySelector(".aceptar-button").addEventListener("click", async function () {
                        const consultorioSelect = turnoElement.querySelector(".consultorio-select");
                        const modulo = consultorioSelect.value;

                        try {
                            const response = await fetch(`http://127.0.0.1:5000/turnos/${turno.id}`, {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({ estado: 'proceso', modulo })
                            });

                            if (response.ok) {
                                cargarTurnos();
                            } else {
                                const error = await response.json();
                                alert("Error al aceptar el turno: " + error.error);
                            }
                        } catch (error) {
                            console.error("Error al aceptar el turno:", error);
                        }
                    });
                } else if (turno.estado === 'proceso' && turno.modulo == consultorioId) {
                    listaTurnosEnProceso.appendChild(turnoElement);

                    turnoElement.querySelector(".retornar-button").addEventListener("click", async function () {
                        try {
                            const response = await fetch(`http://127.0.0.1:5000/turnos/${turno.id}`, {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({ estado: 'espera', modulo: null })
                            });

                            if (response.ok) {
                                cargarTurnos();
                            } else {
                                const error = await response.json();
                                alert("Error al retornar el turno: " + error.error);
                            }
                        } catch (error) {
                            console.error("Error al retornar el turno:", error);
                        }
                    });

                    turnoElement.querySelector(".finalizar-button").addEventListener("click", async function () {
                        try {
                            const response = await fetch(`http://127.0.0.1:5000/turnos/${turno.id}`, {
                            });

                            if (response.ok) {
                                cargarTurnos();
                            } else {
                                const error = await response.json();
                                alert("Error al finalizar el turno: " + error.error);
                            }
                        } catch (error) {
                            console.error("Error al finalizar el turno:", error);
                        }
                    });
                }
            });

            muestra.style.display = listaTurnosEnProceso.children.length === 0 ? 'block' : 'none';
        } catch (error) {
            console.error("Error al cargar los turnos:", error);
        }
    }

    // Cargar la lista de turnos al cargar la página
    cargarTurnos();
});