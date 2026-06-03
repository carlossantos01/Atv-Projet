# Specs Driven Development — AgendaFácil Barbearia

> Projeto: sistema web de agendamento para barbearia, com Banco de Dados + Back-End + Front-End, usando tipagem completa de ponta a ponta.

---

## 0. Regras do desenvolvimento

- [ ] Antes de implementar uma milestone, ler este arquivo inteiro.
- [ ] Implementar uma milestone por vez.
- [ ] Não avançar para a próxima milestone sem validar a anterior.
- [ ] Não marcar checkbox apenas porque um arquivo foi criado.
- [ ] Marcar checkbox somente quando a task estiver implementada, testada e funcionando.
- [ ] Cada milestone deve terminar com um pequeno relatório: arquivos alterados, o que foi feito, comandos executados e pendências.
- [ ] Nenhuma rota, entidade ou regra de negócio deve ser criada sem estar descrita neste documento.
- [ ] A tipagem deve cobrir banco, back-end, contratos de API e front-end.
- [ ] Inputs externos devem ter validação em runtime, não apenas TypeScript.

---

## 1. Visão geral do produto

O projeto é um sistema web para barbearia onde clientes podem agendar serviços com barbeiros disponíveis.

O sistema deve permitir:

- cadastro e login de usuário;
- cadastro de clientes;
- cadastro de profissionais/barbeiros;
- cadastro de serviços da barbearia;
- criação de agendamentos;
- listagem da agenda por dia;
- cancelamento de agendamento;
- reagendamento;
- validação para evitar conflito de horários;
- visualização clara da agenda no front-end.

---

## 2. Stack alvo

### 2.1 Banco de dados

- MySQL.
- Modelagem relacional.
- Migrations versionadas.
- Seeds de dados de demonstração.

### 2.2 Back-end

- Node.js.
- Express.
- TypeScript.
- Repositórios tipados com mysql2.
- Zod para validação de entrada e saída.
- bcrypt para senha.
- jsonwebtoken para autenticação.
- dotenv para variáveis de ambiente.
- cors configurado.

### 2.3 Front-end

- React.
- Vite.
- TypeScript.
- React Router.
- Fetch ou Axios com cliente tipado.
- Componentes tipados.
- Estados tipados.
- Formulários com validação.

### 2.4 Contratos compartilhados

Criar uma camada compartilhada para tipos e schemas:

```txt
/packages/contracts
  ├── src
  │   ├── schemas
  │   │   ├── auth.schema.ts
  │   │   ├── cliente.schema.ts
  │   │   ├── profissional.schema.ts
  │   │   ├── servico.schema.ts
  │   │   └── agendamento.schema.ts
  │   ├── types
  │   │   └── api.types.ts
  │   └── index.ts
```

Os tipos usados no front-end devem vir desses contratos, não de duplicação manual.

---

## 3. Modelo de domínio

### 3.1 Usuário

Representa quem acessa o sistema.

Campos mínimos:

- id;
- nome;
- email;
- senhaHash;
- perfil: `admin`, `profissional` ou `cliente`;
- criadoEm;
- atualizadoEm.

### 3.2 Cliente

Pessoa que agenda serviços.

Campos mínimos:

- id;
- nome;
- email;
- telefone;
- criadoEm;
- atualizadoEm.

### 3.3 Profissional

Barbeiro que atende clientes.

Campos mínimos:

- id;
- nome;
- especialidade;
- telefone;
- ativo;
- criadoEm;
- atualizadoEm.

### 3.4 Serviço

Serviço oferecido pela barbearia.

Campos mínimos:

- id;
- nome;
- descricao;
- duracaoMin;
- preco;
- ativo;
- criadoEm;
- atualizadoEm.

### 3.5 Agendamento

Reserva de horário entre cliente, serviço e profissional.

Campos mínimos:

- id;
- clienteId;
- profissionalId;
- servicoId;
- dataHoraInicio;
- dataHoraFim;
- status: `agendado`, `cancelado`, `concluido`;
- observacao;
- criadoEm;
- atualizadoEm.

Regra importante: o agendamento deve guardar `profissionalId` diretamente, não depender apenas do profissional vinculado ao serviço. Isso permite que vários barbeiros façam o mesmo serviço.

---

## 4. Contrato de API esperado

### Health

- [ ] `GET /api/health`
  - Retorna status da API.

### Auth

- [ ] `POST /api/auth/register`
  - Cria usuário.
- [ ] `POST /api/auth/login`
  - Autentica usuário.
- [ ] `GET /api/auth/me`
  - Retorna usuário logado.

### Clientes

- [ ] `GET /api/clientes`
- [ ] `GET /api/clientes/:id`
- [ ] `POST /api/clientes`
- [ ] `PUT /api/clientes/:id`
- [ ] `DELETE /api/clientes/:id`

### Profissionais

- [ ] `GET /api/profissionais`
- [ ] `GET /api/profissionais/:id`
- [ ] `POST /api/profissionais`
- [ ] `PUT /api/profissionais/:id`
- [ ] `DELETE /api/profissionais/:id`

### Serviços

- [ ] `GET /api/servicos`
- [ ] `GET /api/servicos/:id`
- [ ] `POST /api/servicos`
- [ ] `PUT /api/servicos/:id`
- [ ] `DELETE /api/servicos/:id`

### Agendamentos

- [ ] `GET /api/agendamentos`
  - Deve aceitar filtros por data, status, profissional e cliente.
- [ ] `GET /api/agendamentos/:id`
- [ ] `POST /api/agendamentos`
- [ ] `PATCH /api/agendamentos/:id/cancelar`
- [ ] `PATCH /api/agendamentos/:id/reagendar`
- [ ] `DELETE /api/agendamentos/:id`

### Disponibilidade

- [ ] `GET /api/disponibilidade?profissionalId=&servicoId=&data=`
  - Retorna horários livres para um barbeiro em uma data.

---

## 5. Milestone 0 — Diagnóstico e organização inicial

Objetivo: entender o projeto atual e preparar o terreno sem alterar regra de negócio.

### Tasks

- [x] Mapear estrutura atual do projeto.
- [x] Confirmar se back-end e front-end estão em pastas separadas.
- [x] Confirmar scripts disponíveis no `package.json` raiz.
- [x] Confirmar scripts disponíveis no `barbearia-frontend/package.json`.
- [x] Mapear arquivos atuais do back-end.
- [x] Mapear arquivos atuais do front-end.
- [x] Mapear schema SQL atual.
- [x] Identificar entidades já existentes: usuários, clientes, profissionais, serviços e agendamentos.
- [x] Identificar rotas já existentes.
- [x] Identificar o que ainda está mockado ou padrão do Vite.
- [x] Criar ou atualizar `README.md` com instruções de instalação.
- [x] Criar `.env.example` na raiz do back-end.
- [x] Criar `.env.example` no front-end.
- [x] Garantir que `node_modules` não faça parte do versionamento.

### Critérios de aceite

- [x] O projeto consegue ser explicado pela estrutura de pastas.
- [x] Há documentação mínima para rodar back-end, banco e front-end.
- [x] Não há alteração funcional sem necessidade.

---

## 6. Milestone 1 — Migração para TypeScript end-to-end

Objetivo: transformar o projeto em TypeScript no back-end e no front-end.

### Back-end

- [x] Instalar TypeScript no back-end.
- [x] Instalar tipos do Node.
- [x] Instalar tipos do Express.
- [x] Criar `tsconfig.json` no back-end.
- [x] Criar script `dev` com execução TypeScript.
- [x] Criar script `build`.
- [x] Criar script `typecheck`.
- [x] Migrar `server.js` para `server.ts`.
- [x] Migrar `src/app.js` para `src/app.ts`.
- [x] Migrar configuração de banco para TypeScript.
- [x] Migrar rotas para TypeScript.
- [x] Migrar controllers para TypeScript.
- [x] Remover uso de `any` sempre que possível.
- [x] Garantir que `npm run typecheck` passe no back-end.

### Front-end

- [x] Migrar Vite React para TypeScript.
- [x] Renomear `main.jsx` para `main.tsx`.
- [x] Renomear `App.jsx` para `App.tsx`.
- [x] Renomear `Agenda.jsx` para `Agenda.tsx`.
- [x] Criar tipos para estados do React.
- [x] Tipar props de componentes.
- [x] Tipar eventos de formulário.
- [x] Criar script `typecheck` no front-end.
- [x] Garantir que `npm run typecheck` passe no front-end.
- [x] Garantir que `npm run build` passe no front-end.

### Critérios de aceite

- [x] Back-end compila sem erro de TypeScript.
- [x] Front-end compila sem erro de TypeScript.
- [x] Nenhum arquivo principal permanece em `.js` ou `.jsx`, exceto configurações quando justificável.

---

## 7. Milestone 2 — Contratos compartilhados e validação runtime

Objetivo: criar uma fonte única de verdade para schemas e tipos usados por API e front-end.

### Tasks

- [x] Criar pasta `packages/contracts`.
- [x] Configurar TypeScript no pacote de contratos.
- [x] Instalar e configurar Zod.
- [x] Criar schema de usuário.
- [x] Criar schema de autenticação.
- [x] Criar schema de cliente.
- [x] Criar schema de profissional.
- [x] Criar schema de serviço.
- [x] Criar schema de agendamento.
- [x] Criar enums tipados: perfil do usuário e status do agendamento.
- [x] Criar schemas de input para criação.
- [x] Criar schemas de input para edição.
- [x] Criar schemas de output da API.
- [x] Exportar tipos com `z.infer`.
- [x] Consumir os schemas no back-end para validar `req.body`, `req.params` e `req.query`.
- [x] Consumir os tipos no front-end para tipar respostas da API.
- [x] Criar formato padrão de erro da API.
- [x] Criar formato padrão de resposta de sucesso.

### Critérios de aceite

- [x] Nenhum DTO é duplicado manualmente entre front-end e back-end.
- [x] Toda entrada externa passa por validação runtime.
- [x] O front-end usa tipos derivados dos schemas compartilhados.

---

## 8. Milestone 3 — Banco de dados tipado e modelagem correta

Objetivo: corrigir e fortalecer a modelagem da barbearia.

### Tasks

- [x] Escolher abordagem de banco tipado: mysql2 com repositórios tipados.
- [x] Criar migrations versionadas.
- [x] Criar tabela de usuários.
- [x] Criar tabela de clientes.
- [x] Criar tabela de profissionais.
- [x] Criar tabela de serviços.
- [x] Criar tabela de agendamentos.
- [x] Adicionar `profissionalId` diretamente em agendamentos.
- [x] Adicionar `dataHoraInicio` e `dataHoraFim` em agendamentos.
- [x] Adicionar status controlado por enum ou validação.
- [x] Adicionar timestamps: `criadoEm` e `atualizadoEm`.
- [x] Criar índices para consultas por data.
- [x] Criar índices para consultas por profissional.
- [x] Criar seeds realistas de clientes.
- [x] Criar seeds realistas de profissionais.
- [x] Criar seeds realistas de serviços.
- [x] Criar seeds realistas de agendamentos.
- [x] Documentar DER/modelagem no README ou em `docs/database.md`.

### Critérios de aceite

- [x] O banco representa corretamente uma barbearia.
- [x] É possível saber qual cliente, barbeiro e serviço pertencem a cada agendamento.
- [x] É possível calcular conflito de horários.
- [x] Dados iniciais permitem testar o sistema sem cadastro manual.

---

## 9. Milestone 4 — Back-end completo e tipado

Objetivo: entregar API funcional com CRUD e regras de negócio.

> Observação de validação em 2026-06-01: a implementação da Milestone 4 foi corrigida para MySQL com `mysql2/promise`, repositórios tipados e SQL versionado. Foram executados `npm install`, typecheck e build na raiz, typecheck/build em `packages/contracts`, install/typecheck/build/lint no front-end e testes HTTP sem banco para health/auth/validação. Como não há MySQL escutando em `localhost:3306` nem cliente `mysql` no PATH, as checkboxes que dependem de execução real contra banco permanecem abertas até validação com MySQL local.

