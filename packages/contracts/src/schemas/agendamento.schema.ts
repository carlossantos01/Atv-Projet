import { z } from 'zod';

export const StatusAgendamentoSchema = z.enum(['agendado', 'cancelado', 'concluido']);

export const AgendamentoSchema = z.object({
  id: z.number().int().positive(),
  clienteId: z.number().int().positive(),
  profissionalId: z.number().int().positive(),
  servicoId: z.number().int().positive(),
  dataHoraInicio: z.string(),
  dataHoraFim: z.string(),
  status: StatusAgendamentoSchema,
  observacao: z.string().nullable().optional(),
  criadoEm: z.string(),
  atualizadoEm: z.string(),
});

export const AgendamentoListItemSchema = z.object({
  id: z.number().int().positive(),
  clienteId: z.number().int().positive(),
  profissionalId: z.number().int().positive(),
  servicoId: z.number().int().positive(),
  cliente: z.string(),
  servico: z.string(),
  profissional: z.string(),
  dataHoraInicio: z.string(),
  dataHoraFim: z.string(),
  status: StatusAgendamentoSchema,
  observacao: z.string().nullable().optional(),
  criadoEm: z.string(),
  atualizadoEm: z.string(),
});

export const AgendamentosListResponseSchema = z.array(AgendamentoListItemSchema);

export const CreateAgendamentoInputSchema = z.object({
  clienteId: z.coerce.number().int().positive(),
  profissionalId: z.coerce.number().int().positive(),
  servicoId: z.coerce.number().int().positive(),
  dataHoraInicio: z.string().datetime({ offset: true }),
  observacao: z.string().nullable().optional(),
});

export const UpdateAgendamentoInputSchema = CreateAgendamentoInputSchema.partial();

export const ReagendarAgendamentoInputSchema = z.object({
  dataHoraInicio: z.string().datetime({ offset: true }),
  profissionalId: z.coerce.number().int().positive().optional(),
  servicoId: z.coerce.number().int().positive().optional(),
});

export const AgendamentoParamsSchema = z.object({
  id: z.string().regex(/^\d+$/, 'id deve ser numérico'),
});

export const DeleteAgendamentoParamsSchema = AgendamentoParamsSchema;

export const ListAgendamentosQuerySchema = z.object({
  data: z.string().optional(),
  status: StatusAgendamentoSchema.optional(),
  profissionalId: z.coerce.number().int().positive().optional(),
  clienteId: z.coerce.number().int().positive().optional(),
});

export const AgendamentoResponseSchema = AgendamentoListItemSchema;

export const CreateAgendamentoResponseSchema = z.object({
  id: z.number().int().positive(),
  mensagem: z.string(),
});
