import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import type {
  AgendamentoListItem,
  ListAgendamentosQuery,
  StatusAgendamento,
} from '../../../packages/contracts/src';
import { execute, queryRows, type SqlParam } from '../../database/client';
import { toIsoString } from '../../database/mappers';

type AgendamentoRow = RowDataPacket & {
  id: number;
  cliente_id: number;
  profissional_id: number;
  servico_id: number;
  cliente: string;
  profissional: string;
  servico: string;
  data_hora_inicio: Date;
  data_hora_fim: Date;
  status: StatusAgendamento;
  observacao: string | null;
  criado_em: Date;
  atualizado_em: Date;
};

type AgendamentoEntityRow = RowDataPacket & {
  id: number;
  cliente_id: number;
  profissional_id: number;
  servico_id: number;
  data_hora_inicio: Date;
  data_hora_fim: Date;
  status: StatusAgendamento;
  observacao: string | null;
  criado_em: Date;
  atualizado_em: Date;
};

export type AgendamentoEntity = {
  id: number;
  clienteId: number;
  profissionalId: number;
  servicoId: number;
  dataHoraInicio: Date;
  dataHoraFim: Date;
  status: StatusAgendamento;
  observacao: string | null;
  criadoEm: string;
  atualizadoEm: string;
};

type ListFilters = ListAgendamentosQuery & {
  dataInicio?: Date;
  dataFim?: Date;
};

const toAgendamentoListItem = (row: AgendamentoRow): AgendamentoListItem => {
  return {
    id: row.id,
    clienteId: row.cliente_id,
    profissionalId: row.profissional_id,
    servicoId: row.servico_id,
    cliente: row.cliente,
    profissional: row.profissional,
    servico: row.servico,
    dataHoraInicio: toIsoString(row.data_hora_inicio),
    dataHoraFim: toIsoString(row.data_hora_fim),
    status: row.status,
    observacao: row.observacao,
    criadoEm: toIsoString(row.criado_em),
    atualizadoEm: toIsoString(row.atualizado_em),
  };
};

const toAgendamentoEntity = (row: AgendamentoEntityRow): AgendamentoEntity => {
  return {
    id: row.id,
    clienteId: row.cliente_id,
    profissionalId: row.profissional_id,
    servicoId: row.servico_id,
    dataHoraInicio: row.data_hora_inicio,
    dataHoraFim: row.data_hora_fim,
    status: row.status,
    observacao: row.observacao,
    criadoEm: toIsoString(row.criado_em),
    atualizadoEm: toIsoString(row.atualizado_em),
  };
};

const baseJoinSelect = `
  SELECT
    a.id,
    a.cliente_id,
    a.profissional_id,
    a.servico_id,
    c.nome AS cliente,
    p.nome AS profissional,
    s.nome AS servico,
    a.data_hora_inicio,
    a.data_hora_fim,
    a.status,
    a.observacao,
    a.criado_em,
    a.atualizado_em
  FROM agendamentos a
  INNER JOIN clientes c ON c.id = a.cliente_id
  INNER JOIN profissionais p ON p.id = a.profissional_id
  INNER JOIN servicos s ON s.id = a.servico_id
`;

const baseEntitySelect = `
  SELECT id, cliente_id, profissional_id, servico_id, data_hora_inicio, data_hora_fim, status, observacao, criado_em, atualizado_em
  FROM agendamentos
`;

export const findAll = async (filters: ListFilters): Promise<AgendamentoListItem[]> => {
  const where: string[] = [];
  const params: SqlParam[] = [];

  if (filters.status) {
    where.push('a.status = ?');
    params.push(filters.status);
  }

  if (filters.profissionalId) {
    where.push('a.profissional_id = ?');
    params.push(filters.profissionalId);
  }

  if (filters.clienteId) {
    where.push('a.cliente_id = ?');
    params.push(filters.clienteId);
  }

  if (filters.dataInicio && filters.dataFim) {
    where.push('a.data_hora_inicio >= ? AND a.data_hora_inicio < ?');
    params.push(filters.dataInicio, filters.dataFim);
  }

  const sql = `${baseJoinSelect}${where.length ? ` WHERE ${where.join(' AND ')}` : ''} ORDER BY a.data_hora_inicio ASC`;
  const rows = await queryRows<AgendamentoRow[]>(sql, params);
  return rows.map(toAgendamentoListItem);
};

export const findById = async (id: number): Promise<AgendamentoListItem | null> => {
  const rows = await queryRows<AgendamentoRow[]>(
    `${baseJoinSelect} WHERE a.id = ? LIMIT 1`,
    [id]
  );

  return rows[0] ? toAgendamentoListItem(rows[0]) : null;
};

export const findEntityById = async (id: number): Promise<AgendamentoEntity | null> => {
  const rows = await queryRows<AgendamentoEntityRow[]>(
    `${baseEntitySelect} WHERE id = ? LIMIT 1`,
    [id]
  );

  return rows[0] ? toAgendamentoEntity(rows[0]) : null;
};

export const findConflict = async (
  profissionalId: number,
  dataHoraInicio: Date,
  dataHoraFim: Date,
  ignoreAgendamentoId?: number
): Promise<AgendamentoEntity | null> => {
  const where = [
    'profissional_id = ?',
    "status != 'cancelado'",
    'data_hora_inicio < ?',
    'data_hora_fim > ?',
  ];
  const params: SqlParam[] = [profissionalId, dataHoraFim, dataHoraInicio];

  if (ignoreAgendamentoId) {
    where.push('id != ?');
    params.push(ignoreAgendamentoId);
  }

  const rows = await queryRows<AgendamentoEntityRow[]>(
    `${baseEntitySelect} WHERE ${where.join(' AND ')} LIMIT 1`,
    params
  );

  return rows[0] ? toAgendamentoEntity(rows[0]) : null;
};

export const create = async (input: {
  clienteId: number;
  profissionalId: number;
  servicoId: number;
  dataHoraInicio: Date;
  dataHoraFim: Date;
  observacao?: string | null;
}): Promise<number> => {
  const result = await execute(
    `INSERT INTO agendamentos (cliente_id, profissional_id, servico_id, data_hora_inicio, data_hora_fim, observacao)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      input.clienteId,
      input.profissionalId,
      input.servicoId,
      input.dataHoraInicio,
      input.dataHoraFim,
      input.observacao ?? null,
    ]
  );

  return (result as ResultSetHeader).insertId;
};

export const updateStatus = async (id: number, status: StatusAgendamento): Promise<void> => {
  await execute('UPDATE agendamentos SET status = ? WHERE id = ?', [status, id]);
};

export const reschedule = async (
  id: number,
  input: {
    profissionalId: number;
    servicoId: number;
    dataHoraInicio: Date;
    dataHoraFim: Date;
  }
): Promise<AgendamentoListItem | null> => {
  await execute(
    `UPDATE agendamentos
     SET profissional_id = ?, servico_id = ?, data_hora_inicio = ?, data_hora_fim = ?, status = 'agendado'
     WHERE id = ?`,
    [input.profissionalId, input.servicoId, input.dataHoraInicio, input.dataHoraFim, id]
  );

  return findById(id);
};