### Estrutura esperada

```txt
src
  ├── app.ts
  ├── server.ts
  ├── config
  │   └── env.ts
  ├── database
  │   └── client.ts
  ├── middlewares
  │   ├── auth.middleware.ts
  │   ├── error.middleware.ts
  │   └── validate.middleware.ts
  ├── modules
  │   ├── auth
  │   ├── clientes
  │   ├── profissionais
  │   ├── servicos
  │   └── agendamentos
  └── utils
      └── dates.ts
```

### Auth

- [ ] Criar registro de usuário.
- [x] Criptografar senha com bcrypt.
- [ ] Criar login com JWT.
- [x] Criar middleware de autenticação.
- [ ] Criar rota `GET /api/auth/me`.
- [ ] Proteger rotas administrativas quando necessário.

### Clientes

- [ ] Listar clientes.
- [ ] Buscar cliente por ID.
- [ ] Criar cliente.
- [ ] Editar cliente.
- [ ] Remover cliente.
- [ ] Validar e-mail duplicado.
- [ ] Validar telefone obrigatório.

### Profissionais

- [ ] Listar profissionais.
- [ ] Buscar profissional por ID.
- [ ] Criar profissional.
- [ ] Editar profissional.
- [ ] Ativar/desativar profissional.
- [ ] Impedir agendamento com profissional inativo.

### Serviços

- [ ] Listar serviços ativos.
- [ ] Buscar serviço por ID.
- [ ] Criar serviço.
- [ ] Editar serviço.
- [ ] Ativar/desativar serviço.
- [ ] Validar duração maior que zero.
- [ ] Validar preço maior ou igual a zero.

### Agendamentos

- [ ] Listar agendamentos.
- [ ] Filtrar agendamentos por data.
- [ ] Filtrar agendamentos por profissional.
- [ ] Filtrar agendamentos por cliente.
- [ ] Criar agendamento.
- [ ] Calcular `dataHoraFim` com base na duração do serviço.
- [ ] Bloquear conflito de horário para o mesmo profissional.
- [ ] Bloquear agendamento em horário passado.
- [ ] Cancelar agendamento.
- [ ] Reagendar agendamento.
- [ ] Manter histórico básico por status.
- [ ] Retornar mensagens de erro claras.

### Critérios de aceite

- [ ] Todas as rotas respondem com tipos previsíveis.
- [ ] Toda rota valida input com schema compartilhado.
- [ ] Toda regra de negócio crítica está no back-end.
- [ ] O back-end não confia em validação do front-end.

---

## 10. Milestone 5 — Front-end funcional e tipado

Objetivo: substituir a tela padrão do Vite por uma interface real da barbearia.

### Estrutura esperada

```txt
src
  ├── app
  │   └── router.tsx
  ├── components
  │   ├── Button.tsx
  │   ├── Input.tsx
  │   ├── Select.tsx
  │   ├── Card.tsx
  │   └── EmptyState.tsx
  ├── features
  │   ├── auth
  │   ├── clientes
  │   ├── profissionais
  │   ├── servicos
  │   └── agendamentos
  ├── lib
  │   ├── api.ts
  │   └── formatters.ts
  ├── styles
  │   └── globals.css
  └── main.tsx
```

### Rotas de tela

- [ ] `/login`
- [ ] `/dashboard`
- [ ] `/clientes`
- [ ] `/profissionais`
- [ ] `/servicos`
- [ ] `/agendamentos`
- [ ] `/agendamentos/novo`
- [ ] `/agenda-dia`

### Cliente de API tipado

- [ ] Criar `api.ts` centralizado.
- [ ] Tipar resposta de erro.
- [ ] Tipar resposta de sucesso.
- [ ] Criar função tipada para login.
- [ ] Criar função tipada para listar clientes.
- [ ] Criar função tipada para listar profissionais.
- [ ] Criar função tipada para listar serviços.
- [ ] Criar função tipada para listar agendamentos.
- [ ] Criar função tipada para criar agendamento.
- [ ] Criar função tipada para cancelar agendamento.
- [ ] Criar função tipada para reagendar agendamento.

