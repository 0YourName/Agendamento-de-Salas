const STORAGE_KEYS = {
  ROOMS: 'rooms',
  RESERVATIONS: 'reservations',
  CURRENT_USER: 'currentUser'
};

const AUTH_KEYS = {
  CONFIRMED: 'confirmedUsers',
  PENDING: 'pendingUsers'
};

const defaultRooms = [
  { id: 'lab1', name: 'Laboratório 1' },
  { id: 'lab2', name: 'Laboratório 2' },
  { id: 'lab3', name: 'Laboratório 3' },
  { id: 'sala1', name: 'Sala 101' },
  { id: 'sala2', name: 'Sala 102' },
  { id: 'sala3', name: 'Sala 103' }
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

function getConfirmedUsers() {
  return readStorage(AUTH_KEYS.CONFIRMED, []);
}

function writeConfirmedUsers(list) {
  writeStorage(AUTH_KEYS.CONFIRMED, list);
}

function getPendingUsers() {
  return readStorage(AUTH_KEYS.PENDING, []);
}

function writePendingUsers(list) {
  writeStorage(AUTH_KEYS.PENDING, list);
}

function isUserConfirmed(name) {
  const confirmed = getConfirmedUsers();
  return confirmed.some(u => u.name === name);
}

function addPendingUser(user) {
  const list = getPendingUsers();
  if (!list.some(u => u.name === user.name)) {
    list.push(user);
    writePendingUsers(list);
  }
}

function confirmUser(name) {
  let pending = getPendingUsers();
  pending = pending.filter(u => u.name !== name);
  writePendingUsers(pending);
  const confirmed = getConfirmedUsers();
  if (!confirmed.some(u => u.name === name)) {
    confirmed.push({ name });
    writeConfirmedUsers(confirmed);
  }
}

function revokeUser(name) {
  let confirmed = getConfirmedUsers();
  confirmed = confirmed.filter(u => u.name !== name);
  writeConfirmedUsers(confirmed);
}

function createReservation(data) {
  const reservations = getReservations();
  reservations.push(data);
  writeStorage(STORAGE_KEYS.RESERVATIONS, reservations);
  if (calMonth !== null) renderCalendar(calMonth, calYear);
}

function removeReservation(id) {
  const reservations = getReservations().filter((reservation) => reservation.id !== id);
  writeStorage(STORAGE_KEYS.RESERVATIONS, reservations);
  if (calMonth !== null) renderCalendar(calMonth, calYear);
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

// Calendar state
let calMonth = null;
let calYear = null;

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function startWeekdayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

function renderCalendar(month, year) {
  const calendarEl = document.getElementById('calendar');
  const monthLabel = document.getElementById('calendar-month');
  if (!calendarEl || !monthLabel) return;

  const roomId = elements.viewRoomSelect.value || getRooms()[0].id;

  calMonth = month;
  calYear = year;

  const firstWeekday = startWeekdayOfMonth(year, month);
  const totalDays = daysInMonth(year, month);

  // previous month days to fill grid
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const prevDays = daysInMonth(prevYear, prevMonth);

  const cells = [];

  // Weekday headers
  const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  calendarEl.innerHTML = '';
  weekdays.forEach((wd) => {
    const hd = document.createElement('div');
    hd.className = 'calendar-weekday';
    hd.textContent = wd;
    calendarEl.appendChild(hd);
  });

  // filler from prev month
  for (let i = firstWeekday - 1; i >= 0; i--) {
    const dayNum = prevDays - i;
    const cell = document.createElement('div');
    cell.className = 'calendar-cell outside';
    cell.textContent = dayNum;
    calendarEl.appendChild(cell);
  }

  // current month days
  for (let d = 1; d <= totalDays; d++) {
    const dateStr = new Date(year, month, d).toISOString().slice(0, 10);
    const dayReservations = getReservations().filter(r => r.roomId === roomId && r.date === dateStr && !r.cancelledAt);
    const cell = document.createElement('div');
    cell.className = 'calendar-cell ' + (dayReservations.length ? 'occupied' : 'free');
    cell.tabIndex = 0;
    cell.dataset.date = dateStr;
    cell.textContent = d;
    calendarEl.appendChild(cell);
  }

  // fill next month's cells to complete the grid to full weeks
  const totalCells = calendarEl.querySelectorAll('.calendar-cell, .calendar-weekday').length;
  const remainder = totalCells % 7;
  if (remainder !== 0) {
    const needed = 7 - remainder;
    for (let i = 1; i <= needed; i++) {
      const cell = document.createElement('div');
      cell.className = 'calendar-cell outside';
      cell.textContent = i;
      calendarEl.appendChild(cell);
    }
  }

  const monthNames = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  monthLabel.textContent = `${monthNames[month]} ${year}`;
}

function changeCalendar(delta) {
  let m = calMonth;
  let y = calYear;
  m += delta;
  if (m < 0) { m = 11; y -= 1; }
  if (m > 11) { m = 0; y += 1; }
  renderCalendar(m, y);
}

function attachCalendarEvents() {
  const calendarEl = document.getElementById('calendar');
  const prev = document.getElementById('cal-prev');
  const next = document.getElementById('cal-next');

  if (prev) prev.addEventListener('click', () => changeCalendar(-1));
  if (next) next.addEventListener('click', () => changeCalendar(1));

  if (calendarEl) {
    calendarEl.addEventListener('click', (e) => {
      const cell = e.target.closest('.calendar-cell');
      if (!cell || !cell.dataset || !cell.dataset.date) return;
      const selected = cell.dataset.date;
      elements.viewDateInput.value = selected;
      elements.dateInput.value = selected;
      renderAvailability();
    });
  }
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

  const currentUser = getCurrentUser();
  if (!currentUser) {
    displayMessage('Você deve estar logado para criar reservas.', 'error');
    return;
  }

  if (!currentUser.isAdmin && !isUserConfirmed(currentUser.name)) {
    displayMessage('Sua conta precisa ser confirmada por um administrador antes de criar reservas.', 'error');
    return;
  }

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
  // ensure current user stored
  setCurrentUser({ id: reservedBy.toLowerCase().replace(/\s+/g, '-'), name: reservedBy, role: userRole, isAdmin: currentUser && currentUser.isAdmin });
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

  if (!currentUser) {
    displayMessage('Você precisa estar logado para cancelar reservas.', 'error');
    return;
  }

  if (!currentUser.isAdmin && currentUser.name !== reservation.reservedBy) {
    displayMessage('Apenas o usuário que reservou (ou admin) pode cancelar esta reserva.', 'error');
    return;
  }

  removeReservation(reservationId);
  displayMessage('Reserva cancelada com sucesso.', 'success');
  renderAvailability();
}

// Authentication UI handlers
function showLoginOverlay(show) {
  const overlay = document.getElementById('login-overlay');
  if (!overlay) return;
  overlay.style.display = show ? 'flex' : 'none';
  overlay.setAttribute('aria-hidden', show ? 'false' : 'true');
}

function renderUserInfo() {
  const info = document.getElementById('user-info');
  const loginBtn = document.getElementById('login-button');
  const logoutBtn = document.getElementById('logout-button');
  const adminPanel = document.getElementById('admin-panel');
  const currentUser = getCurrentUser();
  if (!info) return;
  if (currentUser) {
    info.textContent = `${currentUser.name} (${currentUser.role})` + (currentUser.isAdmin ? ' — Admin' : '');
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
    if (adminPanel) adminPanel.style.display = currentUser.isAdmin ? 'block' : 'none';
  } else {
    info.textContent = 'Não autenticado';
    loginBtn.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
    if (adminPanel) adminPanel.style.display = 'none';
  }
}

function handleLoginSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('login-name').value.trim();
  const password = document.getElementById('login-password').value;
  const role = document.getElementById('login-role').value;
  const msg = document.getElementById('login-message');

  if (!name || !password) {
    if (msg) msg.textContent = 'Preencha nome e senha.';
    return;
  }

  // admin shortcut
  if (name === 'admin' && password === 'admin') {
    const adminUser = { id: 'admin', name: 'admin', role: 'Admin', isAdmin: true };
    setCurrentUser(adminUser);
    if (msg) msg.textContent = 'Entrou como admin.';
    showLoginOverlay(false);
    renderUserInfo();
    renderAdminPanel();
    return;
  }

  // Regular users: create pending entry if not confirmed
  const user = { id: name.toLowerCase().replace(/\s+/g, '-'), name, role };
  setCurrentUser(user);
  const confirmed = isUserConfirmed(name);
  if (!confirmed) {
    // add to pending
    addPendingUser(user);
    if (msg) msg.textContent = 'Usuário pendente de confirmação. Aguarde um admin confirmar.';
  } else {
    if (msg) msg.textContent = 'Autenticado com sucesso.';
  }

  showLoginOverlay(false);
  renderUserInfo();
  renderAvailability();
  renderAdminPanel();
}

function handleLogout() {
  setCurrentUser(null);
  renderUserInfo();
  renderAvailability();
}

function renderAdminPanel() {
  const panel = document.getElementById('admin-panel');
  if (!panel) return;
  const currentUser = getCurrentUser();
  if (!currentUser || !currentUser.isAdmin) {
    panel.style.display = 'none';
    return;
  }

  panel.style.display = 'block';
  const pendingEl = document.getElementById('pending-list');
  const confirmedEl = document.getElementById('confirmed-list');
  pendingEl.innerHTML = '';
  confirmedEl.innerHTML = '';

  const pending = getPendingUsers();
  const confirmed = getConfirmedUsers();

  pending.forEach(u => {
    const div = document.createElement('div');
    div.className = 'user-list-item';
    div.innerHTML = `<span>${u.name} (${u.role})</span><div><button data-name="${u.name}" class="primary-button admin-confirm">Confirmar</button></div>`;
    pendingEl.appendChild(div);
  });

  confirmed.forEach(u => {
    const div = document.createElement('div');
    div.className = 'user-list-item';
    div.innerHTML = `<span>${u.name}</span><div><button data-name="${u.name}" class="secondary-button admin-revoke">Revogar</button></div>`;
    confirmedEl.appendChild(div);
  });

  // attach handlers
  pendingEl.querySelectorAll('.admin-confirm').forEach(btn => btn.addEventListener('click', (e) => {
    const name = e.target.dataset.name;
    confirmUser(name);
    renderAdminPanel();
  }));

  confirmedEl.querySelectorAll('.admin-revoke').forEach(btn => btn.addEventListener('click', (e) => {
    const name = e.target.dataset.name;
    revokeUser(name);
    renderAdminPanel();
  }));
}

function attachEventListeners() {
  elements.reservationForm.addEventListener('submit', handleReservationSubmission);
  elements.clearButton.addEventListener('click', clearForm);
  elements.viewRoomSelect.addEventListener('change', renderAvailability);
  elements.viewDateInput.addEventListener('input', renderAvailability);
  elements.reservationList.addEventListener('click', handleCancel);
  // calendar events
  attachCalendarEvents();
  elements.viewRoomSelect.addEventListener('change', () => {
    if (calMonth !== null) renderCalendar(calMonth, calYear);
  });

  // login UI
  const loginBtn = document.getElementById('login-button');
  const logoutBtn = document.getElementById('logout-button');
  const loginForm = document.getElementById('login-form');
  const loginCancel = document.getElementById('login-cancel');
  if (loginBtn) loginBtn.addEventListener('click', () => showLoginOverlay(true));
  if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
  if (loginForm) loginForm.addEventListener('submit', handleLoginSubmit);
  if (loginCancel) loginCancel.addEventListener('click', () => showLoginOverlay(false));
}

function initializeView() {
  renderRoomOptions(elements.roomSelect);
  renderRoomOptions(elements.viewRoomSelect);
  if (!elements.viewDateInput.value) {
    const today = new Date().toISOString().slice(0, 10);
    elements.viewDateInput.value = today;
  }
  // setup calendar for current month
  const now = new Date();
  renderCalendar(now.getMonth(), now.getFullYear());
  renderAvailability();
}

function initialize() {
  getRooms();
  attachEventListeners();
  initializeView();
  renderUserInfo();
  renderAdminPanel();

  // show login overlay if no user
  const cur = getCurrentUser();
  if (!cur) showLoginOverlay(true);
}

initialize();
