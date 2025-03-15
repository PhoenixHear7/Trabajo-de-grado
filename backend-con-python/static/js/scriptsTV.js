document.addEventListener("DOMContentLoaded", function () {
    const listaTurnosEnProceso = document.getElementById("listaTurnosEnProceso");
    const audioTv = new Audio('static/audio/tv.mp3'); // Notificación sonora para nuevo turno
    let turnosEnProcesoPrevios = [];

    async function cargarTurnos() {
        try {
            const response = await fetch("http://192.168.10.30:5000/turnos");
            if (!response.ok) throw new Error("Error al obtener los turnos");

            const turnos = await response.json();
            console.log("Turnos obtenidos:", turnos); // 👀 Verifica los turnos en la consola

            listaTurnosEnProceso.innerHTML = "";

            let turnosProceso = turnos.filter(turno => turno.estado === "proceso");

            if (turnosProceso.length === 0) {
                listaTurnosEnProceso.innerHTML = "<li>No hay turnos en proceso</li>";
            } else {
                turnosProceso.forEach(turno => {
                    const turnoElement = document.createElement("li");
                    turnoElement.innerHTML = `
                        <div class="turno-codigo">${turno.codigo}</div>
                        <div class="turno-detalles">
                            <strong></strong> ${turno.nombre_mascota} <br>
                            <strong></strong> ${turno.servicio} <br>
                            <strong>Dr. </strong> ${turno.nombre_veterinario || 'N/A'} <br>
                        </div>
                        <div class="turno-consultorio"><strong></strong> Consultorio ${turno.modulo}</div>
                    `;
                    listaTurnosEnProceso.appendChild(turnoElement);
                });

                // Comparar turnos en proceso actuales con los previos
                const nuevosTurnosEnProceso = turnosProceso.filter(turno => 
                    !turnosEnProcesoPrevios.some(prevTurno => prevTurno.id === turno.id)
                );

                if (nuevosTurnosEnProceso.length > 0) {
                    audioTv.play(); // Reproducir sonido de notificación
                }

                // Actualizar el estado de turnos en proceso previos
                turnosEnProcesoPrevios = turnosProceso;
            }
        } catch (error) {
            console.error("Error al cargar los turnos:", error);
        }
    }

    setInterval(cargarTurnos, 5000);
    cargarTurnos();
});
