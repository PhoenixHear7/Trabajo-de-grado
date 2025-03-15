document.addEventListener("DOMContentLoaded", function () {
    const listaTurnosEnEspera = document.getElementById("listaTurnosEnEspera");
    const listaTurnosEnProceso = document.getElementById("listaTurnosEnProceso");
    const muestra = document.getElementById("muestra");
    const consultorioDialog = document.getElementById("consultorioDialog");
    const consultorioSelect = document.getElementById("consultorioSelect");
    const consultorioConfirmButton = document.getElementById("consultorioConfirmButton");
    const veterinarioDialog = document.getElementById("veterinarioDialog");
    const veterinarioSelect = document.getElementById("veterinarioSelect");
    const veterinarioConfirmButton = document.getElementById("veterinarioConfirmButton");
    const alertContainer = document.getElementById("alertContainer");
    const consultorioTitulo = document.getElementById("consultorioTitulo");

    let consultorioId = null;
    let turnoSeleccionado = null;
    const audioTv = new Audio('static/audio/mv.mp3'); // Notificación sonora para nuevo turno
    let turnosPrevios = [];

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
            consultorioTitulo.textContent = `Consultorio ${consultorioId}`;
            consultorioDialog.style.display = "none";
            cargarTurnos();
            setInterval(cargarTurnos, 5000); // Revisar cada 5 segundos si hay nuevos turnos
        }
    });

    async function cargarTurnos() {
        try {
            const response = await fetch("http://192.168.10.30:5000/turnos");
            const turnos = await response.json();

            listaTurnosEnEspera.innerHTML = "";
            listaTurnosEnProceso.innerHTML = "";

            // Ordenar turnos: Emergencia primero, luego por fecha (más antiguos primero)
            turnos.sort((a, b) => {
                if (a.servicio === 'emergencia' && b.servicio !== 'emergencia') return -1;
                if (a.servicio !== 'emergencia' && b.servicio === 'emergencia') return 1;
                return new Date(a.fecha) - new Date(b.fecha);
            });

            turnos.forEach(turno => {
                const turnoElement = document.createElement("li");
                turnoElement.classList.add("turno-item");
                turnoElement.innerHTML = `
                    <div class="turno-codigo">${turno.codigo}</div>
                    <div class="turno-info">
                        <div><strong></strong> ${turno.nombre_mascota}</div>
                        <div><strong></strong> ${turno.servicio}</div>
                        <div><strong>Cód. </strong> ${turno.codigo_mascota}</div>
                        <div><strong>Dr. </strong> <span class="turno-veterinario">${turno.nombre_veterinario || 'No asignado'}</span></div>
                    </div>
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
                        if (turno.nombre_veterinario) {
                            aceptarTurno(turno);
                        } else {
                            turnoSeleccionado = turno;
                            mostrarDialogoVeterinario();
                        }
                    });
                } else if (turno.estado === 'proceso' && turno.modulo == consultorioId) {
                    listaTurnosEnProceso.appendChild(turnoElement);

                    turnoElement.querySelector(".retornar-button").addEventListener("click", async function () {
                        try {
                            const response = await fetch(`http://192.168.10.30:5000/turnos/${turno.id}`, {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({ estado: 'espera', modulo: null })
                            });

                            if (response.ok) {
                                cargarTurnos();
                                audioTv.play(); // Reproducir sonido de notificación para turno retornado
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
                            const response = await fetch(`http://192.168.10.30:5000/turnos/${turno.id}`, {
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

            // Comparar turnos actuales con los previos para detectar nuevos turnos
            const nuevosTurnos = turnos.filter(turno => 
                !turnosPrevios.some(prevTurno => prevTurno.id === turno.id)
            );

            if (nuevosTurnos.length > 0) {
                audioTv.play(); // Reproducir sonido de notificación para nuevos turnos
            }

            // Actualizar el estado de turnos previos
            turnosPrevios = turnos;

            muestra.style.display = listaTurnosEnProceso.children.length === 0 ? 'block' : 'none';
        } catch (error) {
            console.error("Error al cargar los turnos:", error);
        }
    }

    async function mostrarDialogoVeterinario() {
        try {
            const response = await fetch("http://192.168.10.30:5000/veterinarios");
            const veterinarios = await response.json();

            veterinarioSelect.innerHTML = '<option value="" disabled selected>Seleccione un veterinario</option>';
            veterinarios.forEach(veterinario => {
                const option = document.createElement("option");
                option.value = veterinario.id;
                option.textContent = veterinario.nombre;
                veterinarioSelect.appendChild(option);
            });

            veterinarioDialog.style.display = "flex";
        } catch (error) {
            console.error("Error al cargar los veterinarios:", error);
        }
    }

    veterinarioConfirmButton.addEventListener("click", async function () {
        const veterinarioId = parseInt(veterinarioSelect.value);

        if (isNaN(veterinarioId)) {
            alert("Veterinario inválido. Por favor, seleccione un veterinario.");
        } else {
            turnoSeleccionado.veterinario_id = veterinarioId;
            veterinarioDialog.style.display = "none";
            aceptarTurno(turnoSeleccionado);
        }
    });

    async function aceptarTurno(turno) {
        try {
            const response = await fetch(`http://192.168.10.30:5000/turnos/${turno.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ estado: 'proceso', modulo: consultorioId, veterinario_id: turno.veterinario_id })
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
    }

    function mostrarAlerta(mensaje) {
        const alertElement = document.createElement("div");
        alertElement.classList.add("alert");
        alertElement.textContent = mensaje;
        alertContainer.appendChild(alertElement);

        setTimeout(() => {
            alertElement.remove();
        }, 5000);
    }

    // Mostrar el cuadro de diálogo para seleccionar el consultorio al cargar la página
    seleccionarConsultorio();
});