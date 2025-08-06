import { useState } from 'react'
import { database } from '../utils/database'

function PainelProfessor({ user, onNavigate }) {
  const [activeTab, setActiveTab] = useState('atividades')
  const [atividades, setAtividades] = useState(() => {
    const saved = localStorage.getItem('atividades')
    return saved ? JSON.parse(saved) : []
  })
  const [videoaulas, setVideoaulas] = useState(() => {
    const saved = localStorage.getItem('videoaulas')
    return saved ? JSON.parse(saved) : []
  })
  const [materiais, setMateriais] = useState(() => {
    const saved = localStorage.getItem('materiais')
    return saved ? JSON.parse(saved) : []
  })

  const renderContent = () => {
    switch (activeTab) {
      case 'atividades':
        return <GerenciarAtividades atividades={atividades} setAtividades={setAtividades} />
      case 'videoaulas':
        return <GerenciarVideoaulas videoaulas={videoaulas} setVideoaulas={setVideoaulas} />
      case 'materiais':
        return <GerenciarMateriais materiais={materiais} setMateriais={setMateriais} />
      case 'progresso':
        return <AcompanharProgresso />
      case 'lixeira':
        return <Lixeira atividades={atividades} setAtividades={setAtividades} videoaulas={videoaulas} setVideoaulas={setVideoaulas} materiais={materiais} setMateriais={setMateriais} />
      default:
        return <GerenciarAtividades atividades={atividades} setAtividades={setAtividades} />
    }
  }

  return (
    <div className="painel-professor">
      <h2>Painel do Professor - {user.nome}</h2>
      
      <div className="tabs">
        <button 
          className={activeTab === 'atividades' ? 'active' : ''}
          onClick={() => setActiveTab('atividades')}
        >
          Atividades
        </button>
        <button 
          className={activeTab === 'videoaulas' ? 'active' : ''}
          onClick={() => setActiveTab('videoaulas')}
        >
          Videoaulas
        </button>
        <button 
          className={activeTab === 'materiais' ? 'active' : ''}
          onClick={() => setActiveTab('materiais')}
        >
          Materiais
        </button>
        <button 
          className={activeTab === 'progresso' ? 'active' : ''}
          onClick={() => setActiveTab('progresso')}
        >
          Progresso dos Alunos
        </button>
        <button 
          className={activeTab === 'lixeira' ? 'active' : ''}
          onClick={() => setActiveTab('lixeira')}
        >
          Lixeira
        </button>
      </div>

      <div className="tab-content">
        {renderContent()}
      </div>
    </div>
  )
}

