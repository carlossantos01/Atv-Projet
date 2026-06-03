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

export const ProfissionalSchema = z.object({
  id: z.number().int().positive(),
  nome: z.string().min(1),
  especialidade: z.string().nullable().optional(),
  telefone: z.string().nullable().optional(),
  ativo: z.boolean(),
  criadoEm: z.string(),
  atualizadoEm: z.string(),
});

export const CreateProfissionalInputSchema = z.object({
  nome: z.string().min(1),
  especialidade: z.string().nullable().optional(),
  telefone: z.string().nullable().optional(),
  ativo: z.boolean().optional(),
});

export const UpdateProfissionalInputSchema = CreateProfissionalInputSchema.partial();

export const ListProfissionaisQuerySchema = z.object({
  ativo: BooleanQuerySchema.optional(),
});

export const ProfissionalListResponseSchema = z.array(ProfissionalSchema);
export const ProfissionalResponseSchema = ProfissionalSchema;
