# Site Interface Contract: Agendamento de Laboratórios

## Page contract

A interface principal expõe:

- Um formulário de reserva com campos:
  - sala
  - data
  - horário de início
  - horário de fim
  - nome do reservador
  - papel do usuário
  - motivo do agendamento
- Um painel de disponibilidade que mostra reservas existentes por sala e período.
- Ação de cancelamento visível apenas para a reserva criada pelo usuário atual.

## Data contract

### Reservation
- `id`: string
- `roomId`: string
- `reservedBy`: string
- `userRole`: string
- `date`: string no formato `YYYY-MM-DD`
- `startTime`: string no formato `HH:MM`
- `endTime`: string no formato `HH:MM`
- `reason`: string
- `createdAt`: string ISO
- `cancelledAt`: string ISO ou `null`

### Room
- `id`: string
- `name`: string
- `description`: string opcional

### CurrentUser
- `id`: string
- `name`: string
- `role`: string

## Behavioral contract

- `createReservation(reservation)` deve validar conflito de horário e motivo obrigatório.
- `getReservations(roomId, date)` deve retornar todas as reservas ativas para a sala e a data solicitadas.
- `cancelReservation(reservationId, userId)` deve falhar se o `userId` não for o criador da reserva.
- O sistema deve indicar claramente se o horário está livre ou ocupado quando uma sala for consultada.

## Storage contract

- A aplicação usa `localStorage` com chaves:
  - `rooms`
  - `reservations`
  - `currentUser`

- Os dados de reserva são serializados como JSON e lidos/escritos de forma eficiente para reduzir o tempo de carregamento.
