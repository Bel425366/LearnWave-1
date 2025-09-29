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
      case 'perfil':
        return <PerfilAdmin user={user} />
      default:
        return <GerenciarUsuarios />
    }
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Painel Administrativo</h1>
        <div className="admin-user-info">
          <span>{user.nome}</span>
          <button className="logout-btn" onClick={() => onNavigate('user-type-selection')}>Sair</button>
        </div>
      </div>
      
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'usuarios' ? 'active' : ''}`}
          onClick={() => setActiveTab('usuarios')}
        >
          Usuários
        </button>
        <button 
          className={`tab-btn ${activeTab === 'verificacao' ? 'active' : ''}`}
          onClick={() => setActiveTab('verificacao')}
        >
          Verificar Professores
        </button>
        <button 
          className={`tab-btn ${activeTab === 'configuracoes' ? 'active' : ''}`}
          onClick={() => setActiveTab('configuracoes')}
        >
          Configurações
        </button>
        <button 
          className={`tab-btn ${activeTab === 'relatorios' ? 'active' : ''}`}
          onClick={() => setActiveTab('relatorios')}
        >
          Relatórios
        </button>
        <button 
          className={`tab-btn ${activeTab === 'perfil' ? 'active' : ''}`}
          onClick={() => setActiveTab('perfil')}
        >
          Meu Perfil
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
      case 'aluno': return 'A'
      case 'professor': return 'P'
      case 'administrador': return 'ADM'
      default: return 'U'
    }
  }

  return (
    <div className="usuarios-section">
      <div className="section-header">
        <h2>Gerenciar Usuários</h2>
        <button className="refresh-btn" onClick={() => setUsuarios(JSON.parse(localStorage.getItem('learnwave_users') || '[]'))}>Atualizar</button>
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
              <p className="data">{new Date(usuario.dataCadastro).toLocaleDateString()}</p>
            </div>
            <div className="usuario-actions">
              {usuario.tipo !== 'administrador' && (
                <button className="delete-btn" onClick={() => removerUsuario(usuario.id)}>Remover</button>
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
      <h2>Configurações do Sistema</h2>
      
      <div className="config-card">
        <h3>Configurações Gerais</h3>
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
        <h3>Configurações de Usuário</h3>
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input type="checkbox" defaultChecked />
            <span>Permitir auto-cadastro de alunos</span>
          </label>
          <label className="checkbox-label">
            <input type="checkbox" defaultChecked />
            <span>Permitir auto-cadastro de professores</span>
          </label>
        </div>
      </div>
      
      <button className="save-btn">Salvar Configurações</button>
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
      <h2>Relatórios e Estatísticas</h2>
      
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">U</div>
          <div className="stat-info">
            <h3>{totalUsuarios}</h3>
            <p>Total de Usuários</p>
          </div>
        </div>
        
        <div className="stat-card alunos">
          <div className="stat-icon">A</div>
          <div className="stat-info">
            <h3>{alunos}</h3>
            <p>Alunos</p>
          </div>
        </div>
        
        <div className="stat-card professores">
          <div className="stat-icon">P</div>
          <div className="stat-info">
            <h3>{professores}</h3>
            <p>Professores</p>
          </div>
        </div>
        
        <div className="stat-card admins">
          <div className="stat-icon">ADM</div>
          <div className="stat-info">
            <h3>{admins}</h3>
            <p>Administradores</p>
          </div>
        </div>
      </div>
      
      <div className="activity-summary">
        <h3>Resumo de Atividades</h3>
        <div className="activity-stats">
          <div className="activity-item">
            <span>Atividades Criadas:</span>
            <strong>0</strong>
          </div>
          <div className="activity-item">
            <span>Videoaulas:</span>
            <strong>0</strong>
          </div>
          <div className="activity-item">
            <span>Materiais:</span>
            <strong>0</strong>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PainelAdmin

function PerfilAdmin({ user }) {
  const [perfilData, setPerfilData] = useState(() => {
    try {
      const saved = localStorage.getItem(`perfil_${user.email}`)
      return saved ? JSON.parse(saved) : {
        apelido: user.nome,
        bio: '',
        fotoPerfil: null
      }
    } catch {
      return {
        apelido: user.nome,
        bio: '',
        fotoPerfil: null
      }
    }
  })

  const [formData, setFormData] = useState(perfilData)
  const [previewFoto, setPreviewFoto] = useState(perfilData.fotoPerfil)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const fotoBase64 = e.target.result
        setPreviewFoto(fotoBase64)
        setFormData({ ...formData, fotoPerfil: fotoBase64 })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setPerfilData(formData)
    localStorage.setItem(`perfil_${user.email}`, JSON.stringify(formData))
    alert('Perfil atualizado com sucesso!')
    window.dispatchEvent(new Event('storage'))
  }

  return (
    <div className="perfil-aluno">
      <h3>Meu Perfil de Administrador</h3>
      <form onSubmit={handleSubmit} className="form-perfil">
        <div className="foto-perfil-section">
          <div className="foto-preview">
            {previewFoto ? (
              <img src={previewFoto} alt="Foto de perfil" className="foto-perfil-img" />
            ) : (
              <div className="foto-placeholder">
                <span>+</span>
                <p>Adicionar foto</p>
              </div>
            )}
          </div>
          <input
            type="file"
            id="fotoPerfil"
            accept="image/*"
            onChange={handleFotoChange}
            className="foto-input"
          />
          <label htmlFor="fotoPerfil" className="btn-foto">
            {previewFoto ? 'Alterar Foto' : 'Adicionar Foto'}
          </label>
        </div>

        <div className="campo-perfil">
          <label>Apelido:</label>
          <input
            type="text"
            name="apelido"
            value={formData.apelido}
            onChange={handleChange}
            placeholder="Como você gostaria de ser chamado?"
            maxLength="30"
            required
          />
        </div>

        <div className="campo-perfil">
          <label>Bio:</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Conte um pouco sobre você..."
            maxLength="200"
            rows="4"
          />
          <small>{formData.bio.length}/200 caracteres</small>
        </div>

        <button type="submit" className="btn-salvar-perfil">
          Salvar Perfil
        </button>
      </form>
    </div>
  )
}