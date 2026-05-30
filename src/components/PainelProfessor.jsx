import { useState, useCallback, useEffect } from 'react'
import Modal from './Modal'
import PasswordValidator from './PasswordValidator'

const SENHA_FORTE = (pwd) =>
  pwd.length >= 8 &&
  /[A-Z]/.test(pwd) &&
  /[a-z]/.test(pwd) &&
  /\d/.test(pwd) &&
  /[!@#$%^&*(),.?":{}|<>]/.test(pwd)

const AREAS = ['Gramática', 'Literatura', 'Redação', 'Interpretação de Texto', 'Ortografia', 'Fonética', 'Semântica', 'Estilística', 'Morfologia', 'Sintaxe', 'Pontuação', 'Versificação']

function PainelProfessor({ user, onNavigate }) {
  const [activeTab, setActiveTab] = useState('atividades')
  const [atividades, setAtividades] = useState([])

  useEffect(() => {
    fetch(`https://learnwaveback2.onrender.com/api/atividades/professor/${user.id}`)
      .then(r => r.json())
      .then(data => setAtividades(data))
      .catch(() => {
        const saved = JSON.parse(localStorage.getItem('atividades') || '[]')
        setAtividades(saved.filter(a => a.professorId === user.id))
      })
  }, [user.id])
  const [videoaulas, setVideoaulas] = useState(() => {
    const saved = localStorage.getItem('videoaulas')
    return saved ? JSON.parse(saved) : []
  })
  const [materiais, setMateriais] = useState([])

  const renderContent = () => {
    switch (activeTab) {
      case 'atividades':
        return <GerenciarAtividades atividades={atividades} setAtividades={setAtividades} professorId={user.id} />
      case 'videoaulas':
        return <GerenciarVideoaulas videoaulas={videoaulas} setVideoaulas={setVideoaulas} />
      case 'materiais':
        return <GerenciarMateriais materiais={materiais} setMateriais={setMateriais} professorId={user.id} />
      case 'progresso':
        return <AcompanharProgresso />
      case 'lixeira':
        return <Lixeira atividades={atividades} setAtividades={setAtividades} videoaulas={videoaulas} setVideoaulas={setVideoaulas} materiais={materiais} setMateriais={setMateriais} />
      case 'perfil':
        return <PerfilProfessor user={user} />
      case 'alunos':
        return <VisualizarAlunos />
      default:
        return <GerenciarAtividades atividades={atividades} setAtividades={setAtividades} />
    }
  }

  const primeiroNome = user.nome.split(' ')[0]
  const iniciais = user.nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

  const tabs = [
    { id: 'atividades', label: 'Atividades',       icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg> },
    { id: 'videoaulas', label: 'Videoaulas',       icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg> },
    { id: 'materiais',  label: 'Materiais',        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
    { id: 'progresso',  label: 'Progresso',        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
    { id: 'alunos',     label: 'Alunos',           icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
    { id: 'lixeira',    label: 'Lixeira',          icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg> },
    { id: 'perfil',     label: 'Meu Perfil',       icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  ]

  return (
    <div className="painel-novo">
      {/* Hero */}
      <div className="painel-hero painel-hero--prof">
        <div className="painel-hero-avatar painel-hero--prof">
          {iniciais}
        </div>
        <div className="painel-hero-info">
          <h2>Olá, {primeiroNome}</h2>
          <p>{user.email}</p>
        </div>
        <div className="painel-hero-stats">
          <div className="painel-stat">
            <span className="painel-stat-val">{atividades.filter(a => !a.excluido).length}</span>
            <span className="painel-stat-lbl">Atividades</span>
          </div>
          <div className="painel-stat">
            <span className="painel-stat-val">{videoaulas.filter(v => !v.excluido).length}</span>
            <span className="painel-stat-lbl">Videoaulas</span>
          </div>
          <div className="painel-stat">
            <span className="painel-stat-val">{materiais.filter(m => !m.excluido).length}</span>
            <span className="painel-stat-lbl">Materiais</span>
          </div>
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
        {renderContent()}
      </div>
    </div>
  )
}

function GerenciarAtividades({ atividades, setAtividades, professorId }) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ titulo: '', area: '', descricao: '', status: 'Rascunho', tipo: 'dissertativa', questoes: [] })
  const [areasAbertas, setAreasAbertas] = useState({})
  const toggleArea = (area) => setAreasAbertas(prev => ({ ...prev, [area]: !prev[area] }))

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()

    if (formData.tipo === 'multipla_escolha') {
      if (formData.questoes && formData.questoes.length > 0) {
        for (let i = 0; i < formData.questoes.length; i++) {
          const q = formData.questoes[i]
          if (!q.pergunta || !q.opcaoA || !q.opcaoB || !q.opcaoC || !q.opcaoD || !q.respostaCorreta) {
            alert(`Questão ${i + 1}: Todos os campos são obrigatórios.`)
            return
          }
        }
      } else {
        if (!formData.opcaoA || !formData.opcaoB || !formData.opcaoC || !formData.opcaoD || !formData.respostaCorreta) {
          alert('Para atividades de múltipla escolha, todas as opções e a resposta correta devem ser preenchidas.')
          return
        }
      }
    }

    const payload = {
      titulo: formData.titulo,
      descricao: formData.descricao,
      area: formData.area,
      professorId: professorId,
      conteudo: JSON.stringify({ tipo: formData.tipo, questoes: formData.questoes, opcaoA: formData.opcaoA, opcaoB: formData.opcaoB, opcaoC: formData.opcaoC, opcaoD: formData.opcaoD, respostaCorreta: formData.respostaCorreta }),
      status: formData.status === 'Publicada' ? 'PUBLICADO' : 'RASCUNHO'
    }

    try {
      let atividadeSalva
      if (editingId) {
        const res = await fetch(`https://learnwaveback2.onrender.com/api/atividades/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        if (!res.ok) throw new Error(await res.text())
        atividadeSalva = await res.json()
        const newAtividades = atividades.map(a => a.id === editingId ? { ...a, ...formData, id: atividadeSalva.id } : a)
        setAtividades(newAtividades)
        localStorage.setItem('atividades', JSON.stringify(newAtividades))
      } else {
        const res = await fetch('https://learnwaveback2.onrender.com/api/atividades', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        if (!res.ok) throw new Error(await res.text())
        atividadeSalva = await res.json()
        const novaAtividade = { ...formData, id: atividadeSalva.id, excluido: false }
        const newAtividades = [...atividades, novaAtividade]
        setAtividades(newAtividades)
        localStorage.setItem('atividades', JSON.stringify(newAtividades))
      }
    } catch (err) {
      console.error('Erro ao salvar atividade:', err)
      alert('Erro ao salvar no servidor: ' + err.message)
      return
    }

    setFormData({ titulo: '', area: '', descricao: '', status: 'Rascunho', tipo: 'dissertativa', questoes: [] })
    setShowForm(false)
    setEditingId(null)
  }, [editingId, atividades, formData, setAtividades, professorId])

  const handleEdit = (atividade) => {
    setFormData(atividade)
    setEditingId(atividade.id)
    setShowForm(true)
  }

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null })

  const handleDelete = (id) => {
    setDeleteModal({ isOpen: true, id })
  }

  const confirmDelete = async () => {
    try {
      const res = await fetch(`https://learnwaveback2.onrender.com/api/atividades/${deleteModal.id}/lixeira`, { method: 'PATCH' })
      if (!res.ok) throw new Error(await res.text())
    } catch (err) {
      console.error('Erro ao mover para lixeira:', err)
    }
    const newAtividades = atividades.map(a => a.id === deleteModal.id ? { ...a, situacao: 'lixeira', excluido: true } : a)
    setAtividades(newAtividades)
    localStorage.setItem('atividades', JSON.stringify(newAtividades))
    setDeleteModal({ isOpen: false, id: null })
  }

  return (
    <div className="gerenciar-atividades">
      <div className="header-actions">
        <h3>Gerenciar Atividades</h3>
        <button className="btn-primary" onClick={() => setShowForm(true)}>Nova Atividade</button>
      </div>
      
      {showForm && (
        <form onSubmit={handleSubmit} className="form-atividade">
          <input
            type="text"
            placeholder="Título da atividade"
            value={formData.titulo}
            onChange={(e) => setFormData({...formData, titulo: e.target.value})}
            aria-label="Título da atividade"
            required
          />
          <select
            value={formData.area}
            onChange={(e) => setFormData({...formData, area: e.target.value})}
            required
          >
            <option value="">Área</option>
            {AREAS.map(area => <option key={area} value={area}>{area}</option>)}
          </select>
          <textarea
            placeholder="Descrição da atividade"
            value={formData.descricao}
            onChange={(e) => setFormData({...formData, descricao: e.target.value})}
            required
          />
          <select
            value={formData.tipo || 'dissertativa'}
            onChange={(e) => setFormData({...formData, tipo: e.target.value})}
          >
            <option value="dissertativa">Dissertativa</option>
            <option value="multipla_escolha">Múltipla Escolha</option>
          </select>
          {formData.tipo === 'multipla_escolha' && (
            <FormularioQuestoes formData={formData} setFormData={setFormData} />
          )}
          <select
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
          >
            <option value="Rascunho">Rascunho</option>
            <option value="Publicada">Publicada</option>
          </select>
          <div className="form-actions">
            <button type="submit">{editingId ? 'Atualizar' : 'Criar'}</button>
            <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setFormData({ titulo: '', area: '', descricao: '', status: 'Rascunho', tipo: 'dissertativa', questoes: [] }); }}>Cancelar</button>
          </div>
        </form>
      )}
      
      <div className="atividades-lista">
        {Object.entries(
          atividades.filter(a => !a.excluido && a.situacao !== 'lixeira').reduce((acc, a) => {
            acc[a.area] = acc[a.area] || []
            acc[a.area].push(a)
            return acc
          }, {})
        ).map(([area, atividadesArea]) => {
          const aberta = areasAbertas[area] === true
          return (
            <div key={area} style={{ marginBottom: '0.5rem' }}>
              <button
                onClick={() => toggleArea(area)}
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: aberta ? '8px 8px 0 0' : '8px', cursor: 'pointer', color: 'inherit', fontSize: '1rem', fontWeight: 600 }}
              >
                <span>{area} <span style={{ fontWeight: 400, opacity: 0.6, fontSize: '0.85rem' }}>({atividadesArea.length})</span></span>
                <span>{aberta ? '▲' : '▼'}</span>
              </button>
              {aberta && (
                <div style={{ border: '1px solid rgba(255,255,255,0.1)', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '0.5rem' }}>
                  {atividadesArea.map(atividade => (
                    <div key={atividade.id} className="atividade-item">
                      <div>
                        <h4>{atividade.titulo}</h4>
                        <p>Status: {atividade.status}</p>
                        <p>{atividade.descricao}</p>
                      </div>
                      <div className="actions">
                        <button onClick={() => handleEdit(atividade)}>Editar</button>
                        <button onClick={() => handleDelete(atividade.id)}>Excluir</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão"
        message="Deseja mover esta atividade para a lixeira?"
        confirmText="Mover"
      />
    </div>
  )
}

function GerenciarVideoaulas({ videoaulas, setVideoaulas }) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ titulo: '', area: '', duracao: '', url: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    let newVideoaulas
    if (editingId) {
      newVideoaulas = videoaulas.map(v => v.id === editingId ? { ...v, ...formData } : v)
    } else {
      newVideoaulas = [...videoaulas, { id: Date.now(), ...formData, excluido: false }]
    }
    setVideoaulas(newVideoaulas)
    localStorage.setItem('videoaulas', JSON.stringify(newVideoaulas))
    setFormData({ titulo: '', area: '', duracao: '', url: '' })
    setShowForm(false)
    setEditingId(null)
  }

  const handleEdit = (video) => {
    setFormData(video)
    setEditingId(video.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (confirm('Mover para lixeira?')) {
      const newVideoaulas = videoaulas.map(v => v.id === id ? { ...v, excluido: true } : v)
      setVideoaulas(newVideoaulas)
      localStorage.setItem('videoaulas', JSON.stringify(newVideoaulas))
    }
  }

  return (
    <div className="gerenciar-videoaulas">
      <div className="header-actions">
        <h3>Gerenciar Videoaulas</h3>
        <button className="btn-primary" onClick={() => setShowForm(true)}>Nova Videoaula</button>
      </div>
      
      {showForm && (
        <form onSubmit={handleSubmit} className="form-atividade">
          <input
            type="text"
            placeholder="Título da videoaula"
            value={formData.titulo}
            onChange={(e) => setFormData({...formData, titulo: e.target.value})}
            required
          />
          <select
            value={formData.area}
            onChange={(e) => setFormData({...formData, area: e.target.value})}
            required
          >
            <option value="">Área</option>
            {AREAS.map(area => <option key={area} value={area}>{area}</option>)}
          </select>
          <input
            type="text"
            placeholder="Duração (ex: 15 min)"
            value={formData.duracao}
            onChange={(e) => setFormData({...formData, duracao: e.target.value})}
            required
          />
          <input
            type="url"
            placeholder="URL do vídeo"
            value={formData.url}
            onChange={(e) => setFormData({...formData, url: e.target.value})}
            required
          />
          <div className="form-actions">
            <button type="submit">{editingId ? 'Atualizar' : 'Criar'}</button>
            <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setFormData({ titulo: '', area: '', duracao: '', url: '' }); }}>Cancelar</button>
          </div>
        </form>
      )}
      
      <div className="atividades-lista">
        {videoaulas.filter(v => !v.excluido).map(video => (
          <div key={video.id} className="atividade-item">
            <div>
              <h4>{video.titulo}</h4>
              <p>Área: {video.area} | Duração: {video.duracao}</p>
              <p>URL: {video.url}</p>
            </div>
            <div className="actions">
              <button onClick={() => handleEdit(video)}>Editar</button>
              <button onClick={() => handleDelete(video.id)}>Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function GerenciarMateriais({ materiais, setMateriais, professorId }) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ titulo: '', descricao: '', area: '', tipoArquivo: 'PDF', arquivoUrl: '', status: 'PUBLICADO' })
  const [arquivo, setArquivo] = useState(null)
  const [areasAbertas, setAreasAbertas] = useState({})
  const toggleArea = (area) => setAreasAbertas(prev => ({ ...prev, [area]: !prev[area] }))

  useEffect(() => {
    fetch(`https://learnwaveback2.onrender.com/api/materiais/professor/${professorId}`)
      .then(r => r.json())
      .then(data => setMateriais(data))
      .catch(() => {})
  }, [professorId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!editingId && !arquivo) {
      alert('Selecione um arquivo.')
      return
    }
    let arquivoBase64 = formData.arquivoUrl || null
    if (arquivo) {
      arquivoBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target.result)
        reader.onerror = () => reject(new Error('Erro ao ler o arquivo'))
        reader.readAsDataURL(arquivo)
      })
    }
    const payload = {
      titulo: formData.titulo,
      descricao: formData.descricao,
      area: formData.area,
      professorId,
      tipoArquivo: formData.tipoArquivo,
      arquivoUrl: arquivoBase64,
      status: formData.status
    }
    try {
      let salvo
      if (editingId) {
        const res = await fetch(`https://learnwaveback2.onrender.com/api/materiais/${editingId}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        })
        if (!res.ok) throw new Error(await res.text())
        salvo = await res.json()
        setMateriais(materiais.map(m => m.id === editingId ? salvo : m))
      } else {
        const res = await fetch('https://learnwaveback2.onrender.com/api/materiais', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        })
        if (!res.ok) throw new Error(await res.text())
        salvo = await res.json()
        setMateriais([...materiais, salvo])
      }
    } catch (err) {
      alert('Erro ao salvar material: ' + err.message)
      return
    }
    setFormData({ titulo: '', descricao: '', area: '', tipoArquivo: 'PDF', arquivoUrl: '', status: 'PUBLICADO' })
    setArquivo(null)
    setShowForm(false)
    setEditingId(null)
  }

  const handleEdit = (material) => {
    setFormData({
      titulo: material.titulo || '',
      descricao: material.descricao || '',
      area: material.area || '',
      tipoArquivo: material.tipoArquivo || 'PDF',
      arquivoUrl: material.arquivoUrl || '',
      status: material.status || 'PUBLICADO'
    })
    setArquivo(null)
    setEditingId(material.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Mover para lixeira?')) return
    try {
      await fetch(`https://learnwaveback2.onrender.com/api/materiais/${id}`, { method: 'DELETE' })
    } catch (err) {
      console.error('Erro ao mover para lixeira:', err)
    }
