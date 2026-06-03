import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { ZodType } from 'zod';
import { ApiErrorSchema } from '../../packages/contracts/src';

interface ValidationSchemas {
    body?: ZodType<unknown>;
    params?: ZodType<unknown>;
    query?: ZodType<unknown>;
}

const formatValidationError = (issues: Array<{ path: PropertyKey[]; message: string }>): string[] => {
    return issues.map((issue) => {
        const path = issue.path.join('.');
        return path ? `${path}: ${issue.message}` : issue.message;
    });
};

export const validate = (schemas: ValidationSchemas): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (schemas.body) {
            const result = schemas.body.safeParse(req.body);
            if (!result.success) {
                res.status(400).json(ApiErrorSchema.parse({
                    erro: 'Dados inválidos no corpo da requisição.',
                    detalhes: formatValidationError(result.error.issues),
                }));
                return;
            }
            req.body = result.data;
        }

        if (schemas.params) {
            const result = schemas.params.safeParse(req.params);
            if (!result.success) {
                res.status(400).json(ApiErrorSchema.parse({
                    erro: 'Parâmetros inválidos na requisição.',
                    detalhes: formatValidationError(result.error.issues),
                }));
                return;
            }
            req.params = result.data as typeof req.params;
        }

        if (schemas.query) {
            const result = schemas.query.safeParse(req.query);
            if (!result.success) {
                res.status(400).json(ApiErrorSchema.parse({
                    erro: 'Filtros inválidos na requisição.',
                    detalhes: formatValidationError(result.error.issues),
                }));
                return;
            }
            Object.defineProperty(req, 'query', {
                value: result.data as typeof req.query,
                writable: true,
                enumerable: true,
                configurable: true,
            });
        }

        next();
    };
};