### Dashboard

- [ ] Exibir total de agendamentos do dia.
- [ ] Exibir próximos horários.
- [ ] Exibir quantidade de clientes cadastrados.
- [ ] Exibir quantidade de profissionais ativos.
- [ ] Exibir cards com dados reais da API.

### Agenda

- [ ] Listar agenda do dia.
- [ ] Mostrar horário, cliente, serviço, profissional e status.
- [ ] Permitir cancelar agendamento.
- [ ] Permitir filtrar por barbeiro.
- [ ] Permitir filtrar por data.
- [ ] Exibir estado vazio quando não houver horários.
- [ ] Exibir loading.
- [ ] Exibir erro amigável.

### Novo agendamento

- [ ] Selecionar cliente.
- [ ] Selecionar profissional.
- [ ] Selecionar serviço.
- [ ] Selecionar data.
- [ ] Exibir horários disponíveis.
- [ ] Criar agendamento.
- [ ] Redirecionar para agenda após sucesso.
- [ ] Mostrar erro quando horário estiver indisponível.

### Critérios de aceite

- [ ] A tela padrão do Vite foi removida.
- [ ] A aplicação parece um sistema de barbearia.
- [ ] Todos os dados principais vêm da API.
- [ ] Estados React estão tipados.
- [ ] Nenhuma resposta da API é tratada como `any`.

---

## 11. Milestone 6 — Regras de agenda e disponibilidade

Objetivo: tornar o agendamento confiável.

### Tasks

- [ ] Definir horário de funcionamento da barbearia.
- [ ] Criar regra para intervalo mínimo dos slots.
- [ ] Gerar horários disponíveis por profissional.
- [ ] Considerar duração do serviço na disponibilidade.
- [ ] Bloquear horários já ocupados.
- [ ] Bloquear profissional inativo.
- [ ] Bloquear serviço inativo.
- [ ] Bloquear datas passadas.
- [ ] Bloquear agendamento fora do horário de funcionamento.
- [ ] Permitir reagendar apenas agendamentos ativos.
- [ ] Permitir cancelar apenas agendamentos ativos.
- [ ] Não deletar fisicamente quando a ação for cancelamento; alterar status para `cancelado`.

### Critérios de aceite

- [ ] Dois clientes não conseguem marcar o mesmo barbeiro no mesmo horário.
- [ ] A duração do serviço influencia a disponibilidade.
- [ ] O front-end mostra apenas horários válidos.
- [ ] O back-end bloqueia horários inválidos mesmo se a requisição for manual.

---

## 12. Milestone 7 — UI, UX e identidade visual da barbearia

Objetivo: deixar o sistema apresentável para entrega e portfólio.

### Direção visual

- Visual escuro ou elegante, inspirado em barbearia premium.
- Cores sugeridas:
  - fundo escuro;
  - dourado/âmbar para destaque;
  - branco ou cinza claro para texto;
  - vermelho apenas para ações destrutivas.
- Interface simples, limpa e funcional.

### Tasks

- [ ] Criar layout principal com sidebar ou header.
- [ ] Criar navegação entre telas.
- [ ] Criar componentes reutilizáveis.
- [ ] Padronizar botões.
- [ ] Padronizar inputs.
- [ ] Padronizar tabelas.
- [ ] Padronizar cards.
- [ ] Padronizar mensagens de erro.
- [ ] Padronizar estados vazios.
- [ ] Garantir responsividade básica.
- [ ] Melhorar tela de login.
- [ ] Melhorar dashboard.
- [ ] Melhorar agenda.
- [ ] Melhorar formulário de agendamento.
- [ ] Remover qualquer texto ou imagem padrão do Vite/React.

### Critérios de aceite

- [ ] O usuário entende que o sistema é de uma barbearia sem precisar ler o código.
- [ ] A navegação é clara.
- [ ] O sistema funciona em desktop e mobile básico.
- [ ] O visual está coerente entre telas.

---

## 13. Milestone 8 — Testes, qualidade e segurança

Objetivo: validar o projeto antes da entrega.

