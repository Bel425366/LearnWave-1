import { useState, useEffect } from 'react'
import { localDB } from '../services/localDatabase'
import UsuarioAPI from '../services/api-learnwave'
import VerificacaoProfessores from './VerificacaoProfessores'
import CrudUsuarios from './CrudUsuarios'

function PainelAdmin({ user, onNavigate }) {
  const [activeTab, setActiveTab] = useState('verificacao')

  const tabs = [
    {
      id: 'verificacao', label: 'Verificar Professores',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
    },
    {
      id: 'usuarios', label: 'Usuários',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    },
    {
      id: 'relatorios', label: 'Relatórios',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
    },
    {
      id: 'configuracoes', label: 'Configurações',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
    },
    {
      id: 'perfil', label: 'Meu Perfil',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    },
  ]

  const iniciais = (user.nome || 'A').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="painel-novo">
      {/* Hero */}
      <div className="painel-hero painel-hero--admin">
        <div className="painel-hero-avatar painel-hero-avatar--admin">
          {iniciais}
        </div>
        <div className="painel-hero-info">
          <h2>Painel Administrativo</h2>
          <p>{user.email}</p>
        </div>
        <div className="admin-hero-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Administrador
        </div>
      </div>

      {/* Tabs */}
      <div className="painel-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`painel-tab${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      <div className="painel-content">
        {activeTab === 'verificacao'   && <VerificacaoProfessores />}
        {activeTab === 'usuarios'      && <CrudUsuarios />}
        {activeTab === 'relatorios'    && <RelatoriosGerais />}
        {activeTab === 'configuracoes' && <ConfiguracoesSite />}
        {activeTab === 'perfil'        && <PerfilAdmin user={user} />}
      </div>
    </div>
  )
}

function ConfiguracoesSite() {
  return (
    <div className="admin-section">
      <div className="admin-section-title">Configurações do Sistema</div>

      <div className="admin-card">
        <div className="admin-card-label">Configurações Gerais</div>
        <div className="admin-form-group">
          <label>Nome do Site</label>
          <input type="text" defaultValue="LearnWave - Português" className="admin-input" />
        </div>
        <div className="admin-form-group">
          <label>Descrição</label>
          <textarea defaultValue="Plataforma de ensino de Língua Portuguesa" className="admin-input admin-textarea" />
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-label">Permissões de Cadastro</div>
        <div className="admin-checkbox-group">
          <label className="admin-checkbox-label">
            <input type="checkbox" defaultChecked />
            <span>Permitir auto-cadastro de alunos</span>
          </label>
          <label className="admin-checkbox-label">
            <input type="checkbox" defaultChecked />
            <span>Permitir auto-cadastro de professores</span>
          </label>
        </div>
      </div>

      <button className="admin-btn-primary">Salvar Configurações</button>
    </div>
  )
}

function RelatoriosGerais() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    UsuarioAPI.listar()
      .then(data => setUsuarios(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="admin-loading">Carregando...</div>

  const total       = usuarios.length
  const alunos      = usuarios.filter(u => (u.tipo || u.tipoUsuario || '').toLowerCase() === 'aluno').length
  const professores = usuarios.filter(u => (u.tipo || u.tipoUsuario || '').toLowerCase() === 'professor').length
  const admins      = usuarios.filter(u => (u.tipo || u.tipoUsuario || '').toLowerCase() === 'administrador').length

  const stats = [
    { val: total,       lbl: 'Total de usuários',  cor: '#667eea' },
    { val: alunos,      lbl: 'Alunos',             cor: '#22c55e' },
    { val: professores, lbl: 'Professores',         cor: '#a78bfa' },
    { val: admins,      lbl: 'Administradores',     cor: '#f59e0b' },
  ]

  const atividades = JSON.parse(localStorage.getItem('atividades') || '[]').filter(a => !a.excluido).length
  const videoaulas = JSON.parse(localStorage.getItem('videoaulas') || '[]').filter(v => !v.excluido).length
  const materiais  = JSON.parse(localStorage.getItem('materiais')  || '[]').filter(m => !m.excluido).length

  return (
    <div className="admin-section">
      <div className="admin-section-title">Relatórios e Estatísticas</div>

      <div className="admin-stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="admin-stat-card">
            <div className="admin-stat-val" style={{ color: s.cor }}>{s.val}</div>
            <div className="admin-stat-lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <div className="admin-card-label">Conteúdo da Plataforma</div>
        {[
          { lbl: 'Atividades criadas', val: atividades },
          { lbl: 'Videoaulas',         val: videoaulas },
          { lbl: 'Materiais',          val: materiais  },
        ].map((item, i) => (
          <div key={i} className="admin-activity-item">
            <span>{item.lbl}</span>
            <strong>{item.val}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}

function PerfilAdmin({ user }) {
  const [perfilData, setPerfilData] = useState(() => {
    try {
      const saved = localStorage.getItem(`perfil_${user.email}`)
      return saved ? JSON.parse(saved) : { apelido: user.nome, bio: '', fotoPerfil: null }
    } catch {
      return { apelido: user.nome, bio: '', fotoPerfil: null }
    }
  })
  const [formData, setFormData] = useState(perfilData)
  const [previewFoto, setPreviewFoto] = useState(perfilData.fotoPerfil)

  const handleFotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewFoto(e.target.result)
        setFormData(prev => ({ ...prev, fotoPerfil: e.target.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`http://localhost:8080/api/usuarios/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user, nome: formData.apelido, bio: formData.bio, fotoPerfil: formData.fotoPerfil })
      })
      if (!response.ok) throw new Error()
    } catch {}
    setPerfilData(formData)
    localStorage.setItem(`perfil_${user.email}`, JSON.stringify(formData))
    alert('Perfil atualizado!')
    window.dispatchEvent(new Event('storage'))
  }

  const iniciais = (formData.apelido || user.nome).split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="perfil-aluno">
      <form onSubmit={handleSubmit} className="form-perfil">
        <div className="foto-perfil-section">
          <div className="foto-preview" style={{ fontSize: '1.8rem', fontWeight: 700, color: 'white', background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            {previewFoto
              ? <img src={previewFoto} alt="foto" className="foto-perfil-img" />
              : iniciais}
          </div>
          <input type="file" id="fotoPerfilAdmin" accept="image/*" onChange={handleFotoChange} className="foto-input" />
          <label htmlFor="fotoPerfilAdmin" className="btn-foto">{previewFoto ? 'Alterar foto' : 'Adicionar foto'}</label>
        </div>

        <div className="campo-perfil">
          <label>Nome</label>
          <input type="text" value={formData.apelido} onChange={e => setFormData({ ...formData, apelido: e.target.value })} maxLength="30" required />
        </div>
        <div className="campo-perfil">
          <label>Bio</label>
          <textarea value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} maxLength="200" rows="4" />
          <small>{formData.bio?.length || 0}/200 caracteres</small>
        </div>

        <button type="submit" className="btn-salvar-perfil">Salvar perfil</button>
      </form>
    </div>
  )
}

export default PainelAdmin
