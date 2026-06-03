import {
  ServicoListResponseSchema,
  ServicoResponseSchema,
  type CreateServicoInput,
  type ListServicosQuery,
  type Servico,
  type ServicoListResponse,
  type UpdateServicoInput,
} from '../../../packages/contracts/src';
import { AppError } from '../../errors/app-error';
import * as servicosRepository from './servicos.repository';

export const listar = async (query: ListServicosQuery): Promise<ServicoListResponse> => {
  const servicos = await servicosRepository.findAll(query);

  return ServicoListResponseSchema.parse(servicos);
};

export const buscarPorId = async (id: number): Promise<Servico> => {
  const servico = await servicosRepository.findById(id);

  if (!servico) {
    throw new AppError(404, 'Serviço não encontrado.');
  }

  return ServicoResponseSchema.parse(servico);
};

export const criar = async (input: CreateServicoInput): Promise<Servico> => {
  const servico = await servicosRepository.create(input);

  return ServicoResponseSchema.parse(servico);
};

export const atualizar = async (id: number, input: UpdateServicoInput): Promise<Servico> => {
  await buscarPorId(id);

  const servico = await servicosRepository.update(id, input);

  return ServicoResponseSchema.parse(servico);
};

export const desativar = async (id: number): Promise<Servico> => {
  await buscarPorId(id);

  const servico = await servicosRepository.deactivate(id);

  return ServicoResponseSchema.parse(servico);
};
