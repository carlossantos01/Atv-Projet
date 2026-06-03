import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import type {
  CreateProfissionalInput,
  ListProfissionaisQuery,
  Profissional,
  UpdateProfissionalInput,
} from '../../../packages/contracts/src';
import { execute, queryRows, type SqlParam } from '../../database/client';
import { toBoolean, toIsoString } from '../../database/mappers';

type ProfissionalRow = RowDataPacket & {
  id: number;
  nome: string;
  especialidade: string | null;
  telefone: string | null;
  ativo: number | boolean;
  criado_em: Date;
  atualizado_em: Date;
};

const toProfissional = (row: ProfissionalRow): Profissional => {
  return {
    id: row.id,
    nome: row.nome,
    especialidade: row.especialidade,
    telefone: row.telefone,
    ativo: toBoolean(row.ativo),
    criadoEm: toIsoString(row.criado_em),
    atualizadoEm: toIsoString(row.atualizado_em),
  };
};

const baseSelect = 'SELECT id, nome, especialidade, telefone, ativo, criado_em, atualizado_em FROM profissionais';

export const findAll = async (query: ListProfissionaisQuery): Promise<Profissional[]> => {
  const where: string[] = [];
  const params: SqlParam[] = [];

  if (query.ativo !== undefined) {
    where.push('ativo = ?');
    params.push(query.ativo);
  }

  const sql = `${baseSelect}${where.length ? ` WHERE ${where.join(' AND ')}` : ''} ORDER BY nome ASC`;
  const rows = await queryRows<ProfissionalRow[]>(sql, params);
  return rows.map(toProfissional);
};

export const findById = async (id: number): Promise<Profissional | null> => {
  const rows = await queryRows<ProfissionalRow[]>(`${baseSelect} WHERE id = ? LIMIT 1`, [id]);
  return rows[0] ? toProfissional(rows[0]) : null;
};

export const create = async (input: CreateProfissionalInput): Promise<Profissional> => {
  const result = await execute(
    `INSERT INTO profissionais (nome, especialidade, telefone, ativo)
     VALUES (?, ?, ?, ?)`,
    [input.nome, input.especialidade ?? null, input.telefone ?? null, input.ativo ?? true]
  );
  const profissional = await findById((result as ResultSetHeader).insertId);
  if (!profissional) {
    throw new Error('Profissional criado não foi encontrado.');
  }
  return profissional;
};

export const update = async (id: number, input: UpdateProfissionalInput): Promise<Profissional> => {
  const fields: string[] = [];
  const values: SqlParam[] = [];

  if (input.nome !== undefined) {
    fields.push('nome = ?');
    values.push(input.nome);
  }

  if (input.especialidade !== undefined) {
    fields.push('especialidade = ?');
    values.push(input.especialidade);
  }

  if (input.telefone !== undefined) {
    fields.push('telefone = ?');
    values.push(input.telefone);
  }

  if (input.ativo !== undefined) {
    fields.push('ativo = ?');
    values.push(input.ativo);
  }

  if (fields.length > 0) {
    await execute(`UPDATE profissionais SET ${fields.join(', ')} WHERE id = ?`, [...values, id]);
  }

  const profissional = await findById(id);
  if (!profissional) {
    throw new Error('Profissional atualizado não foi encontrado.');
  }
  return profissional;
};

export const deactivate = async (id: number): Promise<Profissional> => {
  await execute('UPDATE profissionais SET ativo = false WHERE id = ?', [id]);
  const profissional = await findById(id);
  if (!profissional) {
    throw new Error('Profissional desativado não foi encontrado.');
  }
  return profissional;
};
