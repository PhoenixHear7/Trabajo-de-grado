document.addEventListener("DOMContentLoaded", function () {
    const listaTurnosEnEspera = document.getElementById("listaTurnosEnEspera");
    const listaTurnosEnProceso = document.getElementById("listaTurnosEnProceso");
    const muestra = document.getElementById("muestra");
    const consultorioDialog = document.getElementById("consultorioDialog");
    const consultorioSelect = document.getElementById("consultorioSelect");
    const consultorioConfirmButton = document.getElementById("consultorioConfirmButton");

    let consultorioId = null;
    const audioTv = new Audio('static/audio/mv.mp3'); // Notificación sonora para cambio de estado a 'proceso'

    // Mostrar cuadro de diálogo para seleccionar el consultorio
    function seleccionarConsultorio() {
        consultorioDialog.style.display = "flex";
    }

    consultorioConfirmButton.addEventListener("click", function () {
        const consultorioNum = parseInt(consultorioSelect.value);

        if (isNaN(consultorioNum) || consultorioNum < 1 || consultorioNum > 8) {
            alert("Consultorio inválido. Por favor, seleccione un número entre 1 y 8.");
        } else {
            consultorioId = consultorioNum;
            consultorioDialog.style.display = "none";
            cargarTurnos();
        }
    });

    async function cargarTurnos() {
        try {
            const response = await fetch("http://192.168.10.22:5000/turnos");
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
                        try {
                            const response = await fetch(`http://192.168.10.22:5000/turnos/${turno.id}`, {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({ estado: 'proceso', modulo: consultorioId })
                            });

                            if (response.ok) {
                                audioTv.play(); // Reproducir sonido de notificación
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
                            const response = await fetch(`http://192.168.10.22:5000/turnos/${turno.id}`, {
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
                            const response = await fetch(`http://192.168.10.22:5000/turnos/${turno.id}`, {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({ estado: 'finalizado', modulo: null })
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

    // Mostrar el cuadro de diálogo para seleccionar el consultorio al cargar la página
    seleccionarConsultorio();
});