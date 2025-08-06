import { useState } from 'react'
import { database } from '../utils/database'

function PainelAdmin({ user, onNavigate }) {
  const [activeTab, setActiveTab] = useState('usuarios')

  const renderContent = () => {
    switch (activeTab) {
      case 'usuarios':
        return <GerenciarUsuarios />
      case 'configuracoes':
        return <ConfiguracoesSite />
      case 'relatorios':
        return <RelatoriosGerais />
      default:
        return <GerenciarUsuarios />
    }
  }

  return (
    <div className="painel-admin">
      <h2>Painel Administrativo - {user.nome}</h2>
      
      <div className="tabs">
        <button 
          className={activeTab === 'usuarios' ? 'active' : ''}
          onClick={() => setActiveTab('usuarios')}
        >
          Usuários
        </button>
        <button 
          className={activeTab === 'configuracoes' ? 'active' : ''}
          onClick={() => setActiveTab('configuracoes')}
        >
          Configurações
        </button>
        <button 
          className={activeTab === 'relatorios' ? 'active' : ''}
          onClick={() => setActiveTab('relatorios')}
        >
          Relatórios
        </button>
      </div>

      <div className="tab-content">
        {renderContent()}
      </div>
    </div>
  )
}

function GerenciarUsuarios() {
  const [usuarios, setUsuarios] = useState(() => {
    return database.listarUsuarios()
  })

  const removerUsuario = (id) => {
    if (confirm('Tem certeza que deseja remover este usuário?')) {
      database.removerUsuario(id)
      setUsuarios(database.listarUsuarios())
    }
  }

  const atualizarLista = () => {
    setUsuarios(database.listarUsuarios())
  }

  return (
    <div className="gerenciar-usuarios">
      <div className="header-actions">
        <h3>Gerenciar Usuários</h3>
        <button className="btn-primary" onClick={atualizarLista}>Atualizar Lista</button>
      </div>
      
      <div className="usuarios-lista">
        <div className="usuarios-header">
          <span>Nome</span>
          <span>Email</span>
          <span>Tipo</span>
          <span>Data Cadastro</span>
          <span>Ações</span>
        </div>
        {usuarios.map(usuario => (
          <div key={usuario.id} className="usuario-item">
            <span>{usuario.nome}</span>
            <span>{usuario.email}</span>
            <span className={`tipo-${usuario.tipo}`}>{usuario.tipo}</span>
            <span>{new Date(usuario.dataCadastro).toLocaleDateString()}</span>
            <div className="actions">
              <button>Editar</button>
              <button onClick={() => removerUsuario(usuario.id)} className="btn-danger">
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ConfiguracoesSite() {
  return (
    <div className="configuracoes-site">
      <h3>Configurações do Site</h3>
      <div className="config-section">
        <h4>Configurações Gerais</h4>
        <label>
          Nome do Site:
          <input type="text" defaultValue="LearnWave - Português" />
        </label>
        <label>
          Descrição:
          <textarea defaultValue="Plataforma de ensino de Língua Portuguesa"></textarea>
        </label>
      </div>
      <div className="config-section">
        <h4>Configurações de Usuário</h4>
        <label>
          <input type="checkbox" defaultChecked />
          Permitir auto-cadastro de alunos
        </label>
        <label>
          <input type="checkbox" defaultChecked />
          Permitir auto-cadastro de professores
        </label>
      </div>
      <button className="btn-primary">Salvar Configurações</button>
    </div>
  )
}

function RelatoriosGerais() {
  return (
    <div className="relatorios-gerais">
      <h3>Relatórios Gerais</h3>
      <div className="stats-overview">
        <div className="stat-card">
          <h4>Total de Usuários</h4>
          <p>156</p>
        </div>
        <div className="stat-card">
          <h4>Alunos Ativos</h4>
          <p>142</p>
        </div>
        <div className="stat-card">
          <h4>Professores</h4>
          <p>12</p>
        </div>
        <div className="stat-card">
          <h4>Atividades Publicadas</h4>
          <p>48</p>
        </div>
      </div>
    </div>
  )
}

export default PainelAdmin