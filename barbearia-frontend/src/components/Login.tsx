import React, { useState } from 'react';
import type { ApiErrorResponse } from '../../../packages/contracts/src';

interface LoginProps {
  onLoginSuccess: (token: string) => void;
  onNavigateToRegister: () => void;
}

const API_AUTH_URL = 'http://localhost:3000/api/auth/login';

const isApiErrorResponse = (value: unknown): value is ApiErrorResponse => {
  return typeof value === 'object' && value !== null && 'erro' in value;
};

export default function Login({ onLoginSuccess, onNavigateToRegister }: LoginProps) {
  const [email, setEmail] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const [carregando, setCarregando] = useState<boolean>(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setCarregando(true);
    setErro(null);

    try {
      const res = await fetch(API_AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      if (!res.ok) {
        const apiError: unknown = await res.json().catch(() => null);
        const mensagem = isApiErrorResponse(apiError) ? apiError.erro : 'Ocorreu um erro ao fazer login.';
        throw new Error(mensagem);
      }

      const dados = await res.json() as { token: string };
      onLoginSuccess(dados.token);
    } catch (err: unknown) {
      const mensagem = err instanceof Error ? err.message : 'Erro desconhecido';
      setErro(mensagem);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '60px auto', padding: '20px', background: '#1f2028', borderRadius: '8px', border: '1px solid #323238' }}>
      <h2 style={{ color: '#ffb800', textAlign: 'center', marginBottom: '20px' }}>Acessar Sistema</h2>

      {erro && (
        <div style={{ padding: '10px', marginBottom: '15px', borderRadius: '4px', background: '#c62828', color: '#fff', fontSize: '14px' }}>
          {erro}
        </div>
      )}

      <form onSubmit={(e) => { void handleSubmit(e); }} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', color: '#e1e1e6' }}>E-mail</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #323238', background: '#121214', color: '#fff' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', color: '#e1e1e6' }}>Senha</label>
          <input
            type="password"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #323238', background: '#121214', color: '#fff' }}
          />
        </div>

        <button
          type="submit"
          disabled={carregando}
          style={{ background: '#ffb800', color: '#121214', border: 'none', padding: '12px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
        >
          {carregando ? 'Processando...' : 'Entrar'}
        </button>
      </form>

      <p style={{ color: '#9ca3af', textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
        Não tem uma conta?{' '}
        <span
          onClick={onNavigateToRegister}
          style={{ color: '#ffb800', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Cadastre-se
        </span>
      </p>
    </div>
  );
}