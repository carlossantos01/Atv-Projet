import type { ApiErrorResponse } from '../../../packages/contracts/src';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

const isApiErrorResponse = (value: unknown): value is ApiErrorResponse => {
  return typeof value === 'object' && value !== null && 'erro' in value;
};

const getToken = (): string | null => {
  return localStorage.getItem('@AgendaFacil:token');
};

const buildHeaders = (options: RequestInit = {}): HeadersInit => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
};

export const requestJson = async <TResponse>(path: string, options: RequestInit = {}): Promise<TResponse> => {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: buildHeaders(options),
  });

  const body: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(isApiErrorResponse(body) ? body.erro : 'Erro ao processar solicitação.');
  }

  return body as TResponse;
};

export const requestJsonWithoutAuth = async <TResponse>(path: string, options: RequestInit = {}): Promise<TResponse> => {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const body: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(isApiErrorResponse(body) ? body.erro : 'Erro ao processar solicitação.');
  }

  return body as TResponse;
};
