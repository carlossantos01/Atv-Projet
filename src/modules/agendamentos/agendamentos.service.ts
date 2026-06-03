import {
  AgendamentoResponseSchema,
  AgendamentosListResponseSchema,
  CreateAgendamentoResponseSchema,
  type AgendamentoListItem,
  type AgendamentosListResponse,
  type CreateAgendamentoInput,
  type CreateAgendamentoResponse,
  type ListAgendamentosQuery,
  type ReagendarAgendamentoInput,
} from '../../../packages/contracts/src';
import { AppError } from '../../errors/app-error';
import { addMinutes, getDayRange, hasTimeOverlap, isPastDate, parseDate } from '../../utils/dates';
import * as clientesRepository from '../clientes/clientes.repository';
import * as profissionaisRepository from '../profissionais/profissionais.repository';
import * as servicosRepository from '../servicos/servicos.repository';
import * as agendamentosRepository from './agendamentos.repository';

const parseDateOrBadRequest = (value: string, fieldName: string): Date => {
  try {
    return parseDate(value);
  } catch {
    throw new AppError(400, `${fieldName} inválida.`);
  }
};

const validarEntidades = async (clienteId: number, profissionalId: number, servicoId: number) => {
  const [cliente, profissional, servico] = await Promise.all([
    clientesRepository.findById(clienteId),
    profissionaisRepository.findById(profissionalId),
    servicosRepository.findById(servicoId),
  ]);

  if (!cliente) {
    throw new AppError(404, 'Cliente não encontrado.');
  }

  if (!profissional) {
    throw new AppError(404, 'Profissional não encontrado.');
  }

  if (!servico) {
    throw new AppError(404, 'Serviço não encontrado.');
  }

  if (!profissional.ativo) {
    throw new AppError(409, 'Não é possível agendar com profissional inativo.');
  }

  if (!servico.ativo) {
    throw new AppError(409, 'Não é possível agendar serviço inativo.');
  }

  return { cliente, profissional, servico };
};

const assertSemConflito = async (
  profissionalId: number,
  dataHoraInicio: Date,
  dataHoraFim: Date,
  ignoreAgendamentoId?: number
): Promise<void> => {
  const conflito = await agendamentosRepository.findConflict(
    profissionalId,
    dataHoraInicio,
    dataHoraFim,
    ignoreAgendamentoId
  );

  if (conflito && hasTimeOverlap(dataHoraInicio, dataHoraFim, conflito.dataHoraInicio, conflito.dataHoraFim)) {
    throw new AppError(409, 'Já existe agendamento para este profissional no horário informado.');
  }
};

export const listar = async (query: ListAgendamentosQuery): Promise<AgendamentosListResponse> => {
  let dataInicio: Date | undefined;
  let dataFim: Date | undefined;

  if (query.data) {
    try {
      const { start, end } = getDayRange(query.data);
      dataInicio = start;
      dataFim = end;
    } catch {
      throw new AppError(400, 'Filtro data inválido.');
    }
  }

  const agendamentos = await agendamentosRepository.findAll({
    ...query,
    dataInicio,
    dataFim,
  });

  return AgendamentosListResponseSchema.parse(agendamentos);
};

export const buscarPorId = async (id: number): Promise<AgendamentoListItem> => {
  const agendamento = await agendamentosRepository.findById(id);

  if (!agendamento) {
    throw new AppError(404, 'Agendamento não encontrado.');
  }

  return AgendamentoResponseSchema.parse(agendamento);
};

export const criar = async (input: CreateAgendamentoInput): Promise<CreateAgendamentoResponse> => {
  const dataHoraInicio = parseDateOrBadRequest(input.dataHoraInicio, 'dataHoraInicio');

  if (isPastDate(dataHoraInicio)) {
    throw new AppError(400, 'Não é possível criar agendamento em horário passado.');
  }

  const { servico } = await validarEntidades(input.clienteId, input.profissionalId, input.servicoId);
  const dataHoraFim = addMinutes(dataHoraInicio, servico.duracaoMin);

  await assertSemConflito(input.profissionalId, dataHoraInicio, dataHoraFim);

  const id = await agendamentosRepository.create({
    clienteId: input.clienteId,
    profissionalId: input.profissionalId,
    servicoId: input.servicoId,
    dataHoraInicio,
    dataHoraFim,
    observacao: input.observacao,
  });

  return CreateAgendamentoResponseSchema.parse({
    id,
    mensagem: 'Agendamento criado com sucesso.',
  });
};

export const cancelar = async (id: number): Promise<void> => {
  const agendamento = await agendamentosRepository.findEntityById(id);

  if (!agendamento) {
    throw new AppError(404, 'Agendamento não encontrado.');
  }

  if (agendamento.status === 'cancelado') {
    throw new AppError(409, 'Agendamento já está cancelado.');
  }

  await agendamentosRepository.updateStatus(id, 'cancelado');
};

export const reagendar = async (id: number, input: ReagendarAgendamentoInput): Promise<AgendamentoListItem> => {
  const agendamentoAtual = await agendamentosRepository.findEntityById(id);

  if (!agendamentoAtual) {
    throw new AppError(404, 'Agendamento não encontrado.');
  }

  if (agendamentoAtual.status !== 'agendado') {
    throw new AppError(409, 'Somente agendamentos ativos podem ser reagendados.');
  }

  const profissionalId = input.profissionalId ?? agendamentoAtual.profissionalId;
  const servicoId = input.servicoId ?? agendamentoAtual.servicoId;
  const dataHoraInicio = parseDateOrBadRequest(input.dataHoraInicio, 'dataHoraInicio');

  if (isPastDate(dataHoraInicio)) {
    throw new AppError(400, 'Não é possível reagendar para horário passado.');
  }

  const { servico } = await validarEntidades(agendamentoAtual.clienteId, profissionalId, servicoId);
  const dataHoraFim = addMinutes(dataHoraInicio, servico.duracaoMin);

  await assertSemConflito(profissionalId, dataHoraInicio, dataHoraFim, id);

  const agendamento = await agendamentosRepository.reschedule(id, {
    profissionalId,
    servicoId,
    dataHoraInicio,
    dataHoraFim,
  });

  if (!agendamento) {
    throw new AppError(404, 'Agendamento não encontrado.');
  }

  return AgendamentoResponseSchema.parse(agendamento);
};
