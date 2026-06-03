import { Router } from 'express';
import {
  CreateClienteInputSchema,
  IdParamsSchema,
  UpdateClienteInputSchema,
} from '../../../packages/contracts/src';
import { requireAdmin, requireAuth } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import * as clientesController from './clientes.controller';

const router = Router();

router.get('/', clientesController.listar);
router.get('/:id', validate({ params: IdParamsSchema }), clientesController.buscarPorId);
router.post('/', requireAuth, requireAdmin, validate({ body: CreateClienteInputSchema }), clientesController.criar);
router.put('/:id', requireAuth, requireAdmin, validate({ params: IdParamsSchema, body: UpdateClienteInputSchema }), clientesController.atualizar);
router.delete('/:id', requireAuth, requireAdmin, validate({ params: IdParamsSchema }), clientesController.remover);

export default router;
