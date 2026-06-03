import Agenda from './components/Agenda'; // Certifique-se de que o caminho até o arquivo Agenda.tsx está correto
import './App.css';

function App() {
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '40px', borderBottom: '1px solid #323238', paddingBottom: '20px' }}>
        <h1 style={{ color: '#ffb800', margin: 0 }}>AgendaFácil Barbearia</h1>
        <p style={{ color: '#9ca3af', margin: '5px 0 0 0' }}>Gerenciamento e controle de agendamentos em tempo real</p>
      </header>

      <main>
        <Agenda />
      </main>
    </div>
  );
}

export default App;