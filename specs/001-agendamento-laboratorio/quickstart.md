# Quickstart: Agendamento de Laboratórios

## Abrir o site

1. Abra `index.html` diretamente no navegador.
2. Ou use um servidor estático simples, por exemplo:

```bash
npx serve .
```

## Como usar

1. Selecione a sala de laboratório desejada.
2. Escolha a data, horário de início e horário de fim.
3. Informe seu nome, papel e o motivo do agendamento.
4. Clique em `Reservar`.
5. A lista de reservas exibirá os detalhes existentes, incluindo nome do reservador, data, horários e motivo.
6. Para cancelar, clique em `Cancelar` apenas em reservas criadas por você.

## Observações

- O armazenamento é feito no `localStorage` do navegador para manter os dados entre recargas.
- O site foi projetado para ser rápido e minimalista, com poucos arquivos e sem dependências externas.
- Não há testes automatizados nesta versão; a validação é feita manualmente através do fluxo do usuário.
