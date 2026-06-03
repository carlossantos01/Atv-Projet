USE barbearia_vanguard;

INSERT INTO usuarios (nome, email, senha_hash, perfil) VALUES
('Administrador', 'admin@agendafacil.local', '$2b$10$pOZFP/fj/MzJeXQ6wwT1Ve4cgkAIPa5Oh0DMgxuRQQkWSXL2z9rJC', 'admin'),
('Joao Navalha', 'joao@agendafacil.local', '$2b$10$pOZFP/fj/MzJeXQ6wwT1Ve4cgkAIPa5Oh0DMgxuRQQkWSXL2z9rJC', 'profissional');

INSERT INTO clientes (nome, email, telefone) VALUES
('Bruno Almeida', 'bruno.almeida@example.com', '(71) 99999-1001'),
('Carlos Santana', 'carlos.santana@example.com', '(71) 99999-1002'),
('Diego Ribeiro', 'diego.ribeiro@example.com', '(71) 99999-1003');

INSERT INTO profissionais (nome, especialidade, telefone, ativo) VALUES
('Joao Navalha', 'Cortes classicos e degrade', '(71) 98888-2001', TRUE),
('Marcos Barba', 'Barba, acabamento e visagismo', '(71) 98888-2002', TRUE);

INSERT INTO servicos (nome, descricao, duracao_min, preco, ativo) VALUES
('Corte masculino', 'Corte com tesoura e maquina', 30, 50.00, TRUE),
('Barba', 'Aparar, desenhar e finalizar barba', 30, 40.00, TRUE),
('Corte + barba', 'Combo completo de corte e barba', 60, 85.00, TRUE),
('Sobrancelha', 'Design simples de sobrancelha', 15, 25.00, TRUE);

INSERT INTO agendamentos (cliente_id, profissional_id, servico_id, data_hora_inicio, data_hora_fim, status, observacao) VALUES
(1, 1, 1, '2026-06-03 09:00:00.000', '2026-06-03 09:30:00.000', 'agendado', 'Cliente prefere corte baixo.'),
(2, 2, 2, '2026-06-03 10:00:00.000', '2026-06-03 10:30:00.000', 'agendado', NULL),
(3, 1, 3, '2026-06-03 11:00:00.000', '2026-06-03 12:00:00.000', 'concluido', NULL),
(1, 2, 4, '2026-06-04 14:00:00.000', '2026-06-04 14:15:00.000', 'agendado', NULL);
