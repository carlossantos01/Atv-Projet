import { z } from 'zod';
import { UsuarioSchema } from './usuario.schema';

export const RegisterInputSchema = z.object({
  nome: z.string().min(1),
  email: z.string().email(),
  senha: z.string().min(6),
});

export const LoginInputSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(1),
});

export const AuthUserSchema = UsuarioSchema;

export const AuthResponseSchema = z.object({
  token: z.string().min(1),
  usuario: AuthUserSchema,
});

export const MeResponseSchema = AuthUserSchema;
