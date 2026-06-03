import { useState, useEffect } from 'react';
import NovoAgendamentoModal from './NovoAgendamentoModal';
import type { Agendamento } from '../../../packages/contracts/src';


export default function Agenda() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [modalNovoAberto, setModalNovoAberto] = useState<boolean>(false); 
 

  const carregarAgendamentos = async () => {
 
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

   
    </div>
  );
}