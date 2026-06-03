import { Router } from 'express';
import {
  CreateAgendamentoInputSchema,
  IdParamsSchema,
  ListAgendamentosQuerySchema,
  ReagendarAgendamentoInputSchema,
} from '../../../packages/contracts/src';
import { requireAuth } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import * as agendamentosController from './agendamentos.controller';

const router = Router();

router.get('/', validate({ query: ListAgendamentosQuerySchema }), agendamentosController.listar);
router.get('/:id', validate({ params: IdParamsSchema }), agendamentosController.buscarPorId);
router.post('/', requireAuth, validate({ body: CreateAgendamentoInputSchema }), agendamentosController.criar);
router.patch('/:id/cancelar', requireAuth, validate({ params: IdParamsSchema }), agendamentosController.cancelar);
router.patch('/:id/reagendar', requireAuth, validate({ params: IdParamsSchema, body: ReagendarAgendamentoInputSchema }), agendamentosController.reagendar);
router.delete('/:id', requireAuth, validate({ params: IdParamsSchema }), agendamentosController.deletar);

export default router;
