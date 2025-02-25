document.addEventListener("DOMContentLoaded", function () {
  console.log("Iniciando Flatpickr...");

  // Inicializar Flatpickr
  flatpickr("#selectDateButton", {
    enableTime: false,
    dateFormat: "d/m/Y",
    minDate: "today",
    onChange: function (selectedDates) {
      if (selectedDates.length > 0) {
        const date = selectedDates[0];
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        document.getElementById("day-month-year").innerHTML = `${day}/${month}/${year}`;
      }
    },
  });

  console.log("Inicializando asignación de turnos...");

  // Selecciona elementos del DOM
  const scheduleButton = document.getElementById("scheduleButton");
  const selectDateButton = document.getElementById("selectDateButton");
  const selectTime = document.getElementById("selectTime");
  const selectDoctor = document.getElementById("selectDoctor");
  const appointmentsList = document.getElementById("appointmentsList");
  const emergencyButton = document.getElementById("emergencyButton");

  // Arreglo para almacenar los turnos
  let appointments = [];

  // Función para agregar un turno a la lista de "Próximos Turnos"
  function addAppointment(date, time, doctor, isEmergency = false) {
    // Convertir la fecha y hora a un objeto Date
    const appointmentDate = new Date(`${date} ${time}`);

    // Crear un objeto para el turno
    const appointment = {
      date: date,
      time: time,
      doctor: doctor,
      appointmentDate: appointmentDate,
      isEmergency: isEmergency, // Marca si es un turno de emergencia
    };

    // Agregar el turno al arreglo
    appointments.push(appointment);

    // Ordenar los turnos por fecha y hora
    appointments.sort((a, b) => {
      if (a.appointmentDate.getTime() === b.appointmentDate.getTime()) {
        return a.time.localeCompare(b.time); // Comparar por hora si las fechas son iguales
      }
      return a.appointmentDate - b.appointmentDate;
    });

    // Actualizar la lista de turnos
    updateAppointmentsList();
  }

  // Función para actualizar la lista de turnos en el DOM
  function updateAppointmentsList() {
    // Limpiar la lista antes de mostrarla
    appointmentsList.innerHTML = "";

    // Recorrer los turnos ordenados y agregarlos al DOM
    appointments.forEach((appointment) => {
      const appointmentElement = document.createElement("div");
      appointmentElement.classList.add("appointment");
      appointmentElement.innerHTML = `
        <span>${appointment.date} - ${appointment.time} con ${appointment.doctor}${
        appointment.isEmergency ? " (EMERGENCIA)" : ""
      }</span>
        <button class="cancel-button">Cancelar</button>
        <button class="modify-button">Modificar</button>
      `;

      // Agregar el turno a la lista
      appointmentsList.appendChild(appointmentElement);

      // Funcionalidad del botón "Cancelar"
      const cancelButton = appointmentElement.querySelector(".cancel-button");
      cancelButton.addEventListener("click", () =>
        cancelAppointment(appointmentElement, appointment)
      );

      // Funcionalidad del botón "Modificar"
      const modifyButton = appointmentElement.querySelector(".modify-button");
      modifyButton.addEventListener("click", () =>
        modifyAppointment(appointmentElement, appointment)
      );
    });
  }

  // Función para cancelar un turno
  function cancelAppointment(appointmentElement, appointment) {
    if (
      confirm(
        `¿Estás seguro de que deseas cancelar el turno para ${appointment.date} a las ${appointment.time} con ${appointment.doctor}?`
      )
    ) {
      // Eliminar el turno del arreglo
      appointments = appointments.filter((a) => a !== appointment);

      // Actualizar la lista de turnos
      updateAppointmentsList();
      alert(
        `El turno para ${appointment.date} a las ${appointment.time} con ${appointment.doctor} ha sido cancelado.`
      );
    }
  }

  // Función para modificar un turno
  function modifyAppointment(appointmentElement, appointment) {
    const newDate = prompt(
      "Introduce la nueva fecha (dd/mm/yyyy):",
      appointment.date
    );
    const newTime = prompt("Introduce la nueva hora:", appointment.time);
    const newDoctor = prompt(
      "Introduce el nuevo médico:",
      appointment.doctor
    );

    if (newDate && newTime && newDoctor) {
      appointment.date = newDate;
      appointment.time = newTime;
      appointment.doctor = newDoctor;
      appointment.appointmentDate = new Date(`${newDate} ${newTime}`); // Actualizar el objeto Date

      // Volver a ordenar los turnos
      appointments.sort((a, b) => a.appointmentDate - b.appointmentDate);

      // Actualizar la lista de turnos
      updateAppointmentsList();
      alert(
        `El turno ha sido modificado a ${newDate} a las ${newTime} con ${newDoctor}.`
      );
    } else {
      alert("Modificación cancelada o datos incompletos.");
    }
  }

  // Evento para agendar un turno
  scheduleButton.addEventListener("click", (event) => {
    event.preventDefault();
    const selectedDate = selectDateButton.value;
    const selectedTime = selectTime.value;
    const selectedDoctor = selectDoctor.value;

    if (!selectedDate || !selectedTime || !selectedDoctor) {
      alert(
        "Por favor selecciona una fecha, una hora y un doctor antes de agendar."
      );
      return;
    }

    // Agregar el turno a la lista
    addAppointment(selectedDate, selectedTime, selectedDoctor);

    // Limpiar los campos después de agendar
    selectDateButton.value = "";
    selectTime.value = "";
    selectDoctor.value = "";
  });

  // Evento para turnos de emergencia
  emergencyButton.addEventListener("click", (event) => {
    event.preventDefault();

    const emergencyDate = selectDateButton.value;
    const emergencyTime = selectTime.value;
    const emergencyDoctor = selectDoctor.value;

    if (!emergencyDate || !emergencyTime || !emergencyDoctor) {
      alert(
        "Por favor selecciona una fecha, una hora y un doctor antes de agendar el turno de emergencia."
      );
      return;
    }

    addAppointment(emergencyDate, emergencyTime, emergencyDoctor, true); // Agregar el turno como emergencia

    // Limpiar los campos después de agendar
    selectDateButton.value = "";
    selectTime.value = "";
    selectDoctor.value = "";
  });
});
