import { Router } from 'express';
import {
  CreateProfissionalInputSchema,
  IdParamsSchema,
  ListProfissionaisQuerySchema,
  UpdateProfissionalInputSchema,
} from '../../../packages/contracts/src';
import { requireAdmin, requireAuth } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import * as profissionaisController from './profissionais.controller';

const router = Router();

router.get('/', validate({ query: ListProfissionaisQuerySchema }), profissionaisController.listar);
router.get('/:id', validate({ params: IdParamsSchema }), profissionaisController.buscarPorId);
router.post('/', requireAuth, requireAdmin, validate({ body: CreateProfissionalInputSchema }), profissionaisController.criar);
router.put('/:id', requireAuth, requireAdmin, validate({ params: IdParamsSchema, body: UpdateProfissionalInputSchema }), profissionaisController.atualizar);
router.delete('/:id', requireAuth, requireAdmin, validate({ params: IdParamsSchema }), profissionaisController.desativar);

export default router;
