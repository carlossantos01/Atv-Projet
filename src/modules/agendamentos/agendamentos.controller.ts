import type { Request, Response } from 'express';
import { MensagemResponseSchema } from '../../../packages/contracts/src';
import type {
  AgendamentoListItem,
  AgendamentosListResponse,
  ApiErrorResponse,
  CreateAgendamentoInput,
  CreateAgendamentoResponse,
  IdParams,
  ListAgendamentosQuery,
  MensagemResponse,
  ReagendarAgendamentoInput,
} from '../../../packages/contracts/src';
import * as agendamentosService from './agendamentos.service';

type ListarRequest = Request<Record<string, never>, AgendamentosListResponse | ApiErrorResponse, Record<string, never>, ListAgendamentosQuery>;
type IdRequest<TResponse, TBody = Record<string, never>> = Request<IdParams, TResponse | ApiErrorResponse, TBody>;

export const listar = async (
  req: ListarRequest,
  res: Response<AgendamentosListResponse | ApiErrorResponse>
): Promise<void> => {
  const response = await agendamentosService.listar(req.query);
  res.json(response);
};

export const buscarPorId = async (
  req: IdRequest<AgendamentoListItem>,
  res: Response<AgendamentoListItem | ApiErrorResponse>
): Promise<void> => {
  const response = await agendamentosService.buscarPorId(Number(req.params.id));
  res.json(response);
};

export const criar = async (
  req: Request<Record<string, never>, CreateAgendamentoResponse | ApiErrorResponse, CreateAgendamentoInput>,
  res: Response<CreateAgendamentoResponse | ApiErrorResponse>
): Promise<void> => {
  const response = await agendamentosService.criar(req.body);
  res.status(201).json(response);
};

export const cancelar = async (
  req: IdRequest<MensagemResponse>,
  res: Response<MensagemResponse | ApiErrorResponse>
): Promise<void> => {
  await agendamentosService.cancelar(Number(req.params.id));
  res.json(MensagemResponseSchema.parse({ mensagem: 'Agendamento cancelado com sucesso.' }));
};

export const reagendar = async (
  req: IdRequest<AgendamentoListItem, ReagendarAgendamentoInput>,
  res: Response<AgendamentoListItem | ApiErrorResponse>
): Promise<void> => {
  const response = await agendamentosService.reagendar(Number(req.params.id), req.body);
  res.json(response);
};

export const deletar = async (
  req: IdRequest<MensagemResponse>,
  res: Response<MensagemResponse | ApiErrorResponse>
): Promise<void> => {
  await agendamentosService.cancelar(Number(req.params.id));
  res.json(MensagemResponseSchema.parse({ mensagem: 'DELETE mantido por compatibilidade: agendamento cancelado.' }));
};
