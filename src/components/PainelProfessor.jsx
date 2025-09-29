import { useState, useCallback } from 'react'
import { database } from '../utils/database'
import Modal from './Modal'

const AREAS = ['Gramática', 'Literatura', 'Redação', 'Interpretação de Texto', 'Ortografia', 'Fonética', 'Semântica', 'Estilística', 'Morfologia', 'Sintaxe', 'Pontuação', 'Versificação']

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
      case 'perfil':
        return <PerfilProfessor user={user} />
      case 'alunos':
        return <VisualizarAlunos />
      default:
        return <GerenciarAtividades atividades={atividades} setAtividades={setAtividades} />
    }
  }

  return (
    <div className="painel-professor">
      <h2>Painel do Professor - {user.nome}</h2>
      
      <div className="tabs" role="tablist" aria-label="Navegação do painel">
        <button 
          className={activeTab === 'atividades' ? 'active' : ''}
          onClick={() => setActiveTab('atividades')}
          role="tab"
          aria-selected={activeTab === 'atividades'}
          aria-controls="tab-content"
        >
          Atividades
        </button>
        <button 
          className={activeTab === 'videoaulas' ? 'active' : ''}
          onClick={() => setActiveTab('videoaulas')}
          role="tab"
          aria-selected={activeTab === 'videoaulas'}
          aria-controls="tab-content"
        >
          Videoaulas
        </button>
        <button 
          className={activeTab === 'materiais' ? 'active' : ''}
          onClick={() => setActiveTab('materiais')}
          role="tab"
          aria-selected={activeTab === 'materiais'}
          aria-controls="tab-content"
        >
          Materiais
        </button>
        <button 
          className={activeTab === 'progresso' ? 'active' : ''}
          onClick={() => setActiveTab('progresso')}
          role="tab"
          aria-selected={activeTab === 'progresso'}
          aria-controls="tab-content"
        >
          Progresso dos Alunos
        </button>
        <button 
          className={activeTab === 'lixeira' ? 'active' : ''}
          onClick={() => setActiveTab('lixeira')}
          role="tab"
          aria-selected={activeTab === 'lixeira'}
          aria-controls="tab-content"
        >
          Lixeira
        </button>
        <button 
          className={activeTab === 'alunos' ? 'active' : ''}
          onClick={() => setActiveTab('alunos')}
          role="tab"
          aria-selected={activeTab === 'alunos'}
          aria-controls="tab-content"
        >
          Perfis dos Alunos
        </button>
        <button 
          className={activeTab === 'perfil' ? 'active' : ''}
          onClick={() => setActiveTab('perfil')}
          role="tab"
          aria-selected={activeTab === 'perfil'}
          aria-controls="tab-content"
        >
          Meu Perfil
        </button>
      </div>

      <div className="tab-content" role="tabpanel" id="tab-content" aria-labelledby={`tab-${activeTab}`}>
        {renderContent()}
      </div>
    </div>
  )
}

