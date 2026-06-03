import { z } from 'zod';

export const ClienteSchema = z.object({
  id: z.number().int().positive(),
  nome: z.string().min(1),
  email: z.string().email().nullable().optional(),
  telefone: z.string().min(1),
  criadoEm: z.string(),
  atualizadoEm: z.string(),
});

export const CreateClienteInputSchema = z.object({
  nome: z.string().min(1),
  email: z.string().email().nullable().optional(),
  telefone: z.string().min(1),
});

export const UpdateClienteInputSchema = CreateClienteInputSchema.partial();

export const ClienteListResponseSchema = z.array(ClienteSchema);
export const ClienteResponseSchema = ClienteSchema;