### Back-end

- [ ] Adicionar teste de health check.
- [ ] Adicionar teste de criação de cliente.
- [ ] Adicionar teste de criação de profissional.
- [ ] Adicionar teste de criação de serviço.
- [ ] Adicionar teste de criação de agendamento.
- [ ] Adicionar teste de conflito de horário.
- [ ] Adicionar teste de cancelamento.
- [ ] Adicionar teste de login.
- [ ] Garantir que senha nunca é retornada pela API.
- [ ] Garantir que erro interno não expõe dados sensíveis.

### Front-end

- [ ] Testar renderização da agenda.
- [ ] Testar estado vazio.
- [ ] Testar loading.
- [ ] Testar erro da API.
- [ ] Testar formulário de novo agendamento.
- [ ] Testar cancelamento de agendamento.

### Qualidade

- [ ] Rodar typecheck no back-end.
- [ ] Rodar typecheck no front-end.
- [ ] Rodar lint no back-end.
- [ ] Rodar lint no front-end.
- [ ] Rodar build no back-end.
- [ ] Rodar build no front-end.
- [ ] Remover console logs desnecessários.
- [ ] Revisar variáveis de ambiente.

### Critérios de aceite

- [ ] O projeto compila sem erros.
- [ ] As principais regras de negócio têm teste.
- [ ] O sistema não expõe senha.
- [ ] O projeto está pronto para demonstração.

---

## 14. Milestone 9 — Documentação final e apresentação

Objetivo: preparar entrega acadêmica e portfólio.

### Tasks

- [ ] Atualizar README principal.
- [ ] Explicar objetivo do projeto.
- [ ] Explicar tecnologias usadas.
- [ ] Explicar como rodar o banco.
- [ ] Explicar como rodar o back-end.
- [ ] Explicar como rodar o front-end.
- [ ] Listar rotas da API.
- [ ] Listar telas do sistema.
- [ ] Adicionar prints do sistema.
- [ ] Documentar regras de negócio.
- [ ] Documentar modelagem do banco.
- [ ] Criar roteiro de apresentação.
- [ ] Criar checklist final de entrega.

### Critérios de aceite

- [ ] Uma pessoa consegue instalar e rodar o projeto lendo o README.
- [ ] A proposta da barbearia está clara.
- [ ] A tipagem end-to-end está explicada.
- [ ] O projeto está pronto para apresentar.

---

## 15. Checklist final de tipagem end-to-end

- [ ] Banco modelado com tipos previsíveis.
- [ ] Queries ou ORM retornam tipos conhecidos.
- [ ] Controllers não usam `any`.
- [ ] Middlewares não usam `any` sem justificativa.
- [ ] Inputs da API são validados com Zod.
- [ ] Outputs da API têm schema.
- [ ] Front-end importa tipos compartilhados.
- [ ] Estados React são tipados.
- [ ] Props são tipadas.
- [ ] Eventos de formulário são tipados.
- [ ] Cliente HTTP é tipado.
- [ ] Erros da API são tipados.
- [ ] `npm run typecheck` passa no back-end.
- [ ] `npm run typecheck` passa no front-end.
- [ ] `npm run build` passa no back-end.
- [ ] `npm run build` passa no front-end.

---

## 16. Prompt recomendado para execução por IA/agente

Use este prompt quando for pedir a implementação de cada etapa:

```txt
Leia o arquivo specs.md inteiro antes de modificar qualquer código.

Implemente somente a milestone indicada abaixo. Não avance para próximas milestones.

Milestone alvo: [informar número e nome da milestone]

Regras obrigatórias:
- Preserve a proposta do projeto: sistema de agendamento para barbearia.
- Use TypeScript com tipagem forte de ponta a ponta.
- Não use `any`, exceto quando houver justificativa técnica documentada.
- Valide inputs externos com schemas compartilhados.
- Não duplique tipos entre front-end e back-end.
- Não altere regra de negócio fora do escopo da milestone.
- Não marque checkboxes sem implementar e validar.
- Ao final, entregue relatório com arquivos alterados, comandos executados, validações feitas e pendências.
```
