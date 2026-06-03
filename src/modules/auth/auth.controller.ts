import type { Request, Response } from 'express';
import type {
  ApiErrorResponse,
  AuthResponse,
  LoginInput,
  MeResponse,
  RegisterInput,
} from '../../../packages/contracts/src';
import { ApiErrorSchema } from '../../../packages/contracts/src';
import * as authService from './auth.service';

type RegisterRequest = Request<Record<string, never>, AuthResponse | ApiErrorResponse, RegisterInput>;
type LoginRequest = Request<Record<string, never>, AuthResponse | ApiErrorResponse, LoginInput>;

export const register = async (req: RegisterRequest, res: Response<AuthResponse | ApiErrorResponse>): Promise<void> => {
  const response = await authService.register(req.body);
  res.status(201).json(response);
};

export const login = async (req: LoginRequest, res: Response<AuthResponse | ApiErrorResponse>): Promise<void> => {
  const response = await authService.login(req.body);
  res.json(response);
};

export const me = async (req: Request, res: Response<MeResponse | ApiErrorResponse>): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json(ApiErrorSchema.parse({ erro: 'Token de autenticação não informado.' }));
    return;
  }

  const response = await authService.me(userId);
  res.json(response);
};
