document.addEventListener("DOMContentLoaded", function () {
    const mascotaInput = document.getElementById("mascota");
    const servicioInput = document.getElementById("servicio");
    const profesionalInput = document.getElementById("profesional");
    const crearButton = document.getElementById("crearTurno");
    const emergencyButton = document.getElementById("emergencyButton");
    const appointmentsList = document.getElementById("appointmentsList");

    if (!mascotaInput || !servicioInput || !profesionalInput || !crearButton || !emergencyButton || !appointmentsList) {
        console.error("Error: No se encontraron todos los elementos necesarios en el DOM.");
        return;
    }

    let contador = {
        consulta: 1,
        cirugia: 1,
        emergencia: 1,
        control: 1,
        otro: 1
    };

    function crearTurno(esEmergencia = false) {
        const mascota = mascotaInput.value.trim();
        let servicio = servicioInput.value.trim().toLowerCase();
        const profesional = profesionalInput.value.trim();

        if (!mascota || !servicio || !profesional) {
            alert("Por favor, completa todos los campos antes de crear el turno.");
            return;
        }

        let codigoTurno = "";
        switch (servicio) {
            case "consulta":
                codigoTurno = "CTA-" + contador.consulta++;
                break;
            case "cirugia":
                codigoTurno = "CRG-" + contador.cirugia++;
                break;
            case "control":
                codigoTurno = "CRL-" + contador.control++;
                break;
            case "emergencia":
            case esEmergencia ? "emergencia" : "":
                codigoTurno = "EME-" + contador.emergencia++;
                servicio = "emergencia";
                break;
            default:
                codigoTurno = "OTRO-" + contador.otro++;
        }

        const turno = document.createElement("div");
        turno.classList.add("turno-item");
        turno.innerHTML = `
            <strong>Código:</strong> <span style="color: red;">${codigoTurno}</span><br>
            <strong>Mascota:</strong> ${mascota} <br>
            <strong>Servicio:</strong> ${servicio} <br>
            <strong>Profesional:</strong> ${profesional} <br>
            <strong>Estado:</strong> <span class="turno-estado">Pendiente</span> <br>
            <div class="button-container">
                <button class="edit-button">Editar</button>
                <button class="delete-button">Eliminar</button>
            </div>
        `;

        if (servicio === "emergencia") {
            appointmentsList.prepend(turno);
        } else {
            appointmentsList.appendChild(turno);
        }

        mascotaInput.value = "";
        servicioInput.value = "";
        profesionalInput.value = "";

        turno.querySelector(".delete-button").addEventListener("click", function () {
            turno.remove();
        });

        turno.querySelector(".edit-button").addEventListener("click", function () {
            editarEstado(turno);
        });
    }

    function editarEstado(turno) {
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
    }

    crearButton.addEventListener("click", function () {
        crearTurno(false);
    });

    emergencyButton.addEventListener("click", function () {
        servicioInput.value = "Emergencia";
        crearTurno(true);
    });
});