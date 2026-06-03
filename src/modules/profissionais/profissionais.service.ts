import {
  ProfissionalListResponseSchema,
  ProfissionalResponseSchema,
  type CreateProfissionalInput,
  type ListProfissionaisQuery,
  type Profissional,
  type ProfissionalListResponse,
  type UpdateProfissionalInput,
} from '../../../packages/contracts/src';
import { AppError } from '../../errors/app-error';
import * as profissionaisRepository from './profissionais.repository';

export const listar = async (query: ListProfissionaisQuery): Promise<ProfissionalListResponse> => {
  const profissionais = await profissionaisRepository.findAll(query);

  return ProfissionalListResponseSchema.parse(profissionais);
};

export const buscarPorId = async (id: number): Promise<Profissional> => {
  const profissional = await profissionaisRepository.findById(id);

  if (!profissional) {
    throw new AppError(404, 'Profissional não encontrado.');
  }

  return ProfissionalResponseSchema.parse(profissional);
};

export const criar = async (input: CreateProfissionalInput): Promise<Profissional> => {
  const profissional = await profissionaisRepository.create(input);

  return ProfissionalResponseSchema.parse(profissional);
};

export const atualizar = async (id: number, input: UpdateProfissionalInput): Promise<Profissional> => {
  await buscarPorId(id);

  const profissional = await profissionaisRepository.update(id, input);

  return ProfissionalResponseSchema.parse(profissional);
};

export const desativar = async (id: number): Promise<Profissional> => {
  await buscarPorId(id);

  const profissional = await profissionaisRepository.deactivate(id);

  return ProfissionalResponseSchema.parse(profissional);
};
