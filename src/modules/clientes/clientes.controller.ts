import type { Request, Response } from 'express';
import { MensagemResponseSchema } from '../../../packages/contracts/src';
import type {
  ApiErrorResponse,
  Cliente,
  ClienteListResponse,
  CreateClienteInput,
  IdParams,
  MensagemResponse,
  UpdateClienteInput,
} from '../../../packages/contracts/src';
import * as clientesService from './clientes.service';

type ListarRequest = Request<Record<string, never>, ClienteListResponse | ApiErrorResponse>;
type IdRequest<TResponse, TBody = Record<string, never>> = Request<IdParams, TResponse | ApiErrorResponse, TBody>;

export const listar = async (_req: ListarRequest, res: Response<ClienteListResponse | ApiErrorResponse>): Promise<void> => {
  const response = await clientesService.listar();
  res.json(response);
};

export const buscarPorId = async (req: IdRequest<Cliente>, res: Response<Cliente | ApiErrorResponse>): Promise<void> => {
  const response = await clientesService.buscarPorId(Number(req.params.id));
  res.json(response);
};

export const criar = async (
  req: Request<Record<string, never>, Cliente | ApiErrorResponse, CreateClienteInput>,
  res: Response<Cliente | ApiErrorResponse>
): Promise<void> => {
  const response = await clientesService.criar(req.body);
  res.status(201).json(response);
};

export const atualizar = async (
  req: IdRequest<Cliente, UpdateClienteInput>,
  res: Response<Cliente | ApiErrorResponse>
): Promise<void> => {
  const response = await clientesService.atualizar(Number(req.params.id), req.body);
  res.json(response);
};

export const remover = async (
  req: IdRequest<MensagemResponse>,
  res: Response<MensagemResponse | ApiErrorResponse>
): Promise<void> => {
  await clientesService.remover(Number(req.params.id));
  res.json(MensagemResponseSchema.parse({ mensagem: 'Cliente removido com sucesso.' }));
};
