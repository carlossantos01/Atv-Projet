import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import {
  AuthResponseSchema,
  MeResponseSchema,
  type AuthResponse,
  type LoginInput,
  type MeResponse,
  type RegisterInput,
  type Usuario,
} from '../../../packages/contracts/src';
import { env } from '../../config/env';
import { AppError } from '../../errors/app-error';
import * as usuariosRepository from './usuarios.repository';
import type { UsuarioRecord } from './usuarios.repository';

const PASSWORD_SALT_ROUNDS = 10;

const toUsuario = (usuario: UsuarioRecord): Usuario => {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    perfil: usuario.perfil,
    criadoEm: usuario.criadoEm,
    atualizadoEm: usuario.atualizadoEm,
  };
};

const createToken = (usuario: Usuario): string => {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  };

  return jwt.sign(
    {
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil,
    },
    env.JWT_SECRET,
    {
      ...options,
      subject: String(usuario.id),
    }
  );
};

const toAuthResponse = (usuario: UsuarioRecord): AuthResponse => {
  const safeUser = toUsuario(usuario);

  return AuthResponseSchema.parse({
    token: createToken(safeUser),
    usuario: safeUser,
  });
};

export const register = async (input: RegisterInput): Promise<AuthResponse> => {
  const existing = await usuariosRepository.findByEmail(input.email);

  if (existing) {
    throw new AppError(409, 'Já existe um usuário cadastrado com este e-mail.');
  }

  const senhaHash = await bcrypt.hash(input.senha, PASSWORD_SALT_ROUNDS);
  const usuario = await usuariosRepository.create({
    nome: input.nome,
    email: input.email,
    senhaHash,
    perfil: 'cliente',
  });

  return toAuthResponse(usuario);
};

export const login = async (input: LoginInput): Promise<AuthResponse> => {
  const usuario = await usuariosRepository.findByEmail(input.email);

  if (!usuario) {
    throw new AppError(401, 'E-mail ou senha inválidos.');
  }

  const senhaValida = await bcrypt.compare(input.senha, usuario.senhaHash);
  if (!senhaValida) {
    throw new AppError(401, 'E-mail ou senha inválidos.');
  }

  return toAuthResponse(usuario);
};

export const me = async (usuarioId: number): Promise<MeResponse> => {
  const usuario = await usuariosRepository.findById(usuarioId);

  if (!usuario) {
    throw new AppError(404, 'Usuário autenticado não foi encontrado.');
  }

  return MeResponseSchema.parse(toUsuario(usuario));
};
