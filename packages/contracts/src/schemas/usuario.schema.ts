import { z } from 'zod';

export const PerfilUsuarioSchema = z.enum(['admin', 'profissional', 'cliente']);

export const UsuarioSchema = z.object({
  id: z.number().int().positive(),
  nome: z.string().min(1),
  email: z.string().email(),
  perfil: PerfilUsuarioSchema,
  criadoEm: z.string(),
  atualizadoEm: z.string(),
});
