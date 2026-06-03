# Modelagem do banco

Este projeto usa MySQL com SQL versionado e acesso pelo back-end via `mysql2/promise`. A modelagem principal esta em `database/migrations/001_create_initial_schema.sql`, com copia de referencia em `database/schema.sql` e dados de demonstracao em `database/seed.sql`.

## Configuracao

Configure as variaveis tradicionais de conexao MySQL no `.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=barbearia_vanguard
```

No MySQL Workbench:

1. Abra uma conexao com o servidor local.
2. Execute `database/migrations/001_create_initial_schema.sql`.
3. Execute `database/seed.sql`.
4. Valide visualmente as tabelas e relacionamentos no schema `barbearia_vanguard`.

Se o cliente `mysql` estiver no PATH:

```bash
mysql -u root -p < database/migrations/001_create_initial_schema.sql
mysql -u root -p barbearia_vanguard < database/seed.sql
```

Nesta sessao nao havia MySQL escutando em `localhost:3306`, entao a validacao real de CRUD contra banco permanece pendente.

## Entidades

### usuarios

Usuarios do sistema.

- `id`
- `nome`
- `email` unico
- `senha_hash`
- `perfil`: `admin`, `profissional` ou `cliente`
- `criado_em`
- `atualizado_em`

### clientes

Clientes atendidos pela barbearia.

- `id`
- `nome`
- `email` unico opcional
- `telefone`
- `criado_em`
- `atualizado_em`

### profissionais

Barbeiros/profissionais que executam servicos.

- `id`
- `nome`
- `especialidade`
- `telefone`
- `ativo`
- `criado_em`
- `atualizado_em`

### servicos

Servicos oferecidos pela barbearia. O servico nao guarda `profissional_id`; varios profissionais podem executar o mesmo servico.

- `id`
- `nome`
- `descricao`
- `duracao_min`
- `preco`
- `ativo`
- `criado_em`
- `atualizado_em`

### agendamentos

Reserva concreta de horario entre cliente, profissional e servico.

- `id`
- `cliente_id`
- `profissional_id`
- `servico_id`
- `data_hora_inicio`
- `data_hora_fim`
- `status`: `agendado`, `cancelado` ou `concluido`
- `observacao`
- `criado_em`
- `atualizado_em`

## Relacionamentos

- `agendamentos.cliente_id` referencia `clientes.id`.
- `agendamentos.profissional_id` referencia `profissionais.id`.
- `agendamentos.servico_id` referencia `servicos.id`.

O `profissional_id` fica diretamente em `agendamentos` para permitir que diferentes barbeiros executem o mesmo servico sem duplicar servicos por profissional.

## Indices

- `idx_agendamentos_data_inicio` em `data_hora_inicio`.
- `idx_agendamentos_profissional_data` em `profissional_id` e `data_hora_inicio`.

Esses indices suportam listagem por data, listagem por profissional e verificacao de conflito de horario.

## Regra de conflito

A API verifica conflito por profissional com a seguinte logica SQL:

```sql
novo_inicio < data_hora_fim
AND novo_fim > data_hora_inicio
AND profissional_id = ?
AND status != 'cancelado'
```

Ao reagendar, o agendamento atual e ignorado na consulta de conflito.

## Seed

O arquivo `database/seed.sql` cria:

- 2 usuarios demo;
- 3 clientes;
- 2 profissionais ativos;
- 4 servicos;
- 4 agendamentos com profissionais, servicos, inicio, fim e status.

Os dados sao demonstrativos. A senha demo dos usuarios seed e `senha123`, armazenada como hash bcrypt.
