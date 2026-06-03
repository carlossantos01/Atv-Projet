import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import type { PerfilUsuario, Usuario } from '../../../packages/contracts/src';
import { execute, queryRows } from '../../database/client';
import { toIsoString } from '../../database/mappers';

type UsuarioRow = RowDataPacket & {
  id: number;
  nome: string;
  email: string;
  senha_hash: string;
  perfil: PerfilUsuario;
  criado_em: Date;
  atualizado_em: Date;
};

export type UsuarioRecord = Usuario & {
  senhaHash: string;
};

const toUsuarioRecord = (row: UsuarioRow): UsuarioRecord => {
  return {
    id: row.id,
    nome: row.nome,
    email: row.email,
    senhaHash: row.senha_hash,
    perfil: row.perfil,
    criadoEm: toIsoString(row.criado_em),
    atualizadoEm: toIsoString(row.atualizado_em),
  };
};

export const findByEmail = async (email: string): Promise<UsuarioRecord | null> => {
  const rows = await queryRows<UsuarioRow[]>(
    `SELECT id, nome, email, senha_hash, perfil, criado_em, atualizado_em
     FROM usuarios
     WHERE email = ?
     LIMIT 1`,
    [email]
  );

  return rows[0] ? toUsuarioRecord(rows[0]) : null;
};

export const findById = async (id: number): Promise<UsuarioRecord | null> => {
  const rows = await queryRows<UsuarioRow[]>(
    `SELECT id, nome, email, senha_hash, perfil, criado_em, atualizado_em
     FROM usuarios
     WHERE id = ?
     LIMIT 1`,
    [id]
  );

  return rows[0] ? toUsuarioRecord(rows[0]) : null;
};

export const create = async (input: {
  nome: string;
  email: string;
  senhaHash: string;
  perfil: PerfilUsuario;
}): Promise<UsuarioRecord> => {
  const result = await execute(
    `INSERT INTO usuarios (nome, email, senha_hash, perfil)
     VALUES (?, ?, ?, ?)`,
    [input.nome, input.email, input.senhaHash, input.perfil]
  );

  const usuario = await findById((result as ResultSetHeader).insertId);
  if (!usuario) {
    throw new Error('Usuário criado não foi encontrado.');
  }

  return usuario;
};
