# Tasks: Agendamento de Laboratórios

**Input**: Design documents from `/specs/001-agendamento-laboratorio/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and static site scaffold

- [ ] T001 Create root HTML file at `index.html` with content sections for reservation form and availability view
- [ ] T002 Create stylesheet at `styles.css` with a minimal, direct layout and fast-loading CSS rules
- [ ] T003 Create application script at `app.js` with the initial page state and DOM binding setup
- [ ] T004 [P] Create `specs/001-agendamento-laboratorio/plan.md` and `specs/001-agendamento-laboratorio/research.md` content for implementation guidance

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core browser storage and reservation engine

- [ ] T005 Implement `localStorage` persistence helpers in `app.js` for `rooms`, `reservations`, and `currentUser`
- [ ] T006 Implement reservation data shape and default room list in `app.js` according to `data-model.md`
- [ ] T007 [P] Implement current user selection and eligible role handling in `index.html` and `app.js`
- [ ] T008 [P] Implement conflict detection logic in `app.js` to reject overlapping reservations for the same room and interval
- [ ] T009 Implement required-field validation in `app.js` for date, start time, end time, and reason

**Checkpoint**: Core reservation storage and validation logic is ready, enabling story implementation

---

## Phase 3: User Story 1 - Reservar sala de laboratório (Priority: P1)

**Goal**: Permitir que um usuário elegível reserve uma sala de laboratório com motivo obrigatório

**Independent Test**: O usuário preenche o formulário, submete a reserva e a sala fica bloqueada para o período informado

- [ ] T010 [US1] Add reservation form fields to `index.html` for room, date, start time, end time, user name, user role, and reason
- [ ] T011 [US1] Implement reservation creation in `app.js` and persist the new reservation to `localStorage`
- [ ] T012 [US1] Implement UI feedback in `app.js` for successful reservation creation and conflict rejection
- [ ] T013 [US1] Implement metadata storage in `app.js` so each reservation includes `reservedBy`, `userRole`, `createdAt`, and `reason`

**Checkpoint**: Reserve room flows should work end to end and prevent duplicate overlapping reservations

---

## Phase 4: User Story 2 - Visualizar disponibilidade e detalhes da reserva (Priority: P2)

**Goal**: Mostrar disponibilidade e detalhes da reserva com nome, data, horários e motivo

**Independent Test**: O usuário visualiza uma sala e vê reservas existentes com todos os dados obrigatórios

- [ ] T014 [US2] Add availability display sections to `index.html` for selected room and date
- [ ] T015 [US2] Implement reservation rendering in `app.js` showing reserved user, date, start/end times, and reason for each active reservation
- [ ] T016 [US2] Implement room/date filter controls in `index.html` and `app.js` so users can view availability por sala e data
- [ ] T017 [US2] Implement a clear free/occupied indicator in `app.js` for the selected room and date

**Checkpoint**: Availability view should display reservation details and clearly show when a slot is free or occupied

---

## Phase 5: User Story 3 - Cancelar reserva pelo responsável (Priority: P3)

**Goal**: Permitir que apenas o criador da reserva cancele a reserva

**Independent Test**: O usuário que criou a reserva cancela ela e o horário volta a ficar disponível; outros usuários não podem cancelar

- [ ] T018 [US3] Add cancel controls to reservation entries in `index.html`
- [ ] T019 [US3] Implement owner-only cancellation logic in `app.js` by comparing the current user with `reservedBy`
- [ ] T020 [US3] Implement reservation cancellation in `app.js` by marking or removing the reservation and refreshing the availability view
- [ ] T021 [US3] Implement user feedback in `app.js` when cancellation is denied for non-owners

**Checkpoint**: Only the original reservador pode cancelar, e a UI reflete o estado atualizado corretamente

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Simplify, optimize, and document the site

- [ ] T022 [P] Refine `styles.css` to keep the UI minimal, accessible, and fast-loading
- [ ] T023 [P] Simplify `app.js` logic and remove any unused or duplicate code paths
- [ ] T024 [P] Add inline helper text in `index.html` for reservation form fields and availability controls
- [ ] T025 [P] Update `specs/001-agendamento-laboratorio/quickstart.md` with actual manual validation steps for the built site

---

## Dependencies & Execution Order

- **Setup (Phase 1)**: No dependencies, begin immediately
- **Foundational (Phase 2)**: Depends on Setup completion
- **User Stories (Phase 3+)**: Depend on Foundational logic; US2 and US3 require the core reservation engine
- **Polish (Phase 6)**: Depends on the targeted user story implementations

### Story Dependencies

- **US1 (P1)**: Core reservation creation must be complete before the site can be used normally
- **US2 (P2)**: Can be built after foundational tasks; relies on reservation data from US1 for real validation
- **US3 (P3)**: Can be built after foundational tasks; requires US1 for real cancellation flow

### Parallel Opportunities

- `T002`, `T003`, and `T004` can be worked in parallel during Setup
- `T007` and `T008` can be developed in parallel because they target different parts of the foundational app logic
- `T014`, `T015`, and `T016` can be implemented in parallel within the availability view work
- `T022`, `T023`, `T024`, and `T025` can run in parallel during polish phase

## Implementation Strategy

- Build MVP first by completing Setup and Foundational phases, then deliver US1
- After US1 works, add US2 to provide visibility into schedule details
- Add US3 last to allow owner-only cancellation
- Keep code minimal and direct: avoid extra files or frameworks, use simple DOM updates and browser `localStorage`
