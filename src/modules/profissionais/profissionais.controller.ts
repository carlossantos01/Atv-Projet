import type { Request, Response } from 'express';
import type {
  ApiErrorResponse,
  CreateProfissionalInput,
  IdParams,
  ListProfissionaisQuery,
  Profissional,
  ProfissionalListResponse,
  UpdateProfissionalInput,
} from '../../../packages/contracts/src';
import * as profissionaisService from './profissionais.service';

type ListarRequest = Request<Record<string, never>, ProfissionalListResponse | ApiErrorResponse, Record<string, never>, ListProfissionaisQuery>;
type IdRequest<TBody = Record<string, never>> = Request<IdParams, Profissional | ApiErrorResponse, TBody>;

export const listar = async (
  req: ListarRequest,
  res: Response<ProfissionalListResponse | ApiErrorResponse>
): Promise<void> => {
  const response = await profissionaisService.listar(req.query);
  res.json(response);
};

export const buscarPorId = async (req: IdRequest, res: Response<Profissional | ApiErrorResponse>): Promise<void> => {
  const response = await profissionaisService.buscarPorId(Number(req.params.id));
  res.json(response);
};

export const criar = async (
  req: Request<Record<string, never>, Profissional | ApiErrorResponse, CreateProfissionalInput>,
  res: Response<Profissional | ApiErrorResponse>
): Promise<void> => {
  const response = await profissionaisService.criar(req.body);
  res.status(201).json(response);
};

export const atualizar = async (
  req: IdRequest<UpdateProfissionalInput>,
  res: Response<Profissional | ApiErrorResponse>
): Promise<void> => {
  const response = await profissionaisService.atualizar(Number(req.params.id), req.body);
  res.json(response);
};

export const desativar = async (req: IdRequest, res: Response<Profissional | ApiErrorResponse>): Promise<void> => {
  const response = await profissionaisService.desativar(Number(req.params.id));
  res.json(response);
};
