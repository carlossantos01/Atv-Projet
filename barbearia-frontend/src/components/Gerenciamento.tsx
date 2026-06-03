import React, { useEffect, useState } from 'react';
import type { ApiErrorResponse, Cliente, Profissional, Servico } from '../../../packages/contracts/src';

type AbaAtiva = 'clientes' | 'profissionais' | 'servicos';

const API_BASE_URL = 'http://localhost:3000/api';

const isApiErrorResponse = (value: unknown): value is ApiErrorResponse => {
  return typeof value === 'object' && value !== null && 'erro' in value;
};

const getToken = (): string | null => {
  return localStorage.getItem('@AgendaFacil:token');
};

async function requestJson<TResponse>(path: string, options: RequestInit = {}): Promise<TResponse> {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const body: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(isApiErrorResponse(body) ? body.erro : 'Erro ao processar solicitação.');
  }

  return body as TResponse;
}

export default function Gerenciamento() {
  const [aba, setAba] = useState<AbaAtiva>('clientes');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [modalAberto, setModalAberto] = useState<boolean>(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);
  const [carregando, setCarregando] = useState<boolean>(false);
  const [salvando, setSalvando] = useState<boolean>(false);
  const [erro, setErro] = useState<string | null>(null);

  const [nomeForm, setNomeForm] = useState<string>('');
  const [emailForm, setEmailForm] = useState<string>('');
  const [telefoneForm, setTelefoneForm] = useState<string>('');
  const [especialidadeForm, setEspecialidadeForm] = useState<string>('');
  const [precoForm, setPrecoForm] = useState<string>('');
  const [duracaoForm, setDuracaoForm] = useState<string>('');

  const carregarDados = async (): Promise<void> => {
    setCarregando(true);
    setErro(null);

    try {
      const [clientesData, profissionaisData, servicosData] = await Promise.all([
        requestJson<Cliente[]>('/clientes'),
        requestJson<Profissional[]>('/profissionais'),
        requestJson<Servico[]>('/servicos'),
      ]);

      setClientes(clientesData);
      setProfissionais(profissionaisData);
      setServicos(servicosData);
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : 'Erro ao carregar dados.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    void carregarDados();
  }, []);

  const limparFormulario = (): void => {
    setNomeForm('');
    setEmailForm('');
    setTelefoneForm('');
    setEspecialidadeForm('');
    setPrecoForm('');
    setDuracaoForm('');
  };

  const abrirNovoModal = (): void => {
    setIdEditando(null);
    limparFormulario();
    setErro(null);
    setModalAberto(true);
  };

  const abrirEditarModal = (tipo: AbaAtiva, item: Cliente | Profissional | Servico): void => {
    setIdEditando(item.id);
    setNomeForm(item.nome);
    setErro(null);

    if (tipo === 'clientes') {
      const cliente = item as Cliente;
      setEmailForm(cliente.email ?? '');
      setTelefoneForm(cliente.telefone);
      setEspecialidadeForm('');
      setPrecoForm('');
      setDuracaoForm('');
    } else if (tipo === 'profissionais') {
      const profissional = item as Profissional;
      setTelefoneForm(profissional.telefone ?? '');
      setEspecialidadeForm(profissional.especialidade ?? '');
      setEmailForm('');
      setPrecoForm('');
      setDuracaoForm('');
    } else {
      const servico = item as Servico;
      setPrecoForm(String(servico.preco));
      setDuracaoForm(String(servico.duracaoMin));
      setEmailForm('');
      setTelefoneForm('');
      setEspecialidadeForm('');
    }

    setModalAberto(true);
  };

  const salvarRegistro = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setSalvando(true);
    setErro(null);

    try {
      if (aba === 'clientes') {
        const payload = {
          nome: nomeForm,
          email: emailForm || null,
          telefone: telefoneForm,
        };
        await requestJson<Cliente>(idEditando ? `/clientes/${idEditando}` : '/clientes', {
          method: idEditando ? 'PUT' : 'POST',
          body: JSON.stringify(payload),
        });
      } else if (aba === 'profissionais') {
        const payload = {
          nome: nomeForm,
          especialidade: especialidadeForm || null,
          telefone: telefoneForm || null,
        };
        await requestJson<Profissional>(idEditando ? `/profissionais/${idEditando}` : '/profissionais', {
          method: idEditando ? 'PUT' : 'POST',
          body: JSON.stringify(payload),
        });
      } else {
        const payload = {
          nome: nomeForm,
          preco: Number(precoForm),
          duracaoMin: Number(duracaoForm),
        };
        await requestJson<Servico>(idEditando ? `/servicos/${idEditando}` : '/servicos', {
          method: idEditando ? 'PUT' : 'POST',
          body: JSON.stringify(payload),
        });
      }

      setModalAberto(false);
      limparFormulario();
      await carregarDados();
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : 'Erro ao salvar registro.');
    } finally {
      setSalvando(false);
    }
  };

  const desativarOuRemover = async (id: number, tipo: AbaAtiva): Promise<void> => {
    setErro(null);

    try {
      if (tipo === 'clientes') {
        await requestJson<{ mensagem: string }>(`/clientes/${id}`, { method: 'DELETE' });
      } else if (tipo === 'profissionais') {
        await requestJson<Profissional>(`/profissionais/${id}`, { method: 'DELETE' });
      } else {
        await requestJson<Servico>(`/servicos/${id}`, { method: 'DELETE' });
      }

      await carregarDados();
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : 'Erro ao atualizar status.');
    }
  };

  const getTituloSingular = (): string => {
    if (aba === 'clientes') return 'cliente';
    if (aba === 'profissionais') return 'profissional';
    return 'servico';
  };

  return (
    <div style={{ background: '#202024', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #323238', paddingBottom: '10px' }}>
        {(['clientes', 'profissionais', 'servicos'] as AbaAtiva[]).map((tipoAba) => (
          <button
            key={tipoAba}
            onClick={() => setAba(tipoAba)}
            style={{
              padding: '10px 20px',
              background: aba === tipoAba ? '#ffb800' : '#121214',
              color: aba === tipoAba ? '#121214' : '#a8a8b3',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {tipoAba}
          </button>
        ))}
      </div>

      {erro && (
        <div style={{ padding: '10px', marginBottom: '15px', borderRadius: '4px', background: '#c62828', color: '#fff', fontSize: '14px' }}>
          {erro}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ color: '#fff', margin: 0, textTransform: 'capitalize' }}>Listagem de {aba}</h3>
        <button
          onClick={abrirNovoModal}
          style={{ background: '#00875f', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          + Adicionar Novo
        </button>
      </div>

      {carregando ? (
        <p style={{ color: '#9ca3af', margin: 0 }}>Carregando dados...</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: '#e1e1e6', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #323238' }}>
                <th style={{ padding: '10px' }}>Nome</th>
                {aba === 'clientes' && <><th>E-mail</th><th>Telefone</th></>}
                {aba === 'profissionais' && <><th>Especialidade</th><th>Telefone</th><th>Status</th></>}
                {aba === 'servicos' && <><th>Preço</th><th>Duração</th><th>Status</th></>}
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {aba === 'clientes' && clientes.map((cliente) => (
                <tr key={cliente.id} style={{ borderBottom: '1px solid #323238' }}>
                  <td style={{ padding: '10px' }}>{cliente.nome}</td>
                  <td>{cliente.email ?? '-'}</td>
                  <td>{cliente.telefone}</td>
                  <td>
                    <button onClick={() => abrirEditarModal('clientes', cliente)} style={{ background: '#ffb800', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}>Editar</button>
                    <button onClick={() => { void desativarOuRemover(cliente.id, 'clientes'); }} style={{ background: '#f75a68', border: 'none', padding: '5px 10px', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>Remover</button>
                  </td>
                </tr>
              ))}

              {aba === 'profissionais' && profissionais.map((profissional) => (
                <tr key={profissional.id} style={{ borderBottom: '1px solid #323238', opacity: profissional.ativo ? 1 : 0.5 }}>
                  <td style={{ padding: '10px' }}>{profissional.nome}</td>
                  <td>{profissional.especialidade ?? '-'}</td>
                  <td>{profissional.telefone ?? '-'}</td>
                  <td style={{ color: profissional.ativo ? '#00b37e' : '#f75a68' }}>{profissional.ativo ? 'Ativo' : 'Inativo'}</td>
                  <td>
                    <button onClick={() => abrirEditarModal('profissionais', profissional)} style={{ background: '#ffb800', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}>Editar</button>
                    <button disabled={!profissional.ativo} onClick={() => { void desativarOuRemover(profissional.id, 'profissionais'); }} style={{ background: '#f75a68', border: 'none', padding: '5px 10px', borderRadius: '4px', color: '#fff', cursor: profissional.ativo ? 'pointer' : 'not-allowed' }}>Desativar</button>
                  </td>
                </tr>
              ))}

              {aba === 'servicos' && servicos.map((servico) => (
                <tr key={servico.id} style={{ borderBottom: '1px solid #323238', opacity: servico.ativo ? 1 : 0.5 }}>
                  <td style={{ padding: '10px' }}>{servico.nome}</td>
                  <td>R$ {servico.preco.toFixed(2)}</td>
                  <td>{servico.duracaoMin} min</td>
                  <td style={{ color: servico.ativo ? '#00b37e' : '#f75a68' }}>{servico.ativo ? 'Ativo' : 'Inativo'}</td>
                  <td>
                    <button onClick={() => abrirEditarModal('servicos', servico)} style={{ background: '#ffb800', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}>Editar</button>
                    <button disabled={!servico.ativo} onClick={() => { void desativarOuRemover(servico.id, 'servicos'); }} style={{ background: '#f75a68', border: 'none', padding: '5px 10px', borderRadius: '4px', color: '#fff', cursor: servico.ativo ? 'pointer' : 'not-allowed' }}>Desativar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalAberto && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#121214', padding: '25px', borderRadius: '8px', width: '100%', maxWidth: '400px', border: '1px solid #323238' }}>
            <h4 style={{ color: '#ffb800', margin: '0 0 20px 0' }}>{idEditando !== null ? 'Editar' : 'Cadastrar Novo'} {getTituloSingular()}</h4>
            <form onSubmit={(e) => { void salvarRegistro(e); }} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#e1e1e6' }}>Nome</label>
                <input type="text" required value={nomeForm} onChange={e => setNomeForm(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #323238', background: '#202024', color: '#fff' }} />
              </div>

              {aba === 'clientes' && (
                <>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#e1e1e6' }}>E-mail</label>
                    <input type="email" value={emailForm} onChange={e => setEmailForm(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #323238', background: '#202024', color: '#fff' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#e1e1e6' }}>Telefone</label>
                    <input type="text" required value={telefoneForm} onChange={e => setTelefoneForm(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #323238', background: '#202024', color: '#fff' }} />
                  </div>
                </>
              )}

              {aba === 'profissionais' && (
                <>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#e1e1e6' }}>Especialidade</label>
                    <input type="text" value={especialidadeForm} onChange={e => setEspecialidadeForm(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #323238', background: '#202024', color: '#fff' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#e1e1e6' }}>Telefone</label>
                    <input type="text" value={telefoneForm} onChange={e => setTelefoneForm(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #323238', background: '#202024', color: '#fff' }} />
                  </div>
                </>
              )}

              {aba === 'servicos' && (
                <>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#e1e1e6' }}>Preço (R$)</label>
                    <input type="number" step="0.01" required value={precoForm} onChange={e => setPrecoForm(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #323238', background: '#202024', color: '#fff' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#e1e1e6' }}>Duração (minutos)</label>
                    <input type="number" required value={duracaoForm} onChange={e => setDuracaoForm(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #323238', background: '#202024', color: '#fff' }} />
                  </div>
                </>
              )}

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setModalAberto(false)} style={{ background: '#323238', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" disabled={salvando} style={{ background: '#ffb800', color: '#121214', border: 'none', padding: '8px 16px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>{salvando ? 'Salvando...' : 'Salvar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
