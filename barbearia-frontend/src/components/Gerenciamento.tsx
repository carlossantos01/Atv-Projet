import React, { useState } from 'react';

interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  ativo: boolean;
}

interface Profissional {
  id: number;
  nome: string;
  especialidade: string;
  ativo: boolean;
}

interface Servico {
  id: number;
  nome: string;
  preco: number;
  duracao: number; 
  ativo: boolean;
}

type AbaAtiva = 'clientes' | 'profissionais' | 'servicos';

export default function Gerenciamento() {
  const [aba, setAba] = useState<AbaAtiva>('clientes');
  
  
  const [clientes, setClientes] = useState<Cliente[]>([
    { id: 1, nome: 'Carlos Silva', email: 'carlos@email.com', telefone: '(11) 99999-9999', ativo: true },
    { id: 2, nome: 'Ana Souza', email: 'ana@email.com', telefone: '(11) 98888-8888', ativo: true }
  ]);

  const [profissionais, setProfissionais] = useState<Profissional[]>([
    { id: 1, nome: 'Barbeiro Lucas', especialidade: 'Corte e Barba', ativo: true },
    { id: 2, nome: 'Barbeiro Matheus', especialidade: 'Visagismo e Degradê', ativo: true }
  ]);

  const [servicos, setServicos] = useState<Servico[]>([
    { id: 1, nome: 'Corte Degradê', preco: 45.00, duracao: 30, ativo: true },
    { id: 2, nome: 'Barba Terapia', preco: 35.00, duracao: 25, ativo: true }
  ]);

  
  const [modalAberto, setModalAberto] = useState<boolean>(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);

 
  const [nomeForm, setNomeForm] = useState<string>('');
  const [emailForm, setEmailForm] = useState<string>('');
  const [telefoneForm, setTelefoneForm] = useState<string>('');
  const [especialidadeForm, setEspecialidadeForm] = useState<string>('');
  const [precoForm, setPrecoForm] = useState<string>('');
  const [duracaoForm, setDuracaoForm] = useState<string>('');

 
  const abrirNovoModal = () => {
    setIdEditando(null);
    setNomeForm('');
    setEmailForm('');
    setTelefoneForm('');
    setEspecialidadeForm('');
    setPrecoForm('');
    setDuracaoForm('');
    setModalAberto(true);
  };

  
  const abrirEditarModal = (tipo: AbaAtiva, item: Cliente | Profissional | Servico) => {
    setIdEditando(item.id);
    setNomeForm(item.nome);
    if (tipo === 'clientes') {
      const c = item as Cliente;
      setEmailForm(c.email);
      setTelefoneForm(c.telefone);
    } else if (tipo === 'profissionais') {
      const p = item as Profissional;
      setEspecialidadeForm(p.especialidade);
    } else if (tipo === 'servicos') {
      const s = item as Servico;
      setPrecoForm(s.preco.toString());
      setDuracaoForm(s.duracao.toString());
    }
    setModalAberto(true);
  };

  const salvarRegistro = (e: React.FormEvent) => {
    e.preventDefault();

    if (aba === 'clientes') {
      if (idEditando !== null) {
        setClientes(clientes.map(c => c.id === idEditando ? { ...c, nome: nomeForm, email: emailForm, telefone: telefoneForm } : c));
      } else {
        setClientes([...clientes, { id: Date.now(), nome: nomeForm, email: emailForm, telefone: telefoneForm, ativo: true }]);
      }
    } else if (aba === 'profissionais') {
      if (idEditando !== null) {
        setProfissionais(profissionais.map(p => p.id === idEditando ? { ...p, nome: nomeForm, especialidade: specialtyFormCheck(especialidadeForm) } : p));
      } else {
        setProfissionais([...profissionais, { id: Date.now(), nome: nomeForm, especialidade: especialidadeForm, ativo: true }]);
      }
    } else if (aba === 'servicos') {
      if (idEditando !== null) {
        setServicos(servicos.map(s => s.id === idEditando ? { ...s, nome: nomeForm, preco: parseFloat(precoForm), duracao: parseInt(duracaoForm) } : s));
      } else {
        setServicos([...servicos, { id: Date.now(), nome: nomeForm, preco: parseFloat(precoForm), duracao: parseInt(duracaoForm), ativo: true }]);
      }
    }

    setModalAberto(false);
  };

  const specialtyFormCheck = (val: string) => val || 'Geral';

  
  const alternarStatus = (id: number, tipo: AbaAtiva) => {
    if (tipo === 'clientes') {
      setClientes(clientes.map(c => c.id === id ? { ...c, ativo: !c.ativo } : c));
    } else if (tipo === 'profissionais') {
      setProfissionais(profissionais.map(p => p.id === id ? { ...p, ativo: !p.ativo } : p));
    } else if (tipo === 'servicos') {
      setServicos(servicos.map(s => s.id === id ? { ...s, ativo: !s.ativo } : s));
    }
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

     
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ color: '#fff', margin: 0, textTransform: 'capitalize' }}>Listagem de {aba}</h3>
        <button
          onClick={abrirNovoModal}
          style={{ background: '#00875f', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          + Adicionar Novo
        </button>
      </div>

  
      <table style={{ width: '100%', borderCollapse: 'collapse', color: '#e1e1e6', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #323238' }}>
            <th style={{ padding: '10px' }}>Nome</th>
            {aba === 'clientes' && <><th>E-mail</th><th>Telefone</th></>}
            {aba === 'profissionais' && <th>Especialidade</th>}
            {aba === 'servicos' && <><th>Preço</th><th>Duração</th></>}
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {aba === 'clientes' && clientes.map(c => (
            <tr key={c.id} style={{ borderBottom: '1px solid #323238', opacity: c.ativo ? 1 : 0.5 }}>
              <td style={{ padding: '10px' }}>{c.nome}</td>
              <td>{c.email}</td>
              <td>{c.telefone}</td>
              <td style={{ color: c.ativo ? '#00b37e' : '#f75a68' }}>{c.ativo ? 'Ativo' : 'Inativo'}</td>
              <td>
                <button onClick={() => abrirEditarModal('clientes', c)} style={{ background: '#ffb800', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}>Editar</button>
                <button onClick={() => alternarStatus(c.id, 'clientes')} style={{ background: c.ativo ? '#f75a68' : '#00b37e', border: 'none', padding: '5px 10px', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>{c.ativo ? 'Desativar' : 'Ativar'}</button>
              </td>
            </tr>
          ))}

          {aba === 'profissionais' && profissionais.map(p => (
            <tr key={p.id} style={{ borderBottom: '1px solid #323238', opacity: p.ativo ? 1 : 0.5 }}>
              <td style={{ padding: '10px' }}>{p.nome}</td>
              <td>{p.especialidade}</td>
              <td style={{ color: p.ativo ? '#00b37e' : '#f75a68' }}>{p.ativo ? 'Ativo' : 'Inativo'}</td>
              <td>
                <button onClick={() => abrirEditarModal('profissionais', p)} style={{ background: '#ffb800', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}>Editar</button>
                <button onClick={() => alternarStatus(p.id, 'profissionais')} style={{ background: p.ativo ? '#f75a68' : '#00b37e', border: 'none', padding: '5px 10px', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>{p.ativo ? 'Desativar' : 'Ativar'}</button>
              </td>
            </tr>
          ))}

          {aba === 'servicos' && servicos.map(s => (
            <tr key={s.id} style={{ borderBottom: '1px solid #323238', opacity: s.ativo ? 1 : 0.5 }}>
              <td style={{ padding: '10px' }}>{s.nome}</td>
              <td>R$ {s.preco.toFixed(2)}</td>
              <td>{s.duracao} min</td>
              <td style={{ color: s.ativo ? '#00b37e' : '#f75a68' }}>{s.ativo ? 'Ativo' : 'Inativo'}</td>
              <td>
                <button onClick={() => abrirEditarModal('servicos', s)} style={{ background: '#ffb800', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}>Editar</button>
                <button onClick={() => alternarStatus(s.id, 'servicos')} style={{ background: s.ativo ? '#f75a68' : '#00b37e', border: 'none', padding: '5px 10px', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>{s.ativo ? 'Desativar' : 'Ativar'}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      
      {modalAberto && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#121214', padding: '25px', borderRadius: '8px', width: '100%', maxWidth: '400px', border: '1px solid #323238' }}>
            <h4 style={{ color: '#ffb800', margin: '0 0 20px 0' }}>{idEditando !== null ? 'Editar' : 'Cadastrar Novo'} {aba.slice(0, -1)}</h4>
            <form onSubmit={salvarRegistro} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#e1e1e6' }}>Nome</label>
                <input type="text" required value={nomeForm} onChange={e => setNomeForm(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #323238', background: '#202024', color: '#fff' }} />
              </div>

              {aba === 'clientes' && (
                <>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#e1e1e6' }}>E-mail</label>
                    <input type="email" required value={emailForm} onChange={e => setEmailForm(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #323238', background: '#202024', color: '#fff' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#e1e1e6' }}>Telefone</label>
                    <input type="text" required value={telefoneForm} onChange={e => setTelefoneForm(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #323238', background: '#202024', color: '#fff' }} />
                  </div>
                </>
              )}

              {aba === 'profissionais' && (
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#e1e1e6' }}>Especialidade</label>
                  <input type="text" required value={especialidadeForm} onChange={e => setEspecialidadeForm(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #323238', background: '#202024', color: '#fff' }} />
                </div>
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
                <button type="submit" style={{ background: '#ffb800', color: '#121214', border: 'none', padding: '8px 16px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}