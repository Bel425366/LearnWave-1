import { useState } from 'react'
import { localDB } from '../services/localDatabase'
import VerificacaoProfessores from './VerificacaoProfessores'

function PainelAdmin({ user, onNavigate }) {
  const [activeTab, setActiveTab] = useState('usuarios')

  const renderContent = () => {
    switch (activeTab) {
      case 'usuarios':
        return <GerenciarUsuarios />
      case 'verificacao':
        return <VerificacaoProfessores />
      case 'configuracoes':
        return <ConfiguracoesSite />
      case 'relatorios':
        return <RelatoriosGerais />
      default:
        return <GerenciarUsuarios />
    }
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>🛠️ Painel Administrativo</h1>
        <div className="admin-user-info">
          <span>👨‍💼 {user.nome}</span>
          <button className="logout-btn" onClick={() => onNavigate('user-type-selection')}>Sair</button>
        </div>
      </div>
      
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'usuarios' ? 'active' : ''}`}
          onClick={() => setActiveTab('usuarios')}
        >
          👥 Usuários
        </button>
        <button 
          className={`tab-btn ${activeTab === 'verificacao' ? 'active' : ''}`}
          onClick={() => setActiveTab('verificacao')}
        >
          ✅ Verificar Professores
        </button>
        <button 
          className={`tab-btn ${activeTab === 'configuracoes' ? 'active' : ''}`}
          onClick={() => setActiveTab('configuracoes')}
        >
          ⚙️ Configurações
        </button>
        <button 
          className={`tab-btn ${activeTab === 'relatorios' ? 'active' : ''}`}
          onClick={() => setActiveTab('relatorios')}
        >
          📊 Relatórios
        </button>
      </div>

      <div className="admin-content">
        {renderContent()}
      </div>
    </div>
  )
}

function GerenciarUsuarios() {
  const [usuarios, setUsuarios] = useState(() => JSON.parse(localStorage.getItem('learnwave_users') || '[]'))

  const removerUsuario = (id) => {
    if (confirm('Tem certeza que deseja remover este usuário?')) {
      const users = JSON.parse(localStorage.getItem('learnwave_users') || '[]')
      const updatedUsers = users.filter(u => u.id !== id)
      localStorage.setItem('learnwave_users', JSON.stringify(updatedUsers))
      setUsuarios(updatedUsers)
    }
  }

  const getTipoIcon = (tipo) => {
    switch(tipo) {
      case 'aluno': return '👨‍🎓'
      case 'professor': return '👨‍🏫'
      case 'administrador': return '👨‍💼'
      default: return '👤'
    }
  }

  return (
    <div className="usuarios-section">
      <div className="section-header">
        <h2>👥 Gerenciar Usuários</h2>
        <button className="refresh-btn" onClick={() => setUsuarios(JSON.parse(localStorage.getItem('learnwave_users') || '[]'))}>🔄 Atualizar</button>
      </div>
      
      <div className="usuarios-grid">
        {usuarios.map(usuario => (
          <div key={usuario.id} className="usuario-card">
            <div className="usuario-avatar">
              {usuario.imagem ? (
                <img src={usuario.imagem} alt={usuario.nome} className="avatar-img" />
              ) : (
                getTipoIcon(usuario.tipo)
              )}
            </div>
            <div className="usuario-info">
              <h3>{usuario.nome}</h3>
              <p className="email">{usuario.email}</p>
              <span className={`tipo-badge tipo-${usuario.tipo}`}>{usuario.tipo}</span>
              <p className="data">📅 {new Date(usuario.dataCadastro).toLocaleDateString()}</p>
            </div>
            <div className="usuario-actions">
              <button className="edit-btn">✏️ Editar</button>
              {usuario.tipo !== 'administrador' && (
                <button className="delete-btn" onClick={() => removerUsuario(usuario.id)}>🗑️ Remover</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ConfiguracoesSite() {
  return (
    <div className="config-section">
      <h2>⚙️ Configurações do Sistema</h2>
      
      <div className="config-card">
        <h3>🏢 Configurações Gerais</h3>
        <div className="form-group">
          <label>Nome do Site:</label>
          <input type="text" defaultValue="LearnWave - Português" className="config-input" />
        </div>
        <div className="form-group">
          <label>Descrição:</label>
          <textarea defaultValue="Plataforma de ensino de Língua Portuguesa" className="config-textarea"></textarea>
        </div>
      </div>
      
      <div className="config-card">
        <h3>👥 Configurações de Usuário</h3>
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input type="checkbox" defaultChecked />
            <span>✅ Permitir auto-cadastro de alunos</span>
          </label>
          <label className="checkbox-label">
            <input type="checkbox" defaultChecked />
            <span>✅ Permitir auto-cadastro de professores</span>
          </label>
        </div>
      </div>
      
      <button className="save-btn">💾 Salvar Configurações</button>
    </div>
  )
}

function RelatoriosGerais() {
  const usuarios = JSON.parse(localStorage.getItem('learnwave_users') || '[]')
  const totalUsuarios = usuarios.length
  const alunos = usuarios.filter(u => u.tipo === 'aluno').length
  const professores = usuarios.filter(u => u.tipo === 'professor').length
  const admins = usuarios.filter(u => u.tipo === 'administrador').length

  return (
    <div className="relatorios-section">
      <h2>📊 Relatórios e Estatísticas</h2>
      
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{totalUsuarios}</h3>
            <p>Total de Usuários</p>
          </div>
        </div>
        
        <div className="stat-card alunos">
          <div className="stat-icon">👨‍🎓</div>
          <div className="stat-info">
            <h3>{alunos}</h3>
            <p>Alunos</p>
          </div>
        </div>
        
        <div className="stat-card professores">
          <div className="stat-icon">👨‍🏫</div>
          <div className="stat-info">
            <h3>{professores}</h3>
            <p>Professores</p>
          </div>
        </div>
        
        <div className="stat-card admins">
          <div className="stat-icon">👨‍💼</div>
          <div className="stat-info">
            <h3>{admins}</h3>
            <p>Administradores</p>
          </div>
        </div>
      </div>
      
      <div className="activity-summary">
        <h3>📈 Resumo de Atividades</h3>
        <div className="activity-stats">
          <div className="activity-item">
            <span>📚 Atividades Criadas:</span>
            <strong>0</strong>
          </div>
          <div className="activity-item">
            <span>🎥 Videoaulas:</span>
            <strong>0</strong>
          </div>
          <div className="activity-item">
            <span>📄 Materiais:</span>
            <strong>0</strong>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PainelAdmin