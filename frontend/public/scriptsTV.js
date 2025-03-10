document.addEventListener("DOMContentLoaded", function () {
    const listaTurnosEnProceso = document.getElementById("listaTurnosEnProceso");

    async function cargarTurnos() {
        try {
            const response = await fetch("http://127.0.0.1:5000/turnos");
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
                        <strong>Mascota:</strong> ${turno.nombre_mascota} <br>
                        <strong>Servicio:</strong> ${turno.servicio} <br>
                        <strong>Veterinario:</strong> ${turno.nombre_veterinario || 'N/A'}
                    `;
                    listaTurnosEnProceso.appendChild(turnoElement);
                });
            }
        } catch (error) {
            console.error("Error al cargar los turnos:", error);
        }
    }

    setInterval(cargarTurnos, 5000);
    cargarTurnos();
});
