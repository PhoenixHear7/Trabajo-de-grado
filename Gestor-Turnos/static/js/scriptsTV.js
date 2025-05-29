import { enlace } from "./config.js"; // Importa la URL base desde config.js
document.addEventListener("DOMContentLoaded", function () {
  const listaTurnosEnProceso = document.getElementById("listaTurnosEnProceso");
  const videoPublicidad = document.getElementById("videoPublicidad");
  const audioTv = new Audio("static/audio/tv.mp3"); // Notificación sonora para nuevo turno
  let turnosEnProcesoPrevios = [];

  async function cargarTurnos() {
    try {
      const response = await fetch(`${enlace}/turnos`);
      if (!response.ok) throw new Error("Error al obtener los turnos");

      const turnos = await response.json();
      console.log("Turnos obtenidos:", turnos);

      listaTurnosEnProceso.innerHTML = "";

      // Filtrar solo los turnos en proceso
      let turnosProceso = turnos.filter((turno) => turno.estado === "proceso");

      // Ordenar por fecha descendente (más recientes primero)
      turnosProceso.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

      if (turnosProceso.length === 0) {
        listaTurnosEnProceso.innerHTML = "<li>No hay turnos en proceso</li>";
      } else {
        turnosProceso.forEach((turno) => {
          const turnoElement = document.createElement("li");
          turnoElement.innerHTML = `
                        <div class="turno-codigo">${turno.codigo}</div>
                        <div class="turno-detalles">
                            <strong></strong> ${turno.nombre_mascota} <br>
                            <strong>Dr. </strong> ${
                              turno.nombre_veterinario || "N/A"
                            } <br>
                        </div>
                        <div class="turno-consultorio"><strong></strong> Consultorio ${
                          turno.modulo
                        }</div>
                    `;
          listaTurnosEnProceso.appendChild(turnoElement);
        });

        const nuevosTurnosEnProceso = turnosProceso.filter(
          (turno) =>
            !turnosEnProcesoPrevios.some(
              (prevTurno) => prevTurno.id === turno.id
            )
        );

        if (nuevosTurnosEnProceso.length > 0) {
          audioTv.play();
        }

        turnosEnProcesoPrevios = turnosProceso;
      }
    } catch (error) {
      console.error("Error al cargar los turnos:", error);
    }
  }

  setInterval(cargarTurnos, 5000);
  cargarTurnos();

  // Lista de videos en la carpeta static/video/
  const videos = [
    "/static/video/video_1.mp4",
    "/static/video/video_2.mp4",
    "/static/video/video_3.mp4",
    "/static/video/video_4.mp4",
    "/static/video/video_5.mp4",
    "/static/video/video_6.mp4",
    "/static/video/video_7.mp4",
    "/static/video/video_8.mp4",
    "/static/video/video_9.mp4",
    "/static/video/video_10.mp4",
  ];

  let currentIndex = 0;
  const videoPlayer = document.getElementById("videoPlayer");
  const videoSource = document.getElementById("videoSource");

  function playNextVideo() {
    currentIndex = (currentIndex + 1) % videos.length; // Cambia al siguiente video en bucle
    videoSource.src = videos[currentIndex];
    videoPlayer.load(); // Carga el nuevo video
    videoPlayer.play(); // Reproduce el nuevo video
  }

  // Configurar el primer video
  videoSource.src = videos[currentIndex];
  videoPlayer.load();
  videoPlayer.play();

  // Evento para cambiar de video cuando termine el actual
  videoPlayer.addEventListener("ended", playNextVideo);
});
