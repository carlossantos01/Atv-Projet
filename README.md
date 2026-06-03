# AgendaFacil Barbearia

Sistema web de agendamento para barbearia. O estado atual contem back-end Node.js/Express em TypeScript, contratos compartilhados com Zod, front-end React/Vite em TypeScript e banco MySQL acessado com `mysql2/promise`.

## Tecnologias usadas

- Back-end: Node.js, Express, CORS, dotenv, bcrypt, jsonwebtoken, TypeScript e TSX.
- Banco de dados: MySQL, SQL versionado, MySQL Workbench e `mysql2/promise`.
- Front-end: React, Vite, TypeScript e ESLint.
- Contratos compartilhados: Zod e tipos derivados com `z.infer`.

## Estrutura de pastas

```txt
D:\Atv-Projet
  package.json
  package-lock.json
  tsconfig.json
  src/
    app.ts
    server.ts
    config/
      env.ts
    database/
      client.ts
      mappers.ts
    errors/
      app-error.ts
    middlewares/
      auth.middleware.ts
      error.middleware.ts
      validate.middleware.ts
    modules/
      auth/
      clientes/
      profissionais/
      servicos/
      agendamentos/
    utils/
      dates.ts
  database/
    schema.sql
    seed.sql
    migrations/
      001_create_initial_schema.sql
  docs/
    database.md
  packages/
    contracts/
  barbearia-frontend/
```

O back-end fica na raiz do projeto. O front-end fica em `barbearia-frontend/`. `packages/contracts/` concentra os schemas Zod e tipos compartilhados. `database/` guarda a modelagem SQL e o seed.

## Instalacao

Instale as dependencias do back-end na raiz:

```bash
npm install
```

Instale as dependencias do front-end:

```bash
cd barbearia-frontend
npm install
```

## Variaveis de ambiente

Use `.env.example` como base para `.env` na raiz:

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=barbearia_vanguard
JWT_SECRET=change-me
JWT_EXPIRES_IN=1d
CORS_ORIGIN=
```

`JWT_SECRET` deve ser trocado por um valor seguro fora do repositorio.

## Banco de dados

A modelagem oficial fica em:

- `database/migrations/001_create_initial_schema.sql`
- `database/schema.sql`
- `database/seed.sql`

No MySQL Workbench:

1. Abra uma conexao local.
2. Execute `database/migrations/001_create_initial_schema.sql`.
3. Execute `database/seed.sql`.
4. Confira se o schema `barbearia_vanguard` foi criado com as tabelas esperadas.

Pelo cliente `mysql`, quando disponivel:

```bash
mysql -u root -p < database/migrations/001_create_initial_schema.sql
mysql -u root -p barbearia_vanguard < database/seed.sql
```

O seed cria usuarios, clientes, profissionais, servicos e agendamentos de demonstracao. A senha local dos usuarios seed e `senha123`, armazenada como hash bcrypt.

Detalhes da modelagem, relacionamentos e indices estao em `docs/database.md`.

## Como rodar o back-end

Na raiz do projeto:

```bash
npm run dev
```

Outros scripts do back-end:

```bash
npm run typecheck
npm run build
npm start
```

O servidor sobe na porta definida por `PORT` ou `3000`.

## Como rodar o front-end

Dentro de `barbearia-frontend/`:

```bash
npm run dev
```

Outros scripts disponiveis:

```bash
npm run typecheck
npm run build
npm run lint
npm run preview
```

## Contratos compartilhados

Dentro de `packages/contracts/`:

```bash
npm run typecheck
npm run build
```

O pacote exporta schemas de usuario, auth, cliente, profissional, servico, agendamento e respostas padrao da API. O back-end valida `body`, `params` e `query` em runtime; o front-end importa tipos compartilhados para evitar DTOs duplicados.

## Autenticacao

O login usa JWT no header:

```txt
Authorization: Bearer <token>
```

Rotas administrativas de clientes, profissionais e servicos exigem token de usuario `admin`. O registro publico cria usuarios com perfil `cliente`; usuarios admin devem vir do seed ou de operacao administrativa futura.

## Rotas da API

Health:

- `GET /api/health`

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

Clientes:

- `GET /api/clientes`
- `GET /api/clientes/:id`
- `POST /api/clientes`
- `PUT /api/clientes/:id`
- `DELETE /api/clientes/:id`

Profissionais:

- `GET /api/profissionais?ativo=true|false`
- `GET /api/profissionais/:id`
- `POST /api/profissionais`
- `PUT /api/profissionais/:id`
- `DELETE /api/profissionais/:id` desativa o profissional.

Servicos:

- `GET /api/servicos?ativo=true|false`; por padrao lista ativos.
- `GET /api/servicos/:id`
- `POST /api/servicos`
- `PUT /api/servicos/:id`
- `DELETE /api/servicos/:id` desativa o servico.

Agendamentos:

- `GET /api/agendamentos?data=&status=&profissionalId=&clienteId=`
- `GET /api/agendamentos/:id`
- `POST /api/agendamentos`
- `PATCH /api/agendamentos/:id/cancelar`
- `PATCH /api/agendamentos/:id/reagendar`
- `DELETE /api/agendamentos/:id` mantido por compatibilidade; cancela o agendamento.

Na criacao de agendamento, envie `clienteId`, `profissionalId`, `servicoId`, `dataHoraInicio` e `observacao` opcional. O back-end calcula `dataHoraFim` pela duracao do servico, bloqueia horario passado, profissional/servico inativo e conflito para o mesmo profissional.

## Estado atual do front-end

- `App.tsx` ainda exibe a tela padrao do Vite/React.
- `Agenda.tsx` consome `http://localhost:3000/api/agendamentos`, mas ainda nao esta renderizado por `App.tsx`.
- A tela passou a ler `dataHoraInicio` do contrato atualizado.

## Pendencias conhecidas

- Executar migration e seed em um MySQL real configurado.
- Validar as rotas via HTTP contra banco real local.
- Remover a tela padrao do Vite em milestone apropriada.
- Montar a tela de agenda no app em milestone apropriada.
- Implementar disponibilidade completa da Milestone 6.
