import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import type {
  CreateServicoInput,
  ListServicosQuery,
  Servico,
  UpdateServicoInput,
} from '../../../packages/contracts/src';
import { execute, queryRows, type SqlParam } from '../../database/client';
import { toBoolean, toIsoString } from '../../database/mappers';

type ServicoRow = RowDataPacket & {
  id: number;
  nome: string;
  descricao: string | null;
  duracao_min: number;
  preco: number | string;
  ativo: number | boolean;
  criado_em: Date;
  atualizado_em: Date;
};

const toServico = (row: ServicoRow): Servico => {
  return {
    id: row.id,
    nome: row.nome,
    descricao: row.descricao,
    duracaoMin: row.duracao_min,
    preco: Number(row.preco),
    ativo: toBoolean(row.ativo),
    criadoEm: toIsoString(row.criado_em),
    atualizadoEm: toIsoString(row.atualizado_em),
  };
};

const baseSelect = 'SELECT id, nome, descricao, duracao_min, preco, ativo, criado_em, atualizado_em FROM servicos';

export const findAll = async (query: ListServicosQuery): Promise<Servico[]> => {
  const ativo = query.ativo ?? true;
  const rows = await queryRows<ServicoRow[]>(`${baseSelect} WHERE ativo = ? ORDER BY nome ASC`, [ativo]);
  return rows.map(toServico);
};

export const findById = async (id: number): Promise<Servico | null> => {
  const rows = await queryRows<ServicoRow[]>(`${baseSelect} WHERE id = ? LIMIT 1`, [id]);
  return rows[0] ? toServico(rows[0]) : null;
};

export const create = async (input: CreateServicoInput): Promise<Servico> => {
  const result = await execute(
    `INSERT INTO servicos (nome, descricao, duracao_min, preco, ativo)
     VALUES (?, ?, ?, ?, ?)`,
    [input.nome, input.descricao ?? null, input.duracaoMin, input.preco, input.ativo ?? true]
  );
  const servico = await findById((result as ResultSetHeader).insertId);
  if (!servico) {
    throw new Error('Serviço criado não foi encontrado.');
  }
  return servico;
};

export const update = async (id: number, input: UpdateServicoInput): Promise<Servico> => {
  const fields: string[] = [];
  const values: SqlParam[] = [];

  if (input.nome !== undefined) {
    fields.push('nome = ?');
    values.push(input.nome);
  }

  if (input.descricao !== undefined) {
    fields.push('descricao = ?');
    values.push(input.descricao);
  }

  if (input.duracaoMin !== undefined) {
    fields.push('duracao_min = ?');
    values.push(input.duracaoMin);
  }

  if (input.preco !== undefined) {
    fields.push('preco = ?');
    values.push(input.preco);
  }

  if (input.ativo !== undefined) {
    fields.push('ativo = ?');
    values.push(input.ativo);
  }

  if (fields.length > 0) {
    await execute(`UPDATE servicos SET ${fields.join(', ')} WHERE id = ?`, [...values, id]);
  }

  const servico = await findById(id);
  if (!servico) {
    throw new Error('Serviço atualizado não foi encontrado.');
  }
  return servico;
};

export const deactivate = async (id: number): Promise<Servico> => {
  await execute('UPDATE servicos SET ativo = false WHERE id = ?', [id]);
  const servico = await findById(id);
  if (!servico) {
    throw new Error('Serviço desativado não foi encontrado.');
  }
  return servico;
};