function GerenciarAtividades({ atividades, setAtividades }) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ titulo: '', area: '', descricao: '', status: 'Rascunho', tipo: 'dissertativa', questoes: [] })

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    
    // Validação para múltipla escolha
    if (formData.tipo === 'multipla_escolha') {
      if (formData.questoes && formData.questoes.length > 0) {
        // Validar múltiplas questões
        for (let i = 0; i < formData.questoes.length; i++) {
          const q = formData.questoes[i]
          if (!q.pergunta || !q.opcaoA || !q.opcaoB || !q.opcaoC || !q.opcaoD || !q.respostaCorreta) {
            alert(`Questão ${i + 1}: Todos os campos são obrigatórios.`)
            return
          }
        }
      } else {
        // Validar questão única
        if (!formData.opcaoA || !formData.opcaoB || !formData.opcaoC || !formData.opcaoD || !formData.respostaCorreta) {
          alert('Para atividades de múltipla escolha, todas as opções e a resposta correta devem ser preenchidas.')
          return
        }
      }
    }
    
    let newAtividades
    if (editingId) {
      newAtividades = atividades.map(a => a.id === editingId ? { ...a, ...formData } : a)
    } else {
      const novaAtividade = { 
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now(), 
        ...formData, 
        excluido: false
      }
      newAtividades = [...atividades, novaAtividade]
    }
    setAtividades(newAtividades)
    localStorage.setItem('atividades', JSON.stringify(newAtividades))
    setFormData({ titulo: '', area: '', descricao: '', status: 'Rascunho', tipo: 'dissertativa', questoes: [] })
    setShowForm(false)
    setEditingId(null)
  }, [editingId, atividades, formData, setAtividades])

  const handleEdit = (atividade) => {
    setFormData(atividade)
    setEditingId(atividade.id)
    setShowForm(true)
  }

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null })

  const handleDelete = (id) => {
    setDeleteModal({ isOpen: true, id })
  }

  const confirmDelete = () => {
    const newAtividades = atividades.map(a => a.id === deleteModal.id ? { ...a, excluido: true } : a)
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

function GerenciarMateriais({ materiais, setMateriais }) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ titulo: '', area: '', tipo: 'PDF', arquivo: '' })

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
            {AREAS.map(area => <option key={area} value={area}>{area}</option>)}
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
    const notaNum = parseFloat(nota)
    if (isNaN(notaNum) || notaNum < 0 || notaNum > 10) {
      alert('Nota deve ser um número entre 0 e 10')
      return
    }
    try {
      const novasSubmissoes = submissoes.map(s => 
        s.id === submissaoId ? { ...s, nota: notaNum, status: 'corrigida' } : s
      )
      setSubmissoes(novasSubmissoes)
      localStorage.setItem('submissoes', JSON.stringify(novasSubmissoes))
    } catch (error) {
      alert('Erro ao salvar nota. Tente novamente.')
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

function PerfilProfessor({ user }) {
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
      <h3>Meu Perfil</h3>
      <form onSubmit={handleSubmit} className="form-perfil">
        <div className="foto-perfil-section">
          <div className="foto-preview">
            {previewFoto ? (
              <img src={previewFoto} alt="Foto de perfil" className="foto-perfil-img" />
            ) : (
              <div className="foto-placeholder">
                <span>📷</span>
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
      
      <AlterarSenhaProfessor userEmail={user.email} />
    </div>
  )
}
function VisualizarAlunos() {
  const [alunos] = useState(() => {
    try {
      const usuarios = JSON.parse(localStorage.getItem('learnwave_users') || '[]')
      return usuarios.filter(u => u.tipo === 'aluno')
    } catch {
      return []
    }
  })

  const obterPerfilAluno = (email) => {
    try {
      const perfil = JSON.parse(localStorage.getItem(`perfil_${email}`))
      return perfil || { apelido: '', bio: '', fotoPerfil: null }
    } catch {
      return { apelido: '', bio: '', fotoPerfil: null }
    }
  }

  return (
    <div className="visualizar-alunos">
      <h3>Perfis dos Alunos</h3>
      <div className="alunos-grid">
        {alunos.map(aluno => {
          const perfil = obterPerfilAluno(aluno.email)
          return (
            <div key={aluno.id} className="aluno-perfil-card">
              <div className="aluno-foto">
                {perfil.fotoPerfil ? (
                  <img src={perfil.fotoPerfil} alt="Foto do aluno" className="foto-aluno" />
                ) : (
                  <div className="foto-placeholder-aluno">
                    <span>A</span>
                  </div>
                )}
              </div>
              <div className="aluno-info">
                <h4>{perfil.apelido || aluno.nome}</h4>
                <p className="nome-real">{aluno.nome}</p>
                <p className="email-aluno">{aluno.email}</p>
                {perfil.bio && (
                  <div className="bio-aluno">
                    <strong>Bio:</strong>
                    <p>{perfil.bio}</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      {alunos.length === 0 && (
        <div className="sem-alunos">
          <p>Nenhum aluno cadastrado ainda.</p>
        </div>
      )}
    </div>
  )
}
function AlterarSenhaProfessor({ userEmail }) {
  const [senhaData, setSenhaData] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  })

  const handleChange = (e) => {
    setSenhaData({ ...senhaData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (senhaData.novaSenha !== senhaData.confirmarSenha) {
      alert('Nova senha e confirmação não coincidem!')
      return
    }

    if (senhaData.novaSenha.length < 6) {
      alert('Nova senha deve ter pelo menos 6 caracteres!')
      return
    }

    try {
      const usuarios = JSON.parse(localStorage.getItem('learnwave_users') || '[]')
      const usuarioIndex = usuarios.findIndex(u => u.email === userEmail)
      
      if (usuarioIndex === -1) {
        alert('Usuário não encontrado!')
        return
      }

      if (usuarios[usuarioIndex].senha !== senhaData.senhaAtual) {
        alert('Senha atual incorreta!')
        return
      }

      usuarios[usuarioIndex].senha = senhaData.novaSenha
      localStorage.setItem('learnwave_users', JSON.stringify(usuarios))
      
      setSenhaData({ senhaAtual: '', novaSenha: '', confirmarSenha: '' })
      alert('Senha alterada com sucesso!')
    } catch (error) {
      alert('Erro ao alterar senha. Tente novamente.')
    }
  }

  return (
    <div className="alterar-senha-section">
      <h4>🔒 Alterar Senha</h4>
      <form onSubmit={handleSubmit} className="form-senha">
        <div className="campo-perfil">
          <input
            type="password"
            name="senhaAtual"
            value={senhaData.senhaAtual}
            onChange={handleChange}
            placeholder="Senha atual"
            required
          />
        </div>
        <div className="campo-perfil">
          <input
            type="password"
            name="novaSenha"
            value={senhaData.novaSenha}
            onChange={handleChange}
            placeholder="Nova senha (mín. 6 caracteres)"
            required
          />
        </div>
        <div className="campo-perfil">
          <input
            type="password"
            name="confirmarSenha"
            value={senhaData.confirmarSenha}
            onChange={handleChange}
            placeholder="Confirmar nova senha"
            required
          />
        </div>
        <button type="submit" className="btn-alterar-senha">
          Alterar Senha
        </button>
      </form>
    </div>
  )
}

function FormularioQuestoes({ formData, setFormData }) {
  const adicionarQuestao = () => {
    const novaQuestao = {
      pergunta: '',
      opcaoA: '',
      opcaoB: '',
      opcaoC: '',
      opcaoD: '',
      respostaCorreta: ''
    }
    const questoesAtuais = formData.questoes || []
    setFormData({...formData, questoes: [...questoesAtuais, novaQuestao]})
  }

  const removerQuestao = (index) => {
    const novasQuestoes = formData.questoes.filter((_, i) => i !== index)
    setFormData({...formData, questoes: novasQuestoes})
  }

  const atualizarQuestao = (index, campo, valor) => {
    const novasQuestoes = [...formData.questoes]
    novasQuestoes[index] = {...novasQuestoes[index], [campo]: valor}
    setFormData({...formData, questoes: novasQuestoes})
  }

  return (
    <div className="formulario-questoes">
      <div className="questoes-header">
        <h4>Questões ({formData.questoes?.length || 0})</h4>
        <button type="button" onClick={adicionarQuestao} className="btn-adicionar">
          + Adicionar Questão
        </button>
      </div>
      
      {formData.questoes?.map((questao, index) => (
        <div key={index} className="questao-item">
          <div className="questao-header">
            <h5>Questão {index + 1}</h5>
            <button type="button" onClick={() => removerQuestao(index)} className="btn-remover">
              ×
            </button>
          </div>
          
          <input
            type="text"
            placeholder="Digite a pergunta"
            value={questao.pergunta || ''}
            onChange={(e) => atualizarQuestao(index, 'pergunta', e.target.value)}
            required
          />
          
          <div className="opcoes-grid">
            <input
              type="text"
              placeholder="Opção A"
              value={questao.opcaoA || ''}
              onChange={(e) => atualizarQuestao(index, 'opcaoA', e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Opção B"
              value={questao.opcaoB || ''}
              onChange={(e) => atualizarQuestao(index, 'opcaoB', e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Opção C"
              value={questao.opcaoC || ''}
              onChange={(e) => atualizarQuestao(index, 'opcaoC', e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Opção D"
              value={questao.opcaoD || ''}
              onChange={(e) => atualizarQuestao(index, 'opcaoD', e.target.value)}
              required
            />
          </div>
          
          <select
            value={questao.respostaCorreta || ''}
            onChange={(e) => atualizarQuestao(index, 'respostaCorreta', e.target.value)}
            required
          >
            <option value="">Resposta Correta</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>
      ))}
      
      {(!formData.questoes || formData.questoes.length === 0) && (
        <div className="opcoes-multipla">
          <h4>Questão Única</h4>
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
    </div>
  )
}

export default PainelProfessor