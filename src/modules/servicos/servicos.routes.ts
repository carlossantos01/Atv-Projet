import { Router } from 'express';
import {
  CreateServicoInputSchema,
  IdParamsSchema,
  ListServicosQuerySchema,
  UpdateServicoInputSchema,
} from '../../../packages/contracts/src';
import { requireAdmin, requireAuth } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import * as servicosController from './servicos.controller';

const router = Router();

router.get('/', validate({ query: ListServicosQuerySchema }), servicosController.listar);
router.get('/:id', validate({ params: IdParamsSchema }), servicosController.buscarPorId);
router.post('/', requireAuth, requireAdmin, validate({ body: CreateServicoInputSchema }), servicosController.criar);
router.put('/:id', requireAuth, requireAdmin, validate({ params: IdParamsSchema, body: UpdateServicoInputSchema }), servicosController.atualizar);
router.delete('/:id', requireAuth, requireAdmin, validate({ params: IdParamsSchema }), servicosController.desativar);

export default router;
