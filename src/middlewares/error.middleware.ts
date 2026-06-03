import type { ErrorRequestHandler } from 'express';
import { ApiErrorSchema } from '../../packages/contracts/src';
import { env } from '../config/env';
import { AppError } from '../errors/app-error';

export const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next): void => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json(ApiErrorSchema.parse({
            erro: err.message,
            detalhes: err.detalhes,
        }));
        return;
    }

    const message = env.NODE_ENV === 'production'
        ? 'Erro interno inesperado.'
        : err instanceof Error ? err.message : 'Erro interno inesperado.';

    res.status(500).json(ApiErrorSchema.parse({
        erro: message,
    }));
};
