import { useState, useEffect } from 'react'
import { localDB } from '../services/localDatabase'
import VerificacaoProfessores from './VerificacaoProfessores'
import CrudUsuarios from './CrudUsuarios'

function PainelAdmin({ user, onNavigate }) {
  const [activeTab, setActiveTab] = useState('usuarios')

  const renderContent = () => {
    switch (activeTab) {
      case 'usuarios':
        return <CrudUsuarios />
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
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/usuarios')
        if (response.ok) {
          const data = await response.json()
          setUsuarios(data)
        }
      } catch (error) {
        console.error('Erro ao carregar usuários:', error)
      } finally {
        setLoading(false)
      }
    }
    carregarDados()
  }, [])

  if (loading) {
    return <div>Carregando relatórios...</div>
  }

  console.log('Todos os usuários:', usuarios)
  console.log('Tipos encontrados:', usuarios.map(u => u.tipo))
  
  const totalUsuarios = usuarios.length
  const alunos = usuarios.filter(u => u.tipo === 'ALUNO' || u.tipoUsuario === 'ALUNO' || u.tipo === 'aluno').length
  const professores = usuarios.filter(u => u.tipo === 'PROFESSOR' || u.tipoUsuario === 'PROFESSOR' || u.tipo === 'professor').length
  const admins = usuarios.filter(u => u.tipo === 'ADMINISTRADOR' || u.tipoUsuario === 'ADMINISTRADOR' || u.tipo === 'administrador').length
  
  console.log('Contadores:', { totalUsuarios, alunos, professores, admins })

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
            <p>Admins</p>
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

function DesativarConta({ user, onDesativar }) {
  const handleDesativar = async () => {
    const confirmacao = window.confirm(
      'Tem certeza que deseja desativar sua conta?\n\n' +
      'Após desativar:\n' +
      '• Você será deslogado imediatamente\n' +
      '• Não poderá mais fazer login nesta conta\n' +
      '• Precisará se cadastrar novamente se quiser voltar\n\n' +
      'Esta ação não pode ser desfeita!'
    )
    
    if (confirmacao) {
      try {
        const response = await fetch(`http://localhost:8080/api/usuarios/${user.id}/status?status=inativo`, {
          method: 'PATCH'
        })
        
        if (response.ok) {
          alert('Conta desativada com sucesso!')
          localStorage.clear()
          onDesativar()
        } else {
          throw new Error('Erro ao desativar conta')
        }
      } catch (error) {
        console.error('Erro:', error)
        alert('Erro ao desativar conta. Tente novamente.')
      }
    }
  }

  return (
    <div className="desativar-conta-section" style={{ marginTop: '30px', padding: '20px', borderTop: '1px solid #ddd' }}>
      <h4 style={{ marginBottom: '10px' }}>Configurações da Conta</h4>
      <p style={{ marginBottom: '15px' }}>Se você não deseja mais usar esta conta, pode desativá-la permanentemente.</p>
      <button 
        onClick={handleDesativar} 
        className="btn-desativar-conta"
        style={{
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          transition: 'background-color 0.3s'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#5a6268'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
      >
        Desativar Conta
      </button>
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Salvar no banco de dados
      const response = await fetch(`http://localhost:8080/api/usuarios/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...user,
          nome: formData.apelido,
          bio: formData.bio,
          fotoPerfil: formData.fotoPerfil
        })
      })
      
      if (response.ok) {
        setPerfilData(formData)
        localStorage.setItem(`perfil_${user.email}`, JSON.stringify(formData))
        alert('Perfil atualizado com sucesso!')
        window.dispatchEvent(new Event('storage'))
      } else {
        throw new Error('Erro ao salvar no servidor')
      }
    } catch (error) {
      console.error('Erro ao salvar perfil:', error)
      // Salvar apenas no localStorage como fallback
      setPerfilData(formData)
      localStorage.setItem(`perfil_${user.email}`, JSON.stringify(formData))
      alert('Perfil atualizado localmente. Erro ao sincronizar com servidor.')
      window.dispatchEvent(new Event('storage'))
    }
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
      
      <DesativarConta user={user} onDesativar={() => window.location.reload()} />
    </div>
  )
}