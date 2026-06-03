import {
  ClienteListResponseSchema,
  ClienteResponseSchema,
  type Cliente,
  type ClienteListResponse,
  type CreateClienteInput,
  type UpdateClienteInput,
} from '../../../packages/contracts/src';
import { AppError } from '../../errors/app-error';
import * as clientesRepository from './clientes.repository';

const assertEmailDisponivel = async (email: string | null | undefined, ignoreId?: number): Promise<void> => {
  if (!email) {
    return;
  }

  const existente = await clientesRepository.findByEmail(email);

  if (existente && existente.id !== ignoreId) {
    throw new AppError(409, 'Já existe um cliente cadastrado com este e-mail.');
  }
};

export const listar = async (): Promise<ClienteListResponse> => {
  const clientes = await clientesRepository.findAll();

  return ClienteListResponseSchema.parse(clientes);
};

export const buscarPorId = async (id: number): Promise<Cliente> => {
  const cliente = await clientesRepository.findById(id);

  if (!cliente) {
    throw new AppError(404, 'Cliente não encontrado.');
  }

  return ClienteResponseSchema.parse(cliente);
};

export const criar = async (input: CreateClienteInput): Promise<Cliente> => {
  await assertEmailDisponivel(input.email);

  const cliente = await clientesRepository.create(input);

  return ClienteResponseSchema.parse(cliente);
};

export const atualizar = async (id: number, input: UpdateClienteInput): Promise<Cliente> => {
  await buscarPorId(id);
  await assertEmailDisponivel(input.email, id);

  const cliente = await clientesRepository.update(id, input);

  return ClienteResponseSchema.parse(cliente);
};

export const remover = async (id: number): Promise<void> => {
  await buscarPorId(id);

  try {
    await clientesRepository.remove(id);
  } catch {
    throw new AppError(409, 'Cliente possui agendamentos e não pode ser removido.');
  }
};
