import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import type { Cliente, CreateClienteInput, UpdateClienteInput } from '../../../packages/contracts/src';
import { execute, queryRows, type SqlParam } from '../../database/client';
import { toIsoString } from '../../database/mappers';

type ClienteRow = RowDataPacket & {
  id: number;
  nome: string;
  email: string | null;
  telefone: string;
  criado_em: Date;
  atualizado_em: Date;
};

const toCliente = (row: ClienteRow): Cliente => {
  return {
    id: row.id,
    nome: row.nome,
    email: row.email,
    telefone: row.telefone,
    criadoEm: toIsoString(row.criado_em),
    atualizadoEm: toIsoString(row.atualizado_em),
  };
};

const baseSelect = 'SELECT id, nome, email, telefone, criado_em, atualizado_em FROM clientes';

export const findAll = async (): Promise<Cliente[]> => {
  const rows = await queryRows<ClienteRow[]>(`${baseSelect} ORDER BY nome ASC`);
  return rows.map(toCliente);
};

export const findById = async (id: number): Promise<Cliente | null> => {
  const rows = await queryRows<ClienteRow[]>(`${baseSelect} WHERE id = ? LIMIT 1`, [id]);
  return rows[0] ? toCliente(rows[0]) : null;
};

export const findByEmail = async (email: string): Promise<Cliente | null> => {
  const rows = await queryRows<ClienteRow[]>(`${baseSelect} WHERE email = ? LIMIT 1`, [email]);
  return rows[0] ? toCliente(rows[0]) : null;
};

export const create = async (input: CreateClienteInput): Promise<Cliente> => {
  const result = await execute(
    `INSERT INTO clientes (nome, email, telefone)
     VALUES (?, ?, ?)`,
    [input.nome, input.email ?? null, input.telefone]
  );
  const cliente = await findById((result as ResultSetHeader).insertId);
  if (!cliente) {
    throw new Error('Cliente criado não foi encontrado.');
  }
  return cliente;
};

export const update = async (id: number, input: UpdateClienteInput): Promise<Cliente> => {
  const fields: string[] = [];
  const values: SqlParam[] = [];

  if (input.nome !== undefined) {
    fields.push('nome = ?');
    values.push(input.nome);
  }

  if (input.email !== undefined) {
    fields.push('email = ?');
    values.push(input.email);
  }

  if (input.telefone !== undefined) {
    fields.push('telefone = ?');
    values.push(input.telefone);
  }

  if (fields.length > 0) {
    await execute(`UPDATE clientes SET ${fields.join(', ')} WHERE id = ?`, [...values, id]);
  }

  const cliente = await findById(id);
  if (!cliente) {
    throw new Error('Cliente atualizado não foi encontrado.');
  }
  return cliente;
};

export const remove = async (id: number): Promise<void> => {
  await execute('DELETE FROM clientes WHERE id = ?', [id]);
};
