import { useState, useEffect } from 'react';
import NovoAgendamentoModal from './NovoAgendamentoModal';
import { requestJson } from '../api/api';
import type { AgendamentoListItem } from '../../../packages/contracts/src';

const formatarDataHora = (value: string): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
};

export default function Agenda() {
  const [agendamentos, setAgendamentos] = useState<AgendamentoListItem[]>([]);
  const [modalNovoAberto, setModalNovoAberto] = useState<boolean>(false); 
  const [carregando, setCarregando] = useState<boolean>(false);
  const [erro, setErro] = useState<string | null>(null);
 

  const carregarAgendamentos = async (): Promise<void> => {
    setCarregando(true);
    setErro(null);

    try {
      const dados = await requestJson<AgendamentoListItem[]>('/agendamentos');
      setAgendamentos(dados);
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : 'Erro ao carregar agendamentos.');
    } finally {
      setCarregando(false);
    }
  };
  
  
  useEffect(() => {
    void carregarAgendamentos();
  }, []);

  return (
    <div style={{ background: '#121214', padding: '20px', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#fff', margin: 0 }}>Minha Agenda</h2>
        
      
        <button 
          onClick={() => setModalNovoAberto(true)}
          style={{ background: '#ffb800', color: '#121214', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          + Agendar Horário
        </button>
      </div>

      {modalNovoAberto && (
        <NovoAgendamentoModal 
          onClose={() => setModalNovoAberto(false)} 
          onSuccess={() => {
            setModalNovoAberto(false);
            void carregarAgendamentos(); 
          }} 
        />
      )}

      {carregando ? (
        <p style={{ color: '#9ca3af', margin: 0 }}>Carregando agendamentos...</p>
      ) : erro ? (
        <div style={{ padding: '12px', borderRadius: '4px', background: '#c62828', color: '#fff' }}>
          {erro}
        </div>
      ) : agendamentos.length === 0 ? (
        <p style={{ color: '#9ca3af', margin: 0 }}>Nenhum agendamento encontrado.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: '#e1e1e6', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #323238' }}>
                <th style={{ padding: '10px' }}>Cliente</th>
                <th>Profissional</th>
                <th>Serviço</th>
                <th>Início</th>
                <th>Fim</th>
                <th>Status</th>
                <th>Observação</th>
              </tr>
            </thead>
            <tbody>
              {agendamentos.map((agendamento) => (
                <tr key={agendamento.id} style={{ borderBottom: '1px solid #323238' }}>
                  <td style={{ padding: '10px' }}>{agendamento.cliente}</td>
                  <td>{agendamento.profissional}</td>
                  <td>{agendamento.servico}</td>
                  <td>{formatarDataHora(agendamento.dataHoraInicio)}</td>
                  <td>{formatarDataHora(agendamento.dataHoraFim)}</td>
                  <td style={{ textTransform: 'capitalize' }}>{agendamento.status}</td>
                  <td>{agendamento.observacao ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
