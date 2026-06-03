import { useState } from 'react';
import Agenda from './components/Agenda';
import Login from './components/Login';
import Cadastro from './components/Cadastro';
import Gerenciamento from './components/Gerenciamento';
import './App.css';

type TelaAtiva = 'login' | 'cadastro';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('@AgendaFacil:token'));
  const [telaAtiva, setTelaAtiva] = useState<TelaAtiva>('login');

  const handleLoginSuccess = (userToken: string): void => {
    localStorage.setItem('@AgendaFacil:token', userToken);
    setToken(userToken);
  };

  const handleLogout = (): void => {
    localStorage.removeItem('@AgendaFacil:token');
    setToken(null);
    setTelaAtiva('login');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '40px', borderBottom: '1px solid #323238', paddingBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: '#ffb800', margin: 0 }}>AgendaFácil Barbearia</h1>
          <p style={{ color: '#9ca3af', margin: '5px 0 0 0' }}>Gerenciamento e controle de agendamentos em tempo real</p>
        </div>
        {token && (
          <button
            onClick={handleLogout}
            style={{ background: '#323238', color: '#fff', border: '1px solid #444', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
          >
            Sair
          </button>
        )}
      </header>

      <main>
        {token ? (
          <>
            
            <Agenda />

           
            <Gerenciamento />
          </>
        ) : telaAtiva === 'login' ? (
          <Login 
            onLoginSuccess={handleLoginSuccess} 
            onNavigateToRegister={() => setTelaAtiva('cadastro')} 
          />
        ) : (
          <Cadastro 
            onRegisterSuccess={() => setTelaAtiva('login')} 
            onNavigateToLogin={() => setTelaAtiva('login')} 
          />
        )}
      </main>
    </div>
  );
}

export default App;