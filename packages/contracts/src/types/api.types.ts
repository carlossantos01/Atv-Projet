import { z } from 'zod';
import {
  AgendamentoListItemSchema,
  AgendamentoSchema,
  AgendamentoParamsSchema,
  AgendamentoResponseSchema,
  AgendamentosListResponseSchema,
  CreateAgendamentoInputSchema,
  CreateAgendamentoResponseSchema,
  DeleteAgendamentoParamsSchema,
  ListAgendamentosQuerySchema,
  ReagendarAgendamentoInputSchema,
  StatusAgendamentoSchema,
  UpdateAgendamentoInputSchema,
} from '../schemas/agendamento.schema';
import {
  ApiErrorSchema,
  ApiResponseSchema,
  ApiSuccessSchema,
  HealthResponseSchema,
  IdParamsSchema,
  MensagemResponseSchema,
} from '../schemas/api.schema';
import { AuthResponseSchema, AuthUserSchema, LoginInputSchema, MeResponseSchema, RegisterInputSchema } from '../schemas/auth.schema';
import {
  ClienteListResponseSchema,
  ClienteResponseSchema,
  ClienteSchema,
  CreateClienteInputSchema,
  UpdateClienteInputSchema,
} from '../schemas/cliente.schema';
import {
  CreateProfissionalInputSchema,
  ListProfissionaisQuerySchema,
  ProfissionalListResponseSchema,
  ProfissionalResponseSchema,
  ProfissionalSchema,
  UpdateProfissionalInputSchema,
} from '../schemas/profissional.schema';
import {
  CreateServicoInputSchema,
  ListServicosQuerySchema,
  ServicoListResponseSchema,
  ServicoResponseSchema,
  ServicoSchema,
  UpdateServicoInputSchema,
} from '../schemas/servico.schema';
import { PerfilUsuarioSchema, UsuarioSchema } from '../schemas/usuario.schema';

export type PerfilUsuario = z.infer<typeof PerfilUsuarioSchema>;
export type StatusAgendamento = z.infer<typeof StatusAgendamentoSchema>;

export type Usuario = z.infer<typeof UsuarioSchema>;
export type RegisterInput = z.infer<typeof RegisterInputSchema>;
export type LoginInput = z.infer<typeof LoginInputSchema>;
export type AuthUser = z.infer<typeof AuthUserSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type MeResponse = z.infer<typeof MeResponseSchema>;

export type Cliente = z.infer<typeof ClienteSchema>;
export type CreateClienteInput = z.infer<typeof CreateClienteInputSchema>;
export type UpdateClienteInput = z.infer<typeof UpdateClienteInputSchema>;
export type ClienteListResponse = z.infer<typeof ClienteListResponseSchema>;
export type ClienteResponse = z.infer<typeof ClienteResponseSchema>;

export type Profissional = z.infer<typeof ProfissionalSchema>;
export type CreateProfissionalInput = z.infer<typeof CreateProfissionalInputSchema>;
export type UpdateProfissionalInput = z.infer<typeof UpdateProfissionalInputSchema>;
export type ListProfissionaisQuery = z.infer<typeof ListProfissionaisQuerySchema>;
export type ProfissionalListResponse = z.infer<typeof ProfissionalListResponseSchema>;
export type ProfissionalResponse = z.infer<typeof ProfissionalResponseSchema>;

export type Servico = z.infer<typeof ServicoSchema>;
export type CreateServicoInput = z.infer<typeof CreateServicoInputSchema>;
export type UpdateServicoInput = z.infer<typeof UpdateServicoInputSchema>;
export type ListServicosQuery = z.infer<typeof ListServicosQuerySchema>;
export type ServicoListResponse = z.infer<typeof ServicoListResponseSchema>;
export type ServicoResponse = z.infer<typeof ServicoResponseSchema>;

export type AgendamentoListItem = z.infer<typeof AgendamentoListItemSchema>;
export type Agendamento = z.infer<typeof AgendamentoSchema>;
export type AgendamentoResponse = z.infer<typeof AgendamentoResponseSchema>;
export type AgendamentosListResponse = z.infer<typeof AgendamentosListResponseSchema>;
export type CreateAgendamentoInput = z.infer<typeof CreateAgendamentoInputSchema>;
export type UpdateAgendamentoInput = z.infer<typeof UpdateAgendamentoInputSchema>;
export type ReagendarAgendamentoInput = z.infer<typeof ReagendarAgendamentoInputSchema>;
export type AgendamentoParams = z.infer<typeof AgendamentoParamsSchema>;
export type DeleteAgendamentoParams = z.infer<typeof DeleteAgendamentoParamsSchema>;
export type ListAgendamentosQuery = z.infer<typeof ListAgendamentosQuerySchema>;
export type CreateAgendamentoResponse = z.infer<typeof CreateAgendamentoResponseSchema>;

export type IdParams = z.infer<typeof IdParamsSchema>;
export type ApiErrorResponse = z.infer<typeof ApiErrorSchema>;
export type ApiSuccessResponse = z.infer<typeof ApiSuccessSchema>;
export type ApiResponse = z.infer<typeof ApiResponseSchema>;
export type MensagemResponse = z.infer<typeof MensagemResponseSchema>;
export type HealthResponse = z.infer<typeof HealthResponseSchema>;
