document.addEventListener("DOMContentLoaded", function () {
    const mascotaInput = document.getElementById("mascota");
    const servicioInput = document.getElementById("servicio");
    const veterinarioSelect = document.getElementById("veterinario");
    const crearButton = document.getElementById("crearTurno");
    const emergencyButton = document.getElementById("emergencyButton");
    const listaTurnos = document.getElementById("listaTurnos");

    if (!mascotaInput || !servicioInput || !veterinarioSelect || !crearButton || !emergencyButton || !listaTurnos) {
        console.error("Error: No se encontraron todos los elementos necesarios en el DOM.");
        return;
    }

    let contador = {
        C: 1,  // Consulta
        V: 1,  // Vacunación
        CL: 1, // Control
        E: 1,  // Ecografía
        H: 1   // Hospitalización
    };

    function crearTurno(esEmergencia = false) {
        const mascota = mascotaInput.value.trim();
        const servicioCodigo = servicioInput.value;
        const veterinario = veterinarioSelect.value;

        if (!mascota || !servicioCodigo || !veterinario) {
            alert("Por favor, completa todos los campos antes de crear el turno.");
            return;
        }

        let codigoTurno = `${servicioCodigo}-${String(contador[servicioCodigo]++).padStart(2, "0")}`;
        
        const turno = document.createElement("div");
        turno.classList.add("turno-item");
        turno.innerHTML = `
            <strong>Código:</strong> <span style="color: red;">${codigoTurno}</span><br>
            <strong>Mascota:</strong> ${mascota} <br>
            <strong>Servicio:</strong> ${servicioInput.options[servicioInput.selectedIndex].text} <br>
            <strong>Veterinario:</strong> ${veterinarioSelect.options[veterinarioSelect.selectedIndex].text} <br>
            <strong>Estado:</strong> <span class="turno-estado">Pendiente</span> <br>
            <div class="button-container">
                <button class="edit-button">Editar</button>
                <button class="delete-button">Eliminar</button>
            </div>
        `;

        listaTurnos.appendChild(turno);

        mascotaInput.value = "";
        servicioInput.selectedIndex = 0;
        veterinarioSelect.selectedIndex = 0;

        turno.querySelector(".delete-button").addEventListener("click", function () {
            turno.remove();
        });

        turno.querySelector(".edit-button").addEventListener("click", function () {
            editarEstado(turno);
        });
    }
    //  cambia a editar datos de turno <<<-----
   /* function editarTurno(turno) {
        const estadoSpan = turno.querySelector(".turno-estado");
        const estadoActual = estadoSpan.textContent;
        const select = document.createElement("select");

        ["Pendiente", "Aceptado", "En proceso", "Finalizado"].forEach(estado => {
            const option = document.createElement("option");
            option.value = estado;
            option.textContent = estado;
            if (estado === estadoActual) option.selected = true;
            select.appendChild(option);
        });

        select.addEventListener("change", function () {
            estadoSpan.textContent = select.value;
            select.replaceWith(estadoSpan);
        });

        estadoSpan.replaceWith(select);
    }*/

    crearButton.addEventListener("click", function () {
        crearTurno(false);
    });

    emergencyButton.addEventListener("click", function () {
        servicioInput.value = "E"; // Emergencia
        crearTurno(true);
    });
// trae los medicos de la base de datos 
    async function cargarVeterinarios() {
        try {
            const response = await fetch("http://127.0.0.1:5000/veterinarios");
            const veterinarios = await response.json();
    
            veterinarios.forEach(vet => {
                const option = document.createElement("option");
                option.value = vet.id;
                option.textContent = `${vet.nombre}`;
                veterinarioSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Error cargando veterinarios:", error);
        }
    }

    // Llamar a la función para cargar los veterinarios
    cargarVeterinarios();
});
