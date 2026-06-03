import type { PerfilUsuario } from '../../packages/contracts/src';

declare global {
  namespace Express {
    interface AuthenticatedUser {
      id: number;
      nome: string;
      email: string;
      perfil: PerfilUsuario;
    }

    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export {};
