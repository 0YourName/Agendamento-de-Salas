const STORAGE_KEYS = {
  ROOMS: 'rooms',
  RESERVATIONS: 'reservations',
  CURRENT_USER: 'currentUser'
};

const defaultRooms = [
  { id: 'lab1', name: 'Laboratório 1' },
  { id: 'lab2', name: 'Laboratório 2' },
  { id: 'lab3', name: 'Laboratório 3' }
];

const elements = {
  roomSelect: document.getElementById('room-select'),
  dateInput: document.getElementById('date-input'),
  startInput: document.getElementById('start-input'),
  endInput: document.getElementById('end-input'),
  nameInput: document.getElementById('name-input'),
  roleSelect: document.getElementById('role-select'),
  reasonInput: document.getElementById('reason-input'),
  clearButton: document.getElementById('clear-button'),
  reservationForm: document.getElementById('reservation-form'),
  formMessage: document.getElementById('form-message'),
  viewRoomSelect: document.getElementById('view-room-select'),
  viewDateInput: document.getElementById('view-date-input'),
  availabilityStatus: document.getElementById('availability-status'),
  reservationList: document.getElementById('reservation-list')
};

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getRooms() {
  const rooms = readStorage(STORAGE_KEYS.ROOMS, null);
  if (!rooms || !Array.isArray(rooms) || rooms.length === 0) {
    writeStorage(STORAGE_KEYS.ROOMS, defaultRooms);
    return defaultRooms;
  }
  return rooms;
}

function getReservations() {
  return readStorage(STORAGE_KEYS.RESERVATIONS, []);
}

function getCurrentUser() {
  return readStorage(STORAGE_KEYS.CURRENT_USER, null);
}

function setCurrentUser(user) {
  writeStorage(STORAGE_KEYS.CURRENT_USER, user);
}

function createReservation(data) {
  const reservations = getReservations();
  reservations.push(data);
  writeStorage(STORAGE_KEYS.RESERVATIONS, reservations);
}

function removeReservation(id) {
  const reservations = getReservations().filter((reservation) => reservation.id !== id);
  writeStorage(STORAGE_KEYS.RESERVATIONS, reservations);
}

function roomReservationsOnDate(roomId, date) {
  return getReservations().filter(
    (reservation) => reservation.roomId === roomId && reservation.date === date
  );
}

function isOverlapping(existing, startTime, endTime) {
  return (
    existing.startTime < endTime &&
    startTime < existing.endTime
  );
}

function hasConflict(roomId, date, startTime, endTime) {
  const reservations = roomReservationsOnDate(roomId, date);
  return reservations.some((reservation) =>
    isOverlapping(reservation, startTime, endTime)
  );
}

function renderRoomOptions(selectElement) {
  const rooms = getRooms();
  selectElement.innerHTML = rooms
    .map((room) => `<option value="${room.id}">${room.name}</option>`)
    .join('');
}

function renderAvailability() {
  const roomId = elements.viewRoomSelect.value;
  const date = elements.viewDateInput.value;
  const reservations = roomReservationsOnDate(roomId, date);

  const formattedDate = date || 'nenhuma data selecionada';
  const room = getRooms().find((entry) => entry.id === roomId)?.name || 'Sala não encontrada';

  if (!date) {
    elements.availabilityStatus.textContent = `Selecione uma data para ver a disponibilidade de ${room}.`;
    elements.reservationList.innerHTML = '';
    return;
  }

  if (reservations.length === 0) {
    elements.availabilityStatus.textContent = `Nenhuma reserva encontrada para ${room} em ${formattedDate}. Horário livre.`;
    elements.reservationList.innerHTML = '';
    return;
  }

  elements.availabilityStatus.textContent = `Foram encontradas ${reservations.length} reserva(s) para ${room} em ${formattedDate}.`;
  elements.reservationList.innerHTML = reservations
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
    .map((reservation) => {
      const currentUser = getCurrentUser();
      const isOwner = currentUser && currentUser.name === reservation.reservedBy;
      return `
        <article class="reservation-card">
          <h3>${reservation.reason}</h3>
          <div class="reservation-meta">
            <span><strong>Responsável:</strong> ${reservation.reservedBy} (${reservation.userRole})</span>
            <span><strong>Data:</strong> ${reservation.date}</span>
            <span><strong>Início:</strong> ${reservation.startTime}</span>
            <span><strong>Fim:</strong> ${reservation.endTime}</span>
          </div>
          <div class="reservation-footer">
            <span class="reservation-badge">Reserva ativa</span>
            ${isOwner ? `<button data-id="${reservation.id}" class="cancel-button">Cancelar</button>` : ''}
          </div>
        </article>
      `;
    })
    .join('');
}

