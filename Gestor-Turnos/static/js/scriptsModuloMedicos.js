import { enlace } from "./config.js"; // Importar la variable Enlace desde el archivo config.js

// --- Toast notification utility ---
function showToast(message, type = "success") {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-20px)";
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}
// --- Fin Toast notification utility ---

document.addEventListener("DOMContentLoaded", function () {
  const listaTurnosEnEspera = document.getElementById("listaTurnosEnEspera");
  const listaTurnosEnProceso = document.getElementById("listaTurnosEnProceso");
  const muestra = document.getElementById("muestra");
  const consultorioDialog = document.getElementById("consultorioDialog");
  const consultorioSelect = document.getElementById("consultorioSelect");
  const consultorioConfirmButton = document.getElementById(
    "consultorioConfirmButton"
  );
  const veterinarioDialog = document.getElementById("veterinarioDialog");
  const veterinarioSelect = document.getElementById("veterinarioSelect");
  const veterinarioConfirmButton = document.getElementById(
    "veterinarioConfirmButton"
  );
  const alertContainer = document.getElementById("alertContainer");
  const consultorioTitulo = document.getElementById("consultorioTitulo");

  let consultorioId = null;
  let turnoSeleccionado = null;
  const audioTv = new Audio("static/audio/mv.mp3"); // Notificación sonora para nuevo turno
  let turnosPrevios = [];

  // Mostrar cuadro de diálogo para seleccionar el consultorio
  function seleccionarConsultorio() {
    consultorioDialog.style.display = "flex";
  }

  consultorioConfirmButton.addEventListener("click", function () {
    const consultorioNum = parseInt(consultorioSelect.value);

    if (isNaN(consultorioNum) || consultorioNum < 101 || consultorioNum > 302) {
      showToast(
        "Consultorio inválido. Por favor, seleccione un número válido.",
        "error"
      );
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
      const response = await fetch(`${enlace}/turnos`);
      const turnos = await response.json();

      listaTurnosEnEspera.innerHTML = "";
      listaTurnosEnProceso.innerHTML = "";

      // Ordenar turnos: Emergencia primero, luego por id ascendente
      turnos.sort((a, b) => {
        if (a.servicio === "emergencia" && b.servicio !== "emergencia")
          return -1;
        if (a.servicio !== "emergencia" && b.servicio === "emergencia")
          return 1;
        return a.id - b.id;
      });

      turnos.forEach((turno) => {
        const turnoElement = document.createElement("li");
        turnoElement.classList.add("turno-item");
        if (turno.servicio === "emergencia") {
          turnoElement.classList.add("turno-emergencia");
        }
        turnoElement.innerHTML = `
        <div class="turno-codigo">${turno.codigo}</div>
        <div class="turno-info">
            <div><strong></strong> ${turno.nombre_mascota}</div>
            <div><strong></strong> ${turno.servicio}</div>
            <div><strong>Cód. </strong> ${turno.codigo_mascota}</div>
            <div><strong>Dr. </strong> <span class="turno-veterinario">${
              turno.nombre_veterinario || "No asignado"
            }</span></div>
        </div>
        <div class="button-container">
            ${
              turno.estado === "espera"
                ? `<button class="aceptar-button">Aceptar</button>`
                : `<button class="retornar-button">Retornar</button>
                   <button class="finalizar-button">Finalizar</button>`
            }
        </div>
      `;

        if (turno.estado === "espera") {
          listaTurnosEnEspera.appendChild(turnoElement);

          turnoElement
            .querySelector(".aceptar-button")
            .addEventListener("click", async function () {
              if (turno.nombre_veterinario) {
                aceptarTurno(turno);
              } else {
                turnoSeleccionado = turno;
                mostrarDialogoVeterinario();
              }
            });
        } else if (
          turno.estado === "proceso" &&
          turno.modulo == consultorioId
        ) {
          listaTurnosEnProceso.appendChild(turnoElement);

          turnoElement
            .querySelector(".retornar-button")
            .addEventListener("click", async function () {
              try {
                const response = await fetch(`${enlace}/turnos/${turno.id}`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ estado: "espera", modulo: null }),
                });

                if (response.ok) {
                  cargarTurnos();
                  audioTv.play(); // Reproducir sonido de notificación para turno retornado
                  showToast("Turno retornado a espera.", "success");
                } else {
                  const error = await response.json();
                  showToast(
                    "Error al retornar el turno: " + error.error,
                    "error"
                  );
                }
              } catch (error) {
                console.error("Error al retornar el turno:", error);
                showToast("Error al retornar el turno.", "error");
              }
            });

          turnoElement
            .querySelector(".finalizar-button")
            .addEventListener("click", async function () {
              try {
                const response = await fetch(`${enlace}/turnos/${turno.id}`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ estado: "finalizado", modulo: null }),
                });

                if (response.ok) {
                  cargarTurnos();
                  showToast("Turno finalizado.", "success");
                } else {
                  const error = await response.json();
                  showToast(
                    "Error al finalizar el turno: " + error.error,
                    "error"
                  );
                }
              } catch (error) {
                console.error("Error al finalizar el turno:", error);
                showToast("Error al finalizar el turno.", "error");
              }
            });
        }
      });

      // Comparar turnos actuales con los previos para detectar nuevos turnos
      const nuevosTurnos = turnos.filter(
        (turno) => !turnosPrevios.some((prevTurno) => prevTurno.id === turno.id)
      );

      if (nuevosTurnos.length > 0) {
        audioTv.play(); // Reproducir sonido de notificación para nuevos turnos
      }

      // Actualizar el estado de turnos previos
      turnosPrevios = turnos;

      muestra.style.display =
        listaTurnosEnProceso.children.length === 0 ? "block" : "none";
    } catch (error) {
      console.error("Error al cargar los turnos:", error);
      showToast("Error al cargar los turnos.", "error");
    }
  }

  async function mostrarDialogoVeterinario() {
    try {
      const response = await fetch(`${enlace}/veterinarios`);
      const veterinarios = await response.json();

      veterinarioSelect.innerHTML =
        '<option value="" disabled selected>Seleccione un veterinario</option>';
      veterinarios.forEach((veterinario) => {
        const option = document.createElement("option");
        option.value = veterinario.id;
        option.textContent = veterinario.nombre;
        veterinarioSelect.appendChild(option);
      });

      veterinarioDialog.style.display = "flex";
    } catch (error) {
      console.error("Error al cargar los veterinarios:", error);
      showToast("Error al cargar los veterinarios.", "error");
    }
  }

  veterinarioConfirmButton.addEventListener("click", async function () {
    const veterinarioId = parseInt(veterinarioSelect.value);

    if (isNaN(veterinarioId)) {
      showToast(
        "Veterinario inválido. Por favor, seleccione un veterinario.",
        "error"
      );
    } else {
      turnoSeleccionado.veterinario_id = veterinarioId;
      veterinarioDialog.style.display = "none";
      aceptarTurno(turnoSeleccionado);
    }
  });

  // Devuelve un array de consultorios disponibles (sin turno en proceso)
  function consultoriosDisponibles(turnos) {
    // Lista de todos los consultorios posibles (ajusta según tus consultorios)
    const todos = [];
    for (let i = 101; i <= 302; i++) {
      todos.push(i);
    }
    // Consultorios ocupados
    const ocupados = turnos
      .filter((t) => t.estado === "proceso" && t.modulo !== null)
      .map((t) => t.modulo);
    // Devuelve los que no están ocupados
    return todos.filter((num) => !ocupados.includes(num));
  }

  // Reemplaza tu función aceptarTurno por esta:
  async function aceptarTurno(turno) {
    try {
      // Obtener todos los turnos para verificar restricciones
      const responseTurnos = await fetch(`${enlace}/turnos`);
      const turnos = await responseTurnos.json();

      // Verifica si el consultorio ya tiene un turno en proceso (comparando como string y número)
      const consultorioOcupado = turnos.some(
        (t) =>
          t.estado === "proceso" &&
          (t.modulo == consultorioId || t.modulo === String(consultorioId))
      );
      if (consultorioOcupado) {
        showToast(
          "Este consultorio ya tiene un turno en proceso. No se pueden atender dos mascotas en el mismo consultorio.",
          "error"
        );
        return;
      }

      // Verificar si el veterinario ya tiene un turno en proceso
      const veterinarioOcupado = turnos.some(
        (t) =>
          t.estado === "proceso" && t.veterinario_id === turno.veterinario_id
      );
      if (veterinarioOcupado) {
        showToast(
          "Este veterinario ya tiene un turno en proceso. Solo puede atender un turno a la vez.",
          "error"
        );
        return;
      }

      // Si pasa las validaciones, aceptar el turno
      const response = await fetch(`${enlace}/turnos/${turno.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          estado: "proceso",
          modulo: consultorioId,
          veterinario_id: turno.veterinario_id,
        }),
      });

      if (response.ok) {
        cargarTurnos();
        showToast("Turno aceptado correctamente.", "success");
      } else {
        const error = await response.json();
        showToast("Error al aceptar el turno: " + error.error, "error");
      }
    } catch (error) {
      console.error("Error al aceptar el turno:", error);
      showToast("Error al aceptar el turno.", "error");
    }
  }

  // Mostrar el cuadro de diálogo para seleccionar el consultorio al cargar la página
  seleccionarConsultorio();

  // Botón para cambiar consultorio
  const cambiarConsultorioBtn = document.getElementById(
    "cambiarConsultorioBtn"
  );
  if (cambiarConsultorioBtn) {
    cambiarConsultorioBtn.addEventListener("click", seleccionarConsultorio);
  }
});
