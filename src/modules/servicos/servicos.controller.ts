import type { Request, Response } from 'express';
import type {
  ApiErrorResponse,
  CreateServicoInput,
  IdParams,
  ListServicosQuery,
  Servico,
  ServicoListResponse,
  UpdateServicoInput,
} from '../../../packages/contracts/src';
import * as servicosService from './servicos.service';

type ListarRequest = Request<Record<string, never>, ServicoListResponse | ApiErrorResponse, Record<string, never>, ListServicosQuery>;
type IdRequest<TBody = Record<string, never>> = Request<IdParams, Servico | ApiErrorResponse, TBody>;

export const listar = async (
  req: ListarRequest,
  res: Response<ServicoListResponse | ApiErrorResponse>
): Promise<void> => {
  const response = await servicosService.listar(req.query);
  res.json(response);
};

export const buscarPorId = async (req: IdRequest, res: Response<Servico | ApiErrorResponse>): Promise<void> => {
  const response = await servicosService.buscarPorId(Number(req.params.id));
  res.json(response);
};

export const criar = async (
  req: Request<Record<string, never>, Servico | ApiErrorResponse, CreateServicoInput>,
  res: Response<Servico | ApiErrorResponse>
): Promise<void> => {
  const response = await servicosService.criar(req.body);
  res.status(201).json(response);
};

export const atualizar = async (
  req: IdRequest<UpdateServicoInput>,
  res: Response<Servico | ApiErrorResponse>
): Promise<void> => {
  const response = await servicosService.atualizar(Number(req.params.id), req.body);
  res.json(response);
};

export const desativar = async (req: IdRequest, res: Response<Servico | ApiErrorResponse>): Promise<void> => {
  const response = await servicosService.desativar(Number(req.params.id));
  res.json(response);
};
