import { Router } from 'express';
import { LoginInputSchema, RegisterInputSchema } from '../../../packages/contracts/src';
import { requireAuth } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import * as authController from './auth.controller';

const router = Router();

router.post('/register', validate({ body: RegisterInputSchema }), authController.register);
router.post('/login', validate({ body: LoginInputSchema }), authController.login);
router.get('/me', requireAuth, authController.me);

export default router;
