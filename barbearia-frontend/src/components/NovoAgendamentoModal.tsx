import React, { useState, useEffect } from 'react';
import { requestJson, requestJsonWithoutAuth } from '../api/api';

interface ItemBase { id: number; nome: string; }

interface NovoAgendamentoModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function NovoAgendamentoModal({ onClose, onSuccess }: NovoAgendamentoModalProps) {
  
  const [clientes, setClientes] = useState<ItemBase[]>([]);
  const [profissionais, setProfissionais] = useState<ItemBase[]>([]);
  const [servicos, setServicos] = useState<ItemBase[]>([]);

  
  const [clienteId, setClienteId] = useState<string>('');
  const [profissionalId, setProfissionalId] = useState<string>('');
  const [servicoId, setServicoId] = useState<string>('');
  const [dataHoraInicio, setDataHoraInicio] = useState<string>('');
  const [observacao, setObservacao] = useState<string>('');

  const [carregando, setCarregando] = useState<boolean>(false);
  const [erro, setErro] = useState<string | null>(null);

  
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [clientesData, profissionaisData, servicosData] = await Promise.all([
          requestJsonWithoutAuth<ItemBase[]>('/clientes'),
          requestJsonWithoutAuth<ItemBase[]>('/profissionais?ativo=true'),
          requestJsonWithoutAuth<ItemBase[]>('/servicos?ativo=true'),
        ]);

        setClientes(clientesData);
        setProfissionais(profissionaisData);
        setServicos(servicosData);
      } catch (err) {
        setErro('Erro ao carregar listas de seleção.');
      }
    };
    void carregarDados();
  }, []);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setCarregando(true);
    setErro(null);

    const token = localStorage.getItem('@AgendaFacil:token');

    try {
      await requestJson<{ id: number; mensagem: string }>('/agendamentos', {
        method: 'POST',
        body: JSON.stringify({
          clienteId: Number(clienteId),
          profissionalId: Number(profissionalId),
          servicoId: Number(servicoId),
          dataHoraInicio: new Date(dataHoraInicio).toISOString(),
          observacao,
        }),
      });

      onSuccess();
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : 'Erro interno.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
      <div style={{ background: '#121214', padding: '30px', borderRadius: '8px', width: '100%', maxWidth: '450px', border: '1px solid #323238' }}>
        <h2 style={{ color: '#ffb800', marginTop: 0, marginBottom: '20px' }}>Novo Agendamento</h2>

        {erro && <div style={{ background: '#c62828', color: '#fff', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '14px' }}>{erro}</div>}

        <form onSubmit={(e) => { void handleSubmit(e); }} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', color: '#e1e1e6', marginBottom: '5px' }}>Cliente</label>
            <select required value={clienteId} onChange={e => setClienteId(e.target.value)} style={{ width: '100%', padding: '10px', background: '#202024', color: '#fff', border: '1px solid #323238', borderRadius: '4px' }}>
              <option value="">Selecione o cliente...</option>
              {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', color: '#e1e1e6', marginBottom: '5px' }}>Profissional (Barbeiro)</label>
            <select required value={profissionalId} onChange={e => setProfissionalId(e.target.value)} style={{ width: '100%', padding: '10px', background: '#202024', color: '#fff', border: '1px solid #323238', borderRadius: '4px' }}>
              <option value="">Selecione o profissional...</option>
              {profissionais.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', color: '#e1e1e6', marginBottom: '5px' }}>Serviço</label>
            <select required value={servicoId} onChange={e => setServicoId(e.target.value)} style={{ width: '100%', padding: '10px', background: '#202024', color: '#fff', border: '1px solid #323238', borderRadius: '4px' }}>
              <option value="">Selecione o serviço...</option>
              {servicos.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', color: '#e1e1e6', marginBottom: '5px' }}>Data e Horário</label>
            <input type="datetime-local" required value={dataHoraInicio} onChange={e => setDataHoraInicio(e.target.value)} style={{ width: '100%', padding: '10px', background: '#202024', color: '#fff', border: '1px solid #323238', borderRadius: '4px' }} />
          </div>


          <div>
            <label style={{ display: 'block', color: '#e1e1e6', marginBottom: '5px' }}>Observações (Opcional)</label>
            <textarea value={observacao} onChange={e => setObservacao(e.target.value)} style={{ width: '100%', padding: '10px', background: '#202024', color: '#fff', border: '1px solid #323238', borderRadius: '4px', height: '60px', resize: 'none' }} />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button type="button" onClick={onClose} style={{ background: 'transparent', color: '#a8a8b3', border: 'none', cursor: 'pointer' }}>Cancelar</button>
            <button type="submit" disabled={carregando} style={{ background: '#ffb800', color: '#121214', padding: '10px 20px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
              {carregando ? 'Reservando...' : 'Confirmar Agendamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}