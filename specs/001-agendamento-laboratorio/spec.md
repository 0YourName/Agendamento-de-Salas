# Feature Specification: Agendamento de Laboratórios

**Feature Branch**: `001-agendamento-laboratorio`

**Created**: 2026-06-14

**Status**: Draft

**Input**: User description: "Construa um site para agendamento de salas de aula de laboratorios com computadores, onde os professores e pessoas da direção, zeladores e técnicos de manutenção possam agendar a sala para o uso, impedindo outra pessoa fazer o mesmo. Quando a sala for agendada, tem que existir um motivo atrelado, ou seja, quando um outro docente for verificar a disponibilidade, deve aparecer o nome da pessoa que agendou, o dia e horários de inicio e fim do uso, e o motivo do agendamento. Inclua uma opção para cancelar o agendamento caso necessário, porém apenas o usuário que agendou possa faze-lo."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Reservar sala de laboratório (Priority: P1)

Um usuário elegível realiza uma reserva de sala de laboratório para um período específico, informando o motivo da utilização.

**Why this priority**: Esta é a função central do site e garante que a sala seja alocada com motivo e bloqueada para outros usuários.

**Independent Test**: Um usuário autenticado submete a reserva e consegue verificar que a sala fica indisponível para o mesmo horário.

**Acceptance Scenarios**:

1. **Given** um usuário elegível e uma sala disponível, **When** ele envia data, horário de início, horário de fim e motivo, **Then** a reserva é criada e a sala fica bloqueada para o intervalo especificado.
2. **Given** uma sala já reservada para o mesmo horário, **When** outro usuário tenta reservar a mesma sala no mesmo período, **Then** o sistema rejeita a reserva por conflito.

---

### User Story 2 - Visualizar disponibilidade e detalhes da reserva (Priority: P2)

Qualquer usuário elegível pode consultar o calendário de reservas e ver quem reservou, o dia, os horários de início e fim e o motivo da reserva.

**Why this priority**: A transparência da agenda evita conflitos e permite que os usuários planejem o uso com base nas reservas já definidas.

**Independent Test**: Um usuário acessa a agenda de uma sala e vê os detalhes completos de reservas existentes.

**Acceptance Scenarios**:

1. **Given** uma sala com reserva registrada, **When** o usuário visualiza a disponibilidade, **Then** ele vê o nome da pessoa que reservou, o dia, o horário de início e fim e o motivo da reserva.
2. **Given** uma sala sem reserva no período consultado, **When** o usuário verifica a disponibilidade, **Then** o sistema indica que o horário está livre.

---

### User Story 3 - Cancelar reserva pelo responsável (Priority: P3)

O usuário que criou a reserva pode cancelar a reserva, liberando a sala para outros usuários.

**Why this priority**: Permite correção de agendamentos incorretos ou mudanças de plano, mantendo o controle do uso da sala.

**Independent Test**: O reservador original cancela sua reserva e o horário fica disponível novamente.

**Acceptance Scenarios**:

1. **Given** uma reserva enviada por um usuário, **When** o mesmo usuário cancela a reserva, **Then** a reserva é removida e o intervalo volta a ficar disponível.
2. **Given** uma reserva enviada por um usuário, **When** outro usuário tenta cancelar essa reserva, **Then** o sistema impede a ação e mantém a reserva ativa.

---

### Edge Cases

- Reserva com horários sobrepostos em parte do mesmo intervalo deve ser bloqueada.
- Reserva com horário de fim anterior ao horário de início deve ser rejeitada.
- Tentativa de cancelar reserva expirado ou já concluída deve mostrar um estado de reserva não modificável ou atualização apropriada.
- Usuário tenta reservar ou cancelar sem estar autenticado ou sem perfil elegível deve ser impedido.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema deve permitir que professores, direção, zeladores e técnicos de manutenção reservem salas de laboratório com computadores.
- **FR-002**: O sistema deve exigir um motivo de uso para cada reserva criada.
- **FR-003**: O sistema deve impedir reservas duplicadas para a mesma sala e intervalo de tempo.
- **FR-004**: O sistema deve apresentar, na visualização de disponibilidade, o nome do usuário reservador, a data, o horário de início, o horário de fim e o motivo da reserva.
- **FR-005**: O sistema deve permitir o cancelamento de uma reserva apenas pelo usuário que a criou.
- **FR-006**: O sistema deve indicar claramente quando um horário está livre ou ocupado.
- **FR-007**: O site deve ser construído usando JavaScript e HTML/CSS.

### Key Entities *(include if feature involves data)*

- **Reserva de Sala**: representa a reserva de utilização de uma sala de laboratório, com sala, usuário, data, horário de início, horário de fim e motivo.
- **Sala de Laboratório**: representa uma sala de aula destinada a laboratórios com computadores e seu estado de disponibilidade.
- **Usuário Elegível**: representa a pessoa que pode agendar, incluindo professor, direção, zelador e técnico de manutenção.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Usuários elegíveis conseguem completar uma reserva em menos de 3 minutos a partir do início do fluxo.
- **SC-002**: O sistema bloqueia 100% das tentativas de reserva que conflitam com um horário já reservado para a mesma sala.
- **SC-003**: A agenda exibe nome, data, horários de início e fim, e motivo para todas as reservas ativas.
- **SC-004**: Apenas o usuário que criou a reserva consegue cancelá-la; todas as tentativas de cancelamento por terceiros são rejeitadas.
- **SC-005**: A vista de disponibilidade deixa claro se o período está livre ou ocupado para cada sala consultada.

## Assumptions

- Existe um sistema de autenticação e identificação de usuários elegíveis no site.
- O suporte à consulta e ao uso das salas é feito por um site web e não por um app nativo neste escopo.
- Cada reserva cobre exatamente um intervalo contínuo de início e fim; reservas múltiplas para o mesmo usuário em horários distintos são permitidas.
- Não há necessidade de gerenciar recursos físicos de hardware além da disponibilidade da sala.
- A regra de elegibilidade inclui professores, direção, zeladores e técnicos de manutenção, e não inclui outros perfis de usuário fora desses grupos.
