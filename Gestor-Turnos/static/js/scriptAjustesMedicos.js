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
  const nombreVeterinarioInput = document.getElementById("nombreVeterinario");
  const apellidoVeterinarioInput = document.getElementById(
    "apellidoVeterinario"
  );
  const rolInput = document.getElementById("rol");
  const crearVeterinarioButton = document.getElementById("crearVeterinario");
  const listaVeterinarios = document.getElementById("listaVeterinarios");

  async function registrarVeterinario() {
    const nombre = nombreVeterinarioInput.value.trim();
    const apellido = apellidoVeterinarioInput.value.trim();
    const rol = rolInput.value.trim();

    if (!nombre || !apellido || !rol) {
      showToast(
        "Por favor, completa todos los campos antes de crear el veterinario.",
        "error"
      );
      return;
    }

    const veterinarioData = {
      nombre,
      apellido,
      rol,
    };

    try {
      const response = await fetch(`${enlace}/veterinarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(veterinarioData),
      });

      if (response.ok) {
        const result = await response.json();
        showToast("Veterinario registrado exitosamente", "success");
        cargarVeterinarios();
      } else {
        const error = await response.json();
        showToast("Error al registrar el veterinario: " + error.error, "error");
      }
    } catch (error) {
      console.error("Error al registrar el veterinario:", error);
      showToast("Error al registrar el veterinario.", "error");
    }
  }

  async function cargarVeterinarios() {
    try {
      const response = await fetch(`${enlace}/veterinarios`);
      if (!response.ok) {
        throw new Error("Error al cargar los veterinarios");
      }
      const veterinarios = await response.json();
      listaVeterinarios.innerHTML = "";

      // Mostrar los veterinarios más recientes primero
      veterinarios.reverse();

      veterinarios.forEach((vet) => {
        const vetElement = document.createElement("li");
        vetElement.innerHTML = `
                    ${vet.nombre} - ${vet.rol}
                    <button class="delete-button" data-id="${vet.id}">Eliminar</button>
                `;
        listaVeterinarios.appendChild(vetElement);

        vetElement
          .querySelector(".delete-button")
          .addEventListener("click", async () => {
            try {
              const response = await fetch(`${enlace}/veterinarios/${vet.id}`, {
                method: "DELETE",
              });
              if (response.ok) {
                showToast("Veterinario eliminado exitosamente", "success");
                cargarVeterinarios();
              } else {
                const error = await response.json();
                showToast(
                  "Error al eliminar el veterinario: " + error.error,
                  "error"
                );
              }
            } catch (error) {
              console.error("Error al eliminar el veterinario:", error);
              showToast("Error al eliminar el veterinario.", "error");
            }
          });
      });
    } catch (error) {
      console.error("Error al cargar los veterinarios:", error);
      showToast("Error al cargar los veterinarios.", "error");
    }
  }

  crearVeterinarioButton.addEventListener("click", registrarVeterinario);
  cargarVeterinarios();
});