function GerenciarAtividades({ atividades, setAtividades }) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ titulo: '', area: '', descricao: '', status: 'Rascunho', tipo: 'dissertativa' })

  const areas = ['Gramática', 'Literatura', 'Redação', 'Interpretação de Texto', 'Ortografia', 'Fonética', 'Semântica', 'Estilística', 'Morfologia', 'Sintaxe', 'Pontuação', 'Versificação']

  const handleSubmit = (e) => {
    e.preventDefault()
    let newAtividades
    if (editingId) {
      newAtividades = atividades.map(a => a.id === editingId ? { ...a, ...formData } : a)
    } else {
      newAtividades = [...atividades, { id: Date.now(), ...formData, excluido: false }]
    }
    setAtividades(newAtividades)
    localStorage.setItem('atividades', JSON.stringify(newAtividades))
    setFormData({ titulo: '', area: '', descricao: '', status: 'Rascunho', tipo: 'dissertativa' })
    setShowForm(false)
    setEditingId(null)
  }

  const handleEdit = (atividade) => {
    setFormData(atividade)
    setEditingId(atividade.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (confirm('Mover para lixeira?')) {
      const newAtividades = atividades.map(a => a.id === id ? { ...a, excluido: true } : a)
      setAtividades(newAtividades)
      localStorage.setItem('atividades', JSON.stringify(newAtividades))
    }
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
            required
          />
          <select
            value={formData.area}
            onChange={(e) => setFormData({...formData, area: e.target.value})}
            required
          >
            <option value="">Área</option>
            {areas.map(area => <option key={area} value={area}>{area}</option>)}
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
            <div className="opcoes-multipla">
              <input
                type="text"
                placeholder="Opção A"
                value={formData.opcaoA || ''}
                onChange={(e) => setFormData({...formData, opcaoA: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Opção B"
                value={formData.opcaoB || ''}
                onChange={(e) => setFormData({...formData, opcaoB: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Opção C"
                value={formData.opcaoC || ''}
                onChange={(e) => setFormData({...formData, opcaoC: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Opção D"
                value={formData.opcaoD || ''}
                onChange={(e) => setFormData({...formData, opcaoD: e.target.value})}
                required
              />
              <select
                value={formData.respostaCorreta || ''}
                onChange={(e) => setFormData({...formData, respostaCorreta: e.target.value})}
                required
              >
                <option value="">Resposta Correta</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>
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
            <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setFormData({ titulo: '', area: '', descricao: '', status: 'Rascunho', tipo: 'dissertativa' }); }}>Cancelar</button>
          </div>
        </form>
      )}
      
      <div className="atividades-lista">
        {atividades.filter(a => !a.excluido).map(atividade => (
          <div key={atividade.id} className="atividade-item">
            <div>
              <h4>{atividade.titulo}</h4>
              <p>Área: {atividade.area} | Status: {atividade.status}</p>
              <p>{atividade.descricao}</p>
            </div>
            <div className="actions">
              <button onClick={() => handleEdit(atividade)}>Editar</button>
              <button onClick={() => handleDelete(atividade.id)}>Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function GerenciarVideoaulas({ videoaulas, setVideoaulas }) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ titulo: '', area: '', duracao: '', url: '' })

  const areas = ['Gramática', 'Literatura', 'Redação', 'Interpretação de Texto', 'Ortografia', 'Fonética', 'Semântica', 'Estilística', 'Morfologia', 'Sintaxe', 'Pontuação', 'Versificação']

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
            {areas.map(area => <option key={area} value={area}>{area}</option>)}
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

function GerenciarMateriais({ materiais, setMateriais }) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ titulo: '', area: '', tipo: 'PDF', arquivo: '' })

  const areas = ['Gramática', 'Literatura', 'Redação', 'Interpretação de Texto', 'Ortografia', 'Fonética', 'Semântica', 'Estilística', 'Morfologia', 'Sintaxe', 'Pontuação', 'Versificação']

  const handleSubmit = (e) => {
    e.preventDefault()
    let newMateriais
    if (editingId) {
      newMateriais = materiais.map(m => m.id === editingId ? { ...m, ...formData } : m)
    } else {
      newMateriais = [...materiais, { id: Date.now(), ...formData, excluido: false }]
    }
    setMateriais(newMateriais)
    localStorage.setItem('materiais', JSON.stringify(newMateriais))
    setFormData({ titulo: '', area: '', tipo: 'PDF', arquivo: '' })
    setShowForm(false)
    setEditingId(null)
  }

  const handleEdit = (material) => {
    setFormData(material)
    setEditingId(material.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (confirm('Mover para lixeira?')) {
      const newMateriais = materiais.map(m => m.id === id ? { ...m, excluido: true } : m)
      setMateriais(newMateriais)
      localStorage.setItem('materiais', JSON.stringify(newMateriais))
    }
  }

  return (
    <div className="gerenciar-materiais">
      <div className="header-actions">
        <h3>Gerenciar Materiais</h3>
        <button className="btn-primary" onClick={() => setShowForm(true)}>Novo Material</button>
      </div>
      
      {showForm && (
        <form onSubmit={handleSubmit} className="form-atividade">
          <input
            type="text"
            placeholder="Título do material"
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
            {areas.map(area => <option key={area} value={area}>{area}</option>)}
          </select>
          <select
            value={formData.tipo}
            onChange={(e) => setFormData({...formData, tipo: e.target.value})}
          >
            <option value="PDF">PDF</option>
            <option value="DOC">DOC</option>
            <option value="PPT">PPT</option>
          </select>
          <input
            type="text"
            placeholder="Nome do arquivo"
            value={formData.arquivo}
            onChange={(e) => setFormData({...formData, arquivo: e.target.value})}
            required
          />
          <div className="form-actions">
            <button type="submit">{editingId ? 'Atualizar' : 'Criar'}</button>
            <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setFormData({ titulo: '', area: '', tipo: 'PDF', arquivo: '' }); }}>Cancelar</button>
          </div>
        </form>
      )}
      
      <div className="atividades-lista">
        {materiais.filter(m => !m.excluido).map(material => (
          <div key={material.id} className="atividade-item">
            <div>
              <h4>{material.titulo}</h4>
              <p>Área: {material.area} | Tipo: {material.tipo}</p>
              <p>Arquivo: {material.arquivo}</p>
            </div>
            <div className="actions">
              <button onClick={() => handleEdit(material)}>Editar</button>
              <button onClick={() => handleDelete(material.id)}>Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AcompanharProgresso() {
  const [submissoes, setSubmissoes] = useState(() => {
    return JSON.parse(localStorage.getItem('submissoes')) || []
  })
  const [usuarios] = useState(() => {
    return database.listarUsuarios().filter(u => u.tipo === 'aluno')
  })

  const darNota = (submissaoId, nota) => {
    if (nota >= 0 && nota <= 10) {
      const novasSubmissoes = submissoes.map(s => 
        s.id === submissaoId ? { ...s, nota: parseFloat(nota), status: 'corrigida' } : s
      )
      setSubmissoes(novasSubmissoes)
      localStorage.setItem('submissoes', JSON.stringify(novasSubmissoes))
    }
  }

  const submissoesPendentes = submissoes.filter(s => s.status === 'pendente')

  return (
    <div className="acompanhar-progresso">
      <h3>Progresso de Todos os Alunos</h3>
      
      <div className="secao-correcao">
        <h4>Alunos Cadastrados ({usuarios.length})</h4>
        {usuarios.map(aluno => {
          const submissoesAluno = submissoes.filter(s => s.alunoEmail === aluno.email)
          const notaMedia = submissoesAluno.length > 0 
            ? (submissoesAluno.filter(s => s.nota).reduce((acc, s) => acc + s.nota, 0) / submissoesAluno.filter(s => s.nota).length).toFixed(1)
            : 0
          
          return (
            <div key={aluno.id} className="aluno-progresso">
              <h5>{aluno.nome} ({aluno.email})</h5>
              <p>Atividades realizadas: {submissoesAluno.length}</p>
              <p>Nota média: {notaMedia}</p>
            </div>
          )
        })}
      </div>

      <div className="secao-correcao">
        <h4>Pendentes de Correção ({submissoesPendentes.length})</h4>
        {submissoesPendentes.map(submissao => (
          <div key={submissao.id} className="submissao-item">
            <div className="submissao-info">
              <h5>Atividade: {submissao.atividadeId}</h5>
              <p><strong>Aluno:</strong> {submissao.alunoNome}</p>
              <p><strong>Resposta:</strong> {submissao.resposta}</p>
            </div>
            <div className="correcao-actions">
              <input 
                type="number" 
                min="0" 
                max="10" 
                step="0.1" 
                placeholder="Nota (0-10)"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    darNota(submissao.id, e.target.value)
                    e.target.value = ''
                  }
                }}
              />
              <button onClick={(e) => {
                const input = e.target.previousElementSibling
                darNota(submissao.id, input.value)
                input.value = ''
              }}>Dar Nota</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Lixeira({ atividades, setAtividades, videoaulas, setVideoaulas, materiais, setMateriais }) {
  const [activeType, setActiveType] = useState('atividades')

  const restaurarAtividade = (id) => {
    const newAtividades = atividades.map(a => a.id === id ? { ...a, excluido: false } : a)
    setAtividades(newAtividades)
    localStorage.setItem('atividades', JSON.stringify(newAtividades))
  }

  const restaurarVideoaula = (id) => {
    const newVideoaulas = videoaulas.map(v => v.id === id ? { ...v, excluido: false } : v)
    setVideoaulas(newVideoaulas)
    localStorage.setItem('videoaulas', JSON.stringify(newVideoaulas))
  }

  const restaurarMaterial = (id) => {
    const newMateriais = materiais.map(m => m.id === id ? { ...m, excluido: false } : m)
    setMateriais(newMateriais)
    localStorage.setItem('materiais', JSON.stringify(newMateriais))
  }

  const renderContent = () => {
    switch (activeType) {
      case 'atividades':
        return atividades.filter(a => a.excluido).map(atividade => (
          <div key={atividade.id} className="atividade-item">
            <div>
              <h4>{atividade.titulo}</h4>
              <p>Área: {atividade.area} | Status: {atividade.status}</p>
            </div>
            <button onClick={() => restaurarAtividade(atividade.id)}>Restaurar</button>
          </div>
        ))
      case 'videoaulas':
        return videoaulas.filter(v => v.excluido).map(video => (
          <div key={video.id} className="atividade-item">
            <div>
              <h4>{video.titulo}</h4>
              <p>Área: {video.area} | Duração: {video.duracao}</p>
            </div>
            <button onClick={() => restaurarVideoaula(video.id)}>Restaurar</button>
          </div>
        ))
      case 'materiais':
        return materiais.filter(m => m.excluido).map(material => (
          <div key={material.id} className="atividade-item">
            <div>
              <h4>{material.titulo}</h4>
              <p>Área: {material.area} | Tipo: {material.tipo}</p>
            </div>
            <button onClick={() => restaurarMaterial(material.id)}>Restaurar</button>
          </div>
        ))
      default:
        return null
    }
  }

  return (
    <div className="lixeira">
      <h3>Lixeira</h3>
      <div className="lixeira-tabs">
        <button 
          className={activeType === 'atividades' ? 'active' : ''}
          onClick={() => setActiveType('atividades')}
        >
          Atividades ({atividades.filter(a => a.excluido).length})
        </button>
        <button 
          className={activeType === 'videoaulas' ? 'active' : ''}
          onClick={() => setActiveType('videoaulas')}
        >
          Videoaulas ({videoaulas.filter(v => v.excluido).length})
        </button>
        <button 
          className={activeType === 'materiais' ? 'active' : ''}
          onClick={() => setActiveType('materiais')}
        >
          Materiais ({materiais.filter(m => m.excluido).length})
        </button>
      </div>
      <div className="lixeira-content">
        {renderContent()}
      </div>
    </div>
  )
}

export default PainelProfessor