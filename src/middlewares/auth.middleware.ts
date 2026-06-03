import type { NextFunction, Request, RequestHandler, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ApiErrorSchema } from '../../packages/contracts/src';
import type { PerfilUsuario } from '../../packages/contracts/src';
import { env } from '../config/env';

interface AuthTokenPayload extends jwt.JwtPayload {
  sub: string;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
}

const getBearerToken = (authorization?: string): string | null => {
  if (!authorization) {
    return null;
  }

  const [scheme, token] = authorization.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  return token;
};

export const requireAuth: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  const token = getBearerToken(req.headers.authorization);

  if (!token) {
    res.status(401).json(ApiErrorSchema.parse({ erro: 'Token de autenticação não informado.' }));
    return;
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
    const userId = Number(payload.sub);

    if (!Number.isInteger(userId) || userId <= 0) {
      res.status(401).json(ApiErrorSchema.parse({ erro: 'Token de autenticação inválido.' }));
      return;
    }

    req.user = {
      id: userId,
      nome: payload.nome,
      email: payload.email,
      perfil: payload.perfil,
    };

    next();
  } catch {
    res.status(401).json(ApiErrorSchema.parse({ erro: 'Token de autenticação inválido ou expirado.' }));
  }
};

export const requireAdmin: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user?.perfil !== 'admin') {
    res.status(403).json(ApiErrorSchema.parse({ erro: 'Acesso restrito a administradores.' }));
    return;
  }

  next();
};
