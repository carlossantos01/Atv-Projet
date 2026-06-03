import cors from 'cors';
import express from 'express';
import { ApiErrorSchema, HealthResponseSchema } from '../packages/contracts/src';
import { env } from './config/env';
import { errorMiddleware } from './middlewares/error.middleware';
import agendamentosRoutes from './modules/agendamentos/agendamentos.routes';
import authRoutes from './modules/auth/auth.routes';
import clientesRoutes from './modules/clientes/clientes.routes';
import profissionaisRoutes from './modules/profissionais/profissionais.routes';
import servicosRoutes from './modules/servicos/servicos.routes';

const app = express();

app.use(cors({
    origin: env.CORS_ORIGIN ?? true,
}));
app.use(express.json());

app.get('/api/health', (_req, res) => {
    res.json(HealthResponseSchema.parse({
        status: 'ok',
        timestamp: new Date().toISOString(),
    }));
});

app.use('/api/auth', authRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/profissionais', profissionaisRoutes);
app.use('/api/servicos', servicosRoutes);
app.use('/api/agendamentos', agendamentosRoutes);

app.use((_req, res) => {
    res.status(404).json(ApiErrorSchema.parse({ erro: 'Rota não encontrada.' }));
});

app.use(errorMiddleware);

export default app;