function displayMessage(message, type = 'info') {
  elements.formMessage.textContent = message;
  elements.formMessage.style.color = type === 'success' ? '#0369a1' : '#b91c1c';
}

function validateForm() {
  const name = elements.nameInput.value.trim();
  const reason = elements.reasonInput.value.trim();
  const date = elements.dateInput.value;
  const startTime = elements.startInput.value;
  const endTime = elements.endInput.value;

  if (!name || !reason || !date || !startTime || !endTime) {
    displayMessage('Preencha todos os campos obrigatórios.', 'error');
    return false;
  }

  if (startTime >= endTime) {
    displayMessage('O horário de início deve ser anterior ao horário de fim.', 'error');
    return false;
  }

  return true;
}

function clearForm() {
  elements.dateInput.value = '';
  elements.startInput.value = '';
  elements.endInput.value = '';
  elements.reasonInput.value = '';
  displayMessage('', 'info');
}

function handleReservationSubmission(event) {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  const roomId = elements.roomSelect.value;
  const date = elements.dateInput.value;
  const startTime = elements.startInput.value;
  const endTime = elements.endInput.value;
  const reservedBy = elements.nameInput.value.trim();
  const userRole = elements.roleSelect.value;
  const reason = elements.reasonInput.value.trim();

  if (hasConflict(roomId, date, startTime, endTime)) {
    displayMessage('Já existe uma reserva para este horário nesta sala.', 'error');
    return;
  }

  const reservation = {
    id: `res-${Date.now()}`,
    roomId,
    reservedBy,
    userRole,
    date,
    startTime,
    endTime,
    reason,
    createdAt: new Date().toISOString(),
    cancelledAt: null
  };

  createReservation(reservation);
  setCurrentUser({ id: reservedBy.toLowerCase().replace(/\s+/g, '-'), name: reservedBy, role: userRole });
  displayMessage('Reserva criada com sucesso.', 'success');
  renderAvailability();
  clearForm();
}

function handleCancel(event) {
  const button = event.target.closest('.cancel-button');
  if (!button) {
    return;
  }

  const reservationId = button.dataset.id;
  const currentUser = getCurrentUser();
  const reservation = getReservations().find((item) => item.id === reservationId);

  if (!reservation) {
    displayMessage('Reserva não encontrada.', 'error');
    return;
  }

  if (!currentUser || currentUser.name !== reservation.reservedBy) {
    displayMessage('Apenas o usuário que reservou pode cancelar esta reserva.', 'error');
    return;
  }

  removeReservation(reservationId);
  displayMessage('Reserva cancelada com sucesso.', 'success');
  renderAvailability();
}

function attachEventListeners() {
  elements.reservationForm.addEventListener('submit', handleReservationSubmission);
  elements.clearButton.addEventListener('click', clearForm);
  elements.viewRoomSelect.addEventListener('change', renderAvailability);
  elements.viewDateInput.addEventListener('input', renderAvailability);
  elements.reservationList.addEventListener('click', handleCancel);
}

function initializeView() {
  renderRoomOptions(elements.roomSelect);
  renderRoomOptions(elements.viewRoomSelect);
  if (!elements.viewDateInput.value) {
    const today = new Date().toISOString().slice(0, 10);
    elements.viewDateInput.value = today;
  }
  renderAvailability();
}

function initialize() {
  getRooms();
  attachEventListeners();
  initializeView();
}

initialize();
