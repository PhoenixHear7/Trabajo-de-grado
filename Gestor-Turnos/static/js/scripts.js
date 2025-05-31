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
  const mascotaInput = document.getElementById("mascota");
  const codigoMascotaInput = document.getElementById("codigo_mascota");
  const servicioInput = document.getElementById("servicio");
  const veterinarioSelect = document.getElementById("veterinario");
  const crearButton = document.getElementById("crearTurno");
  const listaTurnos = document.getElementById("listaTurnos");
  const settingsButton = document.getElementById("settings-button");
  const modal = document.getElementById("myModal");
  const modalIframe = document.getElementById("modal-iframe");
  const closeModal = document.querySelector(".close");

  if (
    !mascotaInput ||
    !codigoMascotaInput ||
    !servicioInput ||
    !crearButton ||
    !listaTurnos ||
    !settingsButton ||
    !modal ||
    !modalIframe ||
    !closeModal
  ) {
    console.error(
      "Error: No se encontraron todos los elementos necesarios en el DOM."
    );
    return;
  }

  settingsButton.addEventListener("click", () => {
    modalIframe.src = "/ajusteMedicos";
    modal.style.display = "flex";
  });

  closeModal.addEventListener("click", () => (modal.style.display = "none"));
  window.addEventListener("click", (event) => {
    if (event.target == modal) modal.style.display = "none";
  });

  async function crearTurno() {
    const codigo_mascota = codigoMascotaInput.value.trim();
    const nombre_mascota = mascotaInput.value.trim();
    const servicio = servicioInput.value;
    const id_veterinario = veterinarioSelect.value
      ? parseInt(veterinarioSelect.value)
      : null;

    // Validar que el código de mascota no sea negativo
    if (codigo_mascota && Number(codigo_mascota) < 0) {
      showToast("El código de mascota no puede ser negativo.", "error");
      return;
    }

    if (!codigo_mascota || !nombre_mascota || !servicio) {
      showToast(
        "Por favor, completa todos los campos antes de crear el turno.",
        "error"
      );
      return;
    }

    const turnoData = {
      codigo_mascota,
      nombre_mascota,
      servicio,
      id_veterinario: id_veterinario ? parseInt(id_veterinario) : null,
    };

    try {
      const response = await fetch(`${enlace}/turnos/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(turnoData),
      });

      if (response.ok) {
        const result = await response.json();
        showToast("Turno registrado exitosamente", "success");

        limpiarInputs();
        actualizarListaTurnos();
      } else {
        const error = await response.json();
        showToast("Error al registrar el turno: " + error.error, "error");
      }
    } catch (error) {
      console.error("Error al registrar el turno:", error);
      showToast("Error al registrar el turno.", "error");
    }
  }

  function limpiarInputs() {
    codigoMascotaInput.value = "";
    mascotaInput.value = "";
    servicioInput.value = "";
    veterinarioSelect.value = "";
  }

  async function actualizarListaTurnos() {
    try {
      const response = await fetch(`${enlace}/turnos/`);
      const turnos = await response.json();
      listaTurnos.innerHTML = "";

      // Ordenar turnos: Emergencia primero, luego por fecha
      turnos.sort((a, b) => {
        if (a.servicio === "emergencia" && b.servicio !== "emergencia")
          return -1;
        if (a.servicio !== "emergencia" && b.servicio === "emergencia")
          return 1;
        return new Date(a.fecha) - new Date(b.fecha);
      });

      // Mostrar el turno más reciente primero
      turnos.reverse();

      turnos.forEach((turno) => {
        const turnoElement = document.createElement("div");
        turnoElement.classList.add("turno-item");
        turnoElement.innerHTML = `
                    <span class="codigo">${turno.codigo}</span>
                    <div class="detalles">
                        <strong>${turno.nombre_mascota}</strong>
                        <span>${turno.servicio},</span>
                        <span>cod. ${turno.codigo_mascota}, </span>
                        ${
                          turno.nombre_veterinario
                            ? `<span>   ${turno.nombre_veterinario}</span>`
                            : "<span>Sin veterinario asignado</span>"
                        }
                        ${
                          turno.estado === "proceso"
                            ? `<span>Consultorio: ${turno.modulo}</span>`
                            : ""
                        }
                    </div>
                    <button class="delete-button">Eliminar</button>
                `;

        turnoElement
          .querySelector(".delete-button")
          .addEventListener("click", async () => {
            try {
              const response = await fetch(`${enlace}/turnos/${turno.id}`, {
                method: "DELETE",
              });
              if (response.ok) {
                turnoElement.remove();
                showToast("Turno eliminado exitosamente", "success");
              } else {
                const error = await response.json();
                showToast(
                  "Error al eliminar el turno: " + error.error,
                  "error"
                );
              }
            } catch (error) {
              console.error("Error al eliminar el turno:", error);
              showToast("Error al eliminar el turno.", "error");
            }
          });

        listaTurnos.appendChild(turnoElement);
      });
    } catch (error) {
      console.error("Error al actualizar la lista de turnos:", error);
      showToast("Error al actualizar la lista de turnos.", "error");
    }
  }

  async function cargarVeterinarios() {
    try {
      const response = await fetch(`${enlace}/veterinarios`);
      const veterinarios = await response.json();
      veterinarioSelect.innerHTML =
        '<option value="">Seleccione un veterinario</option>';
      veterinarios.forEach((vet) => {
        const option = document.createElement("option");
        option.value = vet.id;
        option.textContent = ` Dr. ${vet.nombre} `;
        veterinarioSelect.appendChild(option);
      });
    } catch (error) {
      console.error("Error cargando veterinarios:", error);
      showToast("Error cargando veterinarios.", "error");
    }
  }

  crearButton.addEventListener("click", crearTurno);
  cargarVeterinarios();
  actualizarListaTurnos();
});
