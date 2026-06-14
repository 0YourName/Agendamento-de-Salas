# Data Model: Agendamento de Laboratórios

## Entities

### Sala de Laboratório
- `id`: identificador único da sala
- `name`: nome ou número da sala
- `description`: breve descrição opcional

### Reserva
- `id`: identificador único da reserva
- `roomId`: id da sala reservada
- `reservedBy`: nome do usuário que fez a reserva
- `userRole`: papel do usuário (professor, direção, zelador, técnico de manutenção)
- `date`: data da reserva
- `startTime`: horário de início
- `endTime`: horário de fim
- `reason`: motivo do agendamento
- `createdAt`: timestamp de criação
- `cancelledAt`: timestamp de cancelamento ou `null`

### Usuário Elegível
- `id`: identificador do usuário (local ao navegador)
- `name`: nome do usuário
- `role`: tipo de usuário

## Relationships

- Uma `Sala de Laboratório` pode ter muitas `Reservas`.
- Um `Usuário Elegível` pode criar muitas `Reservas`.
- Uma `Reserva` pertence a exatamente uma `Sala` e a exatamente um `Usuário`.

## Validation Rules

- `reason` é obrigatório e não pode ficar vazio.
- `date`, `startTime` e `endTime` são obrigatórios.
- `startTime` deve ser anterior a `endTime`.
- Reservas não podem se sobrepor para a mesma sala e intervalo.
- Apenas o usuário que criou a reserva pode cancelá-la.

## State Transitions

- `Criada` → `Ativa`: reserva válida e não cancelada.
- `Ativa` → `Cancelada`: o usuário responsável cancela a reserva.

## Storage Shape

No `localStorage`, os dados serão armazenados como arrays JSON:

- `rooms`: lista estática de salas disponíveis
- `reservations`: lista de objetos de reserva
- `currentUser`: informações do usuário autenticado na sessão

Exemplo de reserva:

```json
{
  "id": "r123",
  "roomId": "lab1",
  "reservedBy": "Maria Silva",
  "userRole": "Professor",
  "date": "2026-06-20",
  "startTime": "09:00",
  "endTime": "11:00",
  "reason": "Aula de redes",
  "createdAt": "2026-06-14T10:00:00Z",
  "cancelledAt": null
}
```
