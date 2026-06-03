import { useEffect, useState } from 'react';
import type { AgendamentoListItem, ApiErrorResponse } from '../../../packages/contracts';

const API_AGENDAMENTOS_URL = 'http://localhost:3000/api/agendamentos';

const isApiErrorResponse = (value: unknown): value is ApiErrorResponse => {
    return typeof value === 'object' && value !== null && 'erro' in value;
};

function Agenda() {
    const [agendamentos, setAgendamentos] = useState<AgendamentoListItem[]>([]);
    const [carregando, setCarregando] = useState<boolean>(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        const carregarAgendamentos = async (): Promise<void> => {
            try {
                const res = await fetch(API_AGENDAMENTOS_URL);
                if (!res.ok) {
                    const apiError: unknown = await res.json().catch(() => null);
                    const mensagem = isApiErrorResponse(apiError) ? apiError.erro : 'Erro ao buscar dados do servidor.';
                    throw new Error(mensagem);
                }

                const dados: unknown = await res.json();
                setAgendamentos(dados as AgendamentoListItem[]);
            } catch (err: unknown) {
                const mensagem = err instanceof Error ? err.message : 'Erro desconhecido';
                setErro(mensagem);
            } finally {
                setCarregando(false);
            }
        };

        void carregarAgendamentos();
    }, []);

    const deletarAgendamento = (id: number): void => {
        if (window.confirm('Deseja realmente cancelar este horário?')) {
            fetch(`${API_AGENDAMENTOS_URL}/${id}`, { method: 'DELETE' })
                .then(() => {
                    setAgendamentos((agendamentosAtuais) => agendamentosAtuais.filter((ag) => ag.id !== id));
                });
        }
    };

    if (carregando) return <p style={{ color: '#ffb800' }}>Carregando agenda...</p>;
    if (erro) return <p style={{ color: '#ff4444' }}>Erro: {erro}</p>;

    return (
        <div className="agenda-container" style={{ background: '#202024', padding: '20px', borderRadius: '8px' }}>
        <h2 style={{ color: '#ffb800' }}>Agenda do Dia</h2>
        
        {agendamentos.length === 0 ? (
            <p>Nenhum horário marcado para hoje.</p>
        ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#e1e1e6' }}>
            <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid #323238' }}>
                <th style={{ padding: '10px' }}>Horário</th>
                <th>Cliente</th>
                <th>Serviço</th>
                <th>Barbeiro</th>
                <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                {agendamentos.map((ag) => (
                <tr key={ag.id} style={{ borderBottom: '1px solid #323238' }}>
                    <td style={{ padding: '10px', color: '#ffb800' }}>
                    {new Date(ag.dataHoraInicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td>{ag.cliente}</td>
                    <td>{ag.servico}</td>
                    <td>{ag.profissional}</td>
                    <td>
                    <button 
                        onClick={() => deletarAgendamento(ag.id)}
                        style={{ background: '#ff4444', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Cancelar
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        )}
        </div>
    );
}

export default Agenda;
