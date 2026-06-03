import { z } from 'zod';

export const IdParamsSchema = z.object({
  id: z.string().regex(/^\d+$/, 'id deve ser numérico'),
});

export const ApiErrorSchema = z.object({
  erro: z.string(),
  detalhes: z.array(z.string()).optional(),
});

export const ApiSuccessSchema = z.object({
  mensagem: z.string(),
}).passthrough();

export const ApiResponseSchema = z.union([ApiSuccessSchema, ApiErrorSchema]);

export const MensagemResponseSchema = ApiSuccessSchema;

export const HealthResponseSchema = z.object({
  status: z.literal('ok'),
  timestamp: z.string(),
});
