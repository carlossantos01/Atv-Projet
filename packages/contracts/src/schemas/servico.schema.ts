import { z } from 'zod';

const BooleanQuerySchema = z.preprocess((value) => {
  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  return value;
}, z.boolean());

export const ServicoSchema = z.object({
  id: z.number().int().positive(),
  nome: z.string().min(1),
  descricao: z.string().nullable().optional(),
  duracaoMin: z.number().int().positive(),
  preco: z.number().nonnegative(),
  ativo: z.boolean().optional(),
  criadoEm: z.string(),
  atualizadoEm: z.string(),
});

export const CreateServicoInputSchema = z.object({
  nome: z.string().min(1),
  descricao: z.string().nullable().optional(),
  duracaoMin: z.coerce.number().int().positive(),
  preco: z.coerce.number().nonnegative(),
  ativo: z.boolean().optional(),
});

export const UpdateServicoInputSchema = CreateServicoInputSchema.partial();

export const ListServicosQuerySchema = z.object({
  ativo: BooleanQuerySchema.optional(),
});

export const ServicoListResponseSchema = z.array(ServicoSchema);
export const ServicoResponseSchema = ServicoSchema;
