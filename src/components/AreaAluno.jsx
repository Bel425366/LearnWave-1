import { useState, useEffect } from 'react'
import Mascot from './Mascot'
import PasswordValidator from './PasswordValidator'

const SENHA_FORTE = (pwd) =>
  pwd.length >= 8 &&
  /[A-Z]/.test(pwd) &&
  /[a-z]/.test(pwd) &&
  /\d/.test(pwd) &&
  /[!@#$%^&*(),.?":{}|<>]/.test(pwd)

function AreaAluno({ user, onNavigate }) {
  const [activeTab, setActiveTab] = useState('atividades')
  const [atividadeAtual, setAtividadeAtual] = useState(null)
  const [perfilData, setPerfilData] = useState(() => {
    try {
      const saved = localStorage.getItem(`perfil_${user.email}`)
      return saved ? JSON.parse(saved) : { apelido: user.nome, bio: '', fotoPerfil: null }
    } catch {
      return { apelido: user.nome, bio: '', fotoPerfil: null }
    }
  })
  const [progressoAluno, setProgressoAluno] = useState(() => {
    try {
      const saved = localStorage.getItem(`progresso_${user.email}`)
      return saved ? JSON.parse(saved) : {
        atividadesConcluidas: [], videoaulasAssistidas: [], materiaisBaixados: [], notas: {}
      }
    } catch {
      return { atividadesConcluidas: [], videoaulasAssistidas: [], materiaisBaixados: [], notas: {} }
    }
  })

  const [todasAtividades, setTodasAtividades] = useState([])
  const [professores, setProfessores] = useState([])

  useEffect(() => {
    fetch('https://learnwaveback2.onrender.com/api/atividades')
      .then(r => r.json())
      .then(data => setTodasAtividades(data))
      .catch(() => {
        const local = JSON.parse(localStorage.getItem('atividades') || '[]').filter(a => !a.excluido)
        setTodasAtividades(local)
      })
    fetch('https://learnwaveback2.onrender.com/api/usuarios/professores/aprovados')
      .then(r => r.json())
      .then(data => setProfessores(data))
      .catch(() => {})
  }, [])

  useEffect(() => {
    localStorage.setItem(`progresso_${user.email}`, JSON.stringify(progressoAluno))
  }, [progressoAluno, user.email])

  useEffect(() => {
    localStorage.setItem(`perfil_${user.email}`, JSON.stringify(perfilData))
  }, [perfilData, user.email])

  const enviarAtividade = (resposta) => {
    let notaAutomatica = null
    let statusAutomatico = 'pendente'

    try {
      const submissoes = JSON.parse(localStorage.getItem('submissoes')) || []

      const conteudo = (() => {
        try { return atividadeAtual.conteudo ? JSON.parse(atividadeAtual.conteudo) : {} }
        catch { return {} }
      })()
      const tipo = conteudo.tipo || atividadeAtual.tipo || 'dissertativa'
      const questoes = conteudo.questoes?.length > 0 ? conteudo.questoes : []

      if (tipo === 'multipla_escolha') {
        if (questoes.length > 0) {
          const respostasAluno = JSON.parse(resposta)
          const acertos = questoes.filter((q, i) => respostasAluno[i] === q.respostaCorreta).length
          notaAutomatica = parseFloat(((acertos / questoes.length) * 10).toFixed(1))
        } else {
          notaAutomatica = resposta === conteudo.respostaCorreta ? 10 : 0
        }
        statusAutomatico = 'corrigida'
      }

      submissoes.push({
        id: Date.now(),
        atividadeId: atividadeAtual.id,
        alunoEmail: user.email,
        alunoNome: user.nome,
        resposta: statusAutomatico === 'pendente' ? resposta : null,
        data: new Date().toLocaleString(),
        status: statusAutomatico,
        nota: notaAutomatica
      })
      localStorage.setItem('submissoes', JSON.stringify(submissoes))
    } catch {
      alert('Erro ao enviar atividade. Tente novamente.')
      return
    }
    setProgressoAluno(prev => ({
      ...prev,
      atividadesConcluidas: [...prev.atividadesConcluidas, atividadeAtual.id]
    }))
    setAtividadeAtual(null)
    if (notaAutomatica !== null) {
      alert(`Atividade corrigida automaticamente! Sua nota: ${notaAutomatica}`)
    } else {
      alert('Atividade enviada! Aguarde a correção do professor.')
    }
  }

  const marcarVideoaulaAssistida = (videoId) => {
    setProgressoAluno(prev => ({
      ...prev,
      videoaulasAssistidas: [...prev.videoaulasAssistidas, videoId]
    }))
  }

  const baixarMaterial = (materialId) => {
    setProgressoAluno(prev => ({
      ...prev,
      materiaisBaixados: [...prev.materiaisBaixados, materialId]
    }))
  }

  const salvarPerfil = async (novosDados) => {
    try {
      console.log('user.id:', user.id, '| novo nome:', novosDados.apelido)
      const response = await fetch(`https://learnwaveback2.onrender.com/api/usuarios/${user.id}/nome?nome=${encodeURIComponent(novosDados.apelido)}`, {
        method: 'PATCH'
      })
      console.log('resposta status:', response.status)
      if (!response.ok) throw new Error(await response.text())
      setPerfilData(novosDados)
      alert('Perfil atualizado com sucesso!')
      window.dispatchEvent(new Event('storage'))
    } catch (err) {
      console.error('Erro ao salvar perfil:', err)
      setPerfilData(novosDados)
      alert('Erro ao salvar no servidor: ' + err.message)
      window.dispatchEvent(new Event('storage'))
    }
  }

  const atividadesAtivas = todasAtividades.filter(a => a.situacao === 'ativo' || !a.situacao)

  const submissoes = JSON.parse(localStorage.getItem('submissoes')) || []
  const minhasSubmissoes = submissoes.filter(s =>
    s.alunoEmail === user.email &&
    s.nota !== null &&
    atividadesAtivas.some(a => a.id === s.atividadeId)
  )
  const notaMedia = minhasSubmissoes.length > 0
    ? (minhasSubmissoes.reduce((acc, s) => acc + s.nota, 0) / minhasSubmissoes.length).toFixed(1)
    : '—'

  const notaMediaPorProfessor = (professorId) => {
    const atividadesProf = atividadesAtivas.filter(a => a.professorId === professorId)
    const submissoesProf = minhasSubmissoes.filter(s => atividadesProf.some(a => a.id === s.atividadeId))
    return submissoesProf.length > 0
      ? (submissoesProf.reduce((acc, s) => acc + s.nota, 0) / submissoesProf.length).toFixed(1)
      : '—'
  }

  const mensagensPorAba = {
    atividades: 'Vamos lá! Você consegue fazer todas as atividades!',
    videoaulas: 'Hora de aprender algo novo. Bora assistir!',
    materiais: 'Baixe os materiais e estude no seu ritmo!',
    progresso: `Olha quanto você já evoluiu! Continue assim!`,
    perfil: 'Personalize seu perfil e mostre quem você é!',
  }

  const tabs = [
    { id: 'atividades', label: 'Atividades', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg> },
    { id: 'videoaulas', label: 'Videoaulas', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg> },
    { id: 'materiais', label: 'Materiais', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
    { id: 'progresso', label: 'Progresso', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
    { id: 'perfil', label: 'Perfil', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  ]

  if (atividadeAtual) {
    return <FazerAtividade atividade={atividadeAtual} onEnviar={enviarAtividade} onVoltar={() => setAtividadeAtual(null)} />
  }

  const primeiroNome = (perfilData.apelido || user.nome).split(' ')[0]
  const iniciais = (perfilData.apelido || user.nome).split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="painel-novo" style={{ position: 'relative' }}>
      {/* Hero */}
      <div className="painel-hero painel-hero--aluno">
        <div className="painel-hero-avatar">
          {perfilData.fotoPerfil
            ? <img src={perfilData.fotoPerfil} alt="foto" />
            : iniciais}
        </div>
        <div className="painel-hero-info">
          <h2>Olá, {primeiroNome}</h2>
          <p>{user.email}</p>
        </div>
        <div className="painel-hero-stats">
          <div className="painel-stat">
            <span className="painel-stat-val">{progressoAluno.atividadesConcluidas.filter(id => atividadesAtivas.some(a => a.id === id)).length}</span>
            <span className="painel-stat-lbl">Atividades</span>
          </div>
          <div className="painel-stat">
            <span className="painel-stat-val">{progressoAluno.videoaulasAssistidas.length}</span>
            <span className="painel-stat-lbl">Videoaulas</span>
          </div>
          <div className="painel-stat">
            <span className="painel-stat-val">{notaMedia}</span>
            <span className="painel-stat-lbl">Média</span>
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
        {activeTab === 'atividades' && (
          <TabAtividades
            atividades={atividadesAtivas}
            professores={professores}
            progressoAluno={progressoAluno}
            userEmail={user.email}
            onAbrirAtividade={setAtividadeAtual}
          />
        )}
        {activeTab === 'videoaulas' && (
          <TabVideoaulas
            professores={professores}
            progressoAluno={progressoAluno}
            onMarcar={marcarVideoaulaAssistida}
          />
        )}
        {activeTab === 'materiais' && (
          <TabMateriais
            professores={professores}
            progressoAluno={progressoAluno}
            onBaixar={baixarMaterial}
          />
        )}
        {activeTab === 'progresso' && (
          <TabProgresso
            progressoAluno={progressoAluno}
            todasAtividades={atividadesAtivas}
            minhasSubmissoes={minhasSubmissoes}
            notaMedia={notaMedia}
            professores={professores}
            notaMediaPorProfessor={notaMediaPorProfessor}
          />
        )}
        {activeTab === 'perfil' && (
          <PerfilAluno perfilData={perfilData} onSalvar={salvarPerfil} user={user} />
        )}
      </div>
    </div>
  )
}

function TabAtividades({ atividades, professores, progressoAluno, userEmail, onAbrirAtividade }) {
  const publicadas = atividades.filter(a => (a.status === 'Publicada' || a.status === 'PUBLICADO') && a.situacao !== 'lixeira' && a.situacao !== 'excluido')
  const submissoes = JSON.parse(localStorage.getItem('submissoes')) || []
  const [professorSelecionado, setProfessorSelecionado] = useState(null)

  const professoresComAtividades = professores.filter(p =>
    publicadas.some(a => a.professorId === p.id)
  )

  if (professorSelecionado) {
    const atividadesDoProf = publicadas.filter(a => a.professorId === professorSelecionado.id)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button
          onClick={() => setProfessorSelecionado(null)}
          style={{ alignSelf: 'flex-start', background: 'none', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '0.4rem 0.9rem', cursor: 'pointer', color: 'inherit', marginBottom: '0.5rem' }}
        >
          ← Voltar aos professores
        </button>
        <h3 style={{ margin: '0 0 0.75rem', opacity: 0.9 }}>Atividades de {professorSelecionado.nome}</h3>
        <div className="aluno-grid">
          {atividadesDoProf.map(atividade => {
            const minhaSubmissao = submissoes.find(s => s.atividadeId === atividade.id && s.alunoEmail === userEmail)
            return (
              <div key={atividade.id} className="aluno-card">
                <div className="aluno-card-header">
                  <span className="aluno-card-tag">{atividade.area}</span>
                  {minhaSubmissao && (
                    <span className={`aluno-badge ${minhaSubmissao.status === 'pendente' ? 'badge-pendente' : 'badge-ok'}`}>
                      {minhaSubmissao.status === 'pendente' ? 'Aguardando correção' : 'Corrigida'}
                    </span>
                  )}
                </div>
                <h3 className="aluno-card-title">{atividade.titulo}</h3>
                <p className="aluno-card-desc">{atividade.descricao}</p>
                {minhaSubmissao ? (
                  minhaSubmissao.nota !== null && (
                    <div className="aluno-nota">Nota: <strong>{minhaSubmissao.nota}</strong></div>
                  )
                ) : (
                  <button className="aluno-btn" onClick={() => onAbrirAtividade(atividade)}>
                    Fazer atividade
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (professoresComAtividades.length === 0) {
    return <EstadoVazio mensagem="Nenhuma atividade disponível no momento." />
  }

  return (
    <div className="aluno-grid">
      {professoresComAtividades.map(prof => {
        const qtd = publicadas.filter(a => a.professorId === prof.id).length
        return (
          <div key={prof.id} className="aluno-card" style={{ cursor: 'pointer' }} onClick={() => setProfessorSelecionado(prof)}>
            <div className="aluno-card-header">
              <span className="aluno-card-tag">Professor</span>
              <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{qtd} atividade{qtd !== 1 ? 's' : ''}</span>
            </div>
            <h3 className="aluno-card-title">{prof.nome}</h3>
            {prof.areaEnsino && <p className="aluno-card-desc">{prof.areaEnsino}</p>}
            <span className="aluno-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.5rem' }}>
              Ver atividades
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </span>
          </div>
        )
      })}
    </div>
  )
}

function TabVideoaulas({ professores, progressoAluno, onMarcar }) {
  const [professorSelecionado, setProfessorSelecionado] = useState(null)
  const [videoaulas, setVideoaulas] = useState([])
  const [loading, setLoading] = useState(false)
  const [professoresComVideo, setProfessoresComVideo] = useState([])
  const [loadingProfessores, setLoadingProfessores] = useState(true)

  // Extrair ID do YouTube a partir de uma URL
  const getYoutubeId = (url) => {
    if (!url) return null
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  // Gerar thumbnail do YouTube
  const getYoutubeThumbnail = (url) => {
    const id = getYoutubeId(url)
    return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null
  }

  useEffect(() => {
    const verificar = async () => {
      setLoadingProfessores(true)
      const resultado = []

      // Tentar buscar da API para cada professor
      await Promise.all(professores.map(async (prof) => {
        try {
          const res = await fetch(`https://learnwaveback2.onrender.com/api/videoaulas/professor/${prof.id}`)
          if (res.ok) {
            const data = await res.json()
            const temPublicado = Array.isArray(data) && data.some(v =>
              (v.status === 'PUBLICADO' || v.status === 'publicado') && v.situacao !== 'lixeira' && v.situacao !== 'excluido' && !v.excluido
            )
            if (temPublicado) resultado.push(prof)
          }
        } catch {
          // API não disponível — fallback para localStorage
        }
      }))

      // Fallback: se a API não retornou nada, verificar localStorage
      if (resultado.length === 0) {
        try {
          const locais = JSON.parse(localStorage.getItem('videoaulas') || '[]')
          const videoaulasAtivas = locais.filter(v => !v.excluido)
          if (videoaulasAtivas.length > 0) {
            // Agrupar por professorId e verificar quais professores têm videoaulas
            const profIds = [...new Set(videoaulasAtivas.map(v => v.professorId).filter(Boolean))]
            profIds.forEach(pid => {
              const prof = professores.find(p => p.id === pid)
              if (prof && !resultado.find(r => r.id === pid)) resultado.push(prof)
            })
            // Se não tem professorId, mostrar todas como "geral"
            if (profIds.length === 0 && videoaulasAtivas.length > 0) {
              // Adicionar todos os professores que existem como fallback
              professores.forEach(p => {
                if (!resultado.find(r => r.id === p.id)) resultado.push(p)
              })
            }
          }
        } catch {}
      }

      setProfessoresComVideo(resultado)
      setLoadingProfessores(false)
    }

    if (professores.length > 0) verificar()
    else setLoadingProfessores(false)
  }, [professores])

  const selecionarProfessor = async (prof) => {
    setProfessorSelecionado(prof)
    setLoading(true)
    try {
      const res = await fetch(`https://learnwaveback2.onrender.com/api/videoaulas/professor/${prof.id}`)
      if (res.ok) {
        const data = await res.json()
        setVideoaulas(
          Array.isArray(data)
            ? data.filter(v => (v.status === 'PUBLICADO' || v.status === 'publicado') && v.situacao !== 'lixeira' && v.situacao !== 'excluido' && !v.excluido)
            : []
        )
      } else {
        throw new Error('API indisponível')
      }
    } catch {
      // Fallback para localStorage
      try {
        const locais = JSON.parse(localStorage.getItem('videoaulas') || '[]')
        setVideoaulas(locais.filter(v => !v.excluido && (v.professorId === prof.id || !v.professorId)))
      } catch {
        setVideoaulas([])
      }
    } finally {
      setLoading(false)
    }
  }

  if (professorSelecionado) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button
          onClick={() => { setProfessorSelecionado(null); setVideoaulas([]) }}
          style={{ alignSelf: 'flex-start', background: 'none', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '0.4rem 0.9rem', cursor: 'pointer', color: 'inherit', marginBottom: '0.5rem' }}
        >
          ← Voltar aos professores
        </button>
        <h3 style={{ margin: '0 0 0.75rem', opacity: 0.9 }}>Videoaulas de {professorSelecionado.nome}</h3>
        {loading && <p style={{ opacity: 0.6 }}>Carregando videoaulas...</p>}
        {!loading && videoaulas.length === 0 && <EstadoVazio mensagem="Nenhuma videoaula publicada ainda." />}
        {!loading && videoaulas.length > 0 && (
          <div className="aluno-grid">
            {videoaulas.map(video => {
              const assistida = progressoAluno.videoaulasAssistidas.includes(video.id)
              const thumbnail = getYoutubeThumbnail(video.url)
              const youtubeId = getYoutubeId(video.url)
              return (
                <div key={video.id} className="aluno-card">
                  {thumbnail && (
                    <div style={{ borderRadius: '10px', overflow: 'hidden', marginBottom: '0.75rem', position: 'relative' }}>
                      <img
                        src={thumbnail}
                        alt={video.titulo}
                        style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }}
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', opacity: 0, transition: 'opacity 0.2s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.opacity = 1 }}
                        onMouseLeave={(e) => { e.currentTarget.style.opacity = 0 }}
                      >
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="white" opacity="0.9"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      </div>
                    </div>
                  )}
                  <div className="aluno-card-header">
                    <span className="aluno-card-tag">{video.area || 'Videoaula'}</span>
                    {assistida && <span className="aluno-badge badge-ok">Assistida</span>}
                  </div>
                  <h3 className="aluno-card-title">{video.titulo}</h3>
                  {video.descricao && <p className="aluno-card-desc">{video.descricao}</p>}
                  {video.duracao && <p className="aluno-card-meta">Duração: {video.duracao}</p>}
                  <div className="aluno-card-actions">
                    <a
                      href={youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="aluno-btn aluno-btn-outline"
                    >
                      Assistir
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </a>
                    {!assistida && (
                      <button className="aluno-btn" onClick={() => onMarcar(video.id)}>
                        Marcar como assistida
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  if (loadingProfessores) {
    return <EstadoVazio mensagem="Carregando videoaulas..." />
  }

  if (professoresComVideo.length === 0) {
    return <EstadoVazio mensagem="Nenhuma videoaula disponível no momento." />
  }

  return (
    <div className="aluno-grid">
      {professoresComVideo.map(prof => (
        <div key={prof.id} className="aluno-card" style={{ cursor: 'pointer' }} onClick={() => selecionarProfessor(prof)}>
          <div className="aluno-card-header">
            <span className="aluno-card-tag">Professor</span>
          </div>
          <h3 className="aluno-card-title">{prof.nome}</h3>
          {prof.areaEnsino && <p className="aluno-card-desc">{prof.areaEnsino}</p>}
          <span className="aluno-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.5rem' }}>
            Ver videoaulas
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </span>
        </div>
      ))}
    </div>
  )
}

function TabMateriais({ professores, progressoAluno, onBaixar }) {
  const [professorSelecionado, setProfessorSelecionado] = useState(null)
  const [materiais, setMateriais] = useState([])
  const [loading, setLoading] = useState(false)
  const [areasAbertas, setAreasAbertas] = useState({})
  const [professoresComMaterial, setProfessoresComMaterial] = useState([])
  const [loadingProfessores, setLoadingProfessores] = useState(true)
  const toggleArea = (area) => setAreasAbertas(prev => ({ ...prev, [area]: !prev[area] }))

  useEffect(() => {
    const verificar = async () => {
      setLoadingProfessores(true)
      const resultado = []
      await Promise.all(professores.map(async (prof) => {
        try {
          const res = await fetch(`https://learnwaveback2.onrender.com/api/materiais/professor/${prof.id}`)
          const data = await res.json()
          const temPublicado = data.some(m => (m.status === 'PUBLICADO' || m.status === 'publicado') && m.situacao !== 'lixeira' && m.situacao !== 'excluido')
          if (temPublicado) resultado.push(prof)
        } catch {}
      }))
      setProfessoresComMaterial(resultado)
      setLoadingProfessores(false)
    }
    if (professores.length > 0) verificar()
    else setLoadingProfessores(false)
  }, [professores])

  const selecionarProfessor = async (prof) => {
    setProfessorSelecionado(prof)
    setAreasAbertas({})
    setLoading(true)
    try {
      const res = await fetch(`https://learnwaveback2.onrender.com/api/materiais/professor/${prof.id}`)
      const data = await res.json()
      setMateriais(data.filter(m => (m.status === 'PUBLICADO' || m.status === 'publicado') && m.situacao !== 'lixeira' && m.situacao !== 'excluido'))
    } catch {
      setMateriais([])
    } finally {
      setLoading(false)
    }
  }

  if (professorSelecionado) {
    const porArea = materiais.reduce((acc, m) => {
      acc[m.area] = acc[m.area] || []
      acc[m.area].push(m)
      return acc
    }, {})

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button onClick={() => { setProfessorSelecionado(null); setMateriais([]) }} style={{ alignSelf: 'flex-start', background: 'none', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '0.4rem 0.9rem', cursor: 'pointer', color: 'inherit', marginBottom: '0.5rem' }}>
          ← Voltar aos professores
        </button>
        <h3 style={{ margin: '0 0 0.75rem', opacity: 0.9 }}>Materiais de {professorSelecionado.nome}</h3>
        {loading && <p style={{ opacity: 0.6 }}>Carregando...</p>}
        {!loading && materiais.length === 0 && <EstadoVazio mensagem="Nenhum material publicado ainda." />}
        {!loading && Object.entries(porArea).map(([area, itens]) => {
          const aberta = areasAbertas[area] === true
          return (
            <div key={area} style={{ marginBottom: '0.5rem' }}>
              <button onClick={() => toggleArea(area)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: aberta ? '8px 8px 0 0' : '8px', cursor: 'pointer', color: 'inherit', fontSize: '1rem', fontWeight: 600 }}>
                <span>{area} <span style={{ fontWeight: 400, opacity: 0.6, fontSize: '0.85rem' }}>({itens.length})</span></span>
                <span>{aberta ? '▲' : '▼'}</span>
              </button>
              {aberta && (
                <div style={{ border: '1px solid rgba(255,255,255,0.1)', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '0.5rem' }} className="aluno-grid">
                  {itens.map(material => {
                    const baixado = progressoAluno.materiaisBaixados.includes(material.id)
                    return (
                      <div key={material.id} className="aluno-card">
                        <div className="aluno-card-header">
                          <span className="aluno-card-tag">{material.tipoArquivo}</span>
                          {baixado && <span className="aluno-badge badge-ok">Baixado</span>}
                        </div>
                        <h3 className="aluno-card-title">{material.titulo}</h3>
                        {material.descricao && <p className="aluno-card-desc">{material.descricao}</p>}
                        {material.arquivoUrl && (
                          <a
                            href={material.arquivoUrl}
                            download={`${material.titulo}.${(material.tipoArquivo || 'pdf').toLowerCase()}`}
                            className="aluno-btn"
                            onClick={() => onBaixar(material.id)}
                          >
                            Baixar
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                          </a>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  const professoresComMateriais = professoresComMaterial

  if (loadingProfessores) {
    return <EstadoVazio mensagem="Carregando materiais..." />
  }

  if (professoresComMateriais.length === 0) {
    return <EstadoVazio mensagem="Nenhum material disponível no momento." />
  }

  return (
    <div className="aluno-grid">
      {professoresComMateriais.map(prof => (
        <div key={prof.id} className="aluno-card" style={{ cursor: 'pointer' }} onClick={() => selecionarProfessor(prof)}>
          <div className="aluno-card-header">
            <span className="aluno-card-tag">Professor</span>
          </div>
          <h3 className="aluno-card-title">{prof.nome}</h3>
          {prof.areaEnsino && <p className="aluno-card-desc">{prof.areaEnsino}</p>}
          <span className="aluno-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.5rem' }}>
            Ver materiais
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </span>
        </div>
      ))}
    </div>
  )
}

function TabProgresso({ progressoAluno, todasAtividades, minhasSubmissoes, notaMedia, professores, notaMediaPorProfessor }) {
  const atividadesConcluidasAtivas = progressoAluno.atividadesConcluidas.filter(id =>
    todasAtividades.some(a => a.id === id)
  )

  const stats = [
    { val: atividadesConcluidasAtivas.length, lbl: 'Atividades concluídas' },
    { val: progressoAluno.videoaulasAssistidas.length, lbl: 'Videoaulas assistidas' },
    { val: progressoAluno.materiaisBaixados.length, lbl: 'Materiais baixados' },
    { val: notaMedia, lbl: 'Média geral' },
  ]

  const professoresComNota = professores.filter(p => notaMediaPorProfessor(p.id) !== '—')

  return (
    <div>
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <h4>{s.lbl}</h4>
            <p>{s.val}</p>
          </div>
        ))}
      </div>

      {professoresComNota.length > 0 && (
        <div className="detalhes-progresso" style={{ marginBottom: '1.5rem' }}>
          <h4>Média por professor</h4>
          {professoresComNota.map(prof => (
            <div key={prof.id} className="atividade-concluida">
              <span>{prof.nome}</span>
              <span>Média: {notaMediaPorProfessor(prof.id)}</span>
            </div>
          ))}
        </div>
      )}

      {minhasSubmissoes.length > 0 && (
        <div className="detalhes-progresso">
          <h4>Atividades corrigidas</h4>
          {minhasSubmissoes.map(submissao => {
            const atividade = todasAtividades.find(a => a.id === submissao.atividadeId)
            return atividade ? (
              <div key={submissao.id} className="atividade-concluida">
                <span>{atividade.titulo}</span>
                <span>Nota: {submissao.nota}</span>
              </div>
            ) : null
          })}
        </div>
      )}
    </div>
  )
}

function EstadoVazio({ mensagem }) {
  return (
    <div className="no-activities">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.4, marginBottom: '1rem' }}>
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <p style={{ margin: 0 }}>{mensagem}</p>
    </div>
  )
}

function PerfilAluno({ perfilData, onSalvar, user }) {
  const [formData, setFormData] = useState(perfilData || { apelido: '', bio: '', fotoPerfil: null })
  const [previewFoto, setPreviewFoto] = useState(perfilData?.fotoPerfil || null)

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

  const iniciais = (formData.apelido || user.nome).split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="perfil-aluno">
      <form onSubmit={(e) => { e.preventDefault(); onSalvar(formData) }} className="form-perfil">
        <div className="foto-perfil-section">
          <div className="foto-preview" style={{ width: 100, height: 100, fontSize: '1.8rem', fontWeight: 700, color: 'white', background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
            {previewFoto
              ? <img src={previewFoto} alt="Foto de perfil" className="foto-perfil-img" />
              : iniciais}
          </div>
          <input type="file" id="fotoPerfil" accept="image/*" onChange={handleFotoChange} className="foto-input" />
          <label htmlFor="fotoPerfil" className="btn-foto">
            {previewFoto ? 'Alterar foto' : 'Adicionar foto'}
          </label>
        </div>

        <div className="campo-perfil">
          <label>Apelido</label>
          <input
            type="text"
            value={formData.apelido}
            onChange={(e) => setFormData({ ...formData, apelido: e.target.value })}
            placeholder="Como você gostaria de ser chamado?"
            maxLength="30"
            required
          />
        </div>

        <div className="campo-perfil">
          <label>Bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Conte um pouco sobre você..."
            maxLength="200"
            rows="4"
          />
          <small>{formData.bio?.length || 0}/200 caracteres</small>
        </div>

        <button type="submit" className="btn-salvar-perfil">Salvar perfil</button>
      </form>

      {user && <AlterarSenha userEmail={user.email} userId={user.id} />}
      {user && <DesativarConta user={user} onDesativar={() => {
        localStorage.removeItem('currentPage')
        window.location.href = '/'
      }} />}
    </div>
  )
}

function FazerAtividade({ atividade, onEnviar, onVoltar }) {
  const [respostas, setRespostas] = useState({})
  const [resposta, setResposta] = useState('')

  // Parsear conteudo do banco (JSON string) ou usar campos diretos (localStorage)
  const conteudo = (() => {
    try { return atividade.conteudo ? JSON.parse(atividade.conteudo) : {} }
    catch { return {} }
  })()

  const tipo = conteudo.tipo || atividade.tipo || 'dissertativa'
  const questoes = conteudo.questoes?.length > 0 ? conteudo.questoes : atividade.questoes || []

  // Se tem múltiplas questões
  const temMultiplasQuestoes = questoes.length > 0

  const handleEnviar = () => {
    if (temMultiplasQuestoes) {
      if (Object.keys(respostas).length < questoes.length) {
        alert('Por favor, responda todas as questões.')
        return
      }
      onEnviar(JSON.stringify(respostas))
    } else if (tipo === 'multipla_escolha') {
      const opcao = respostas[0]
      if (!opcao) { alert('Por favor, selecione uma alternativa.'); return }
      onEnviar(opcao)
    } else {
      if (!resposta.trim()) { alert('Por favor, responda a atividade.'); return }
      onEnviar(resposta)
    }
  }

  return (
    <div className="fazer-atividade">
      <button onClick={onVoltar} className="btn-voltar">← Voltar</button>
      <div className="atividade-container">
        <h2>{atividade.titulo}</h2>
        <p><strong>Área:</strong> {atividade.area}</p>
        <div className="descricao-atividade"><p>{atividade.descricao}</p></div>

        {temMultiplasQuestoes ? (
          questoes.map((q, i) => (
            <div key={i} className="questao-bloco" style={{ marginBottom: '1.5rem' }}>
              <h4>Questão {i + 1}: {q.pergunta}</h4>
              {['A', 'B', 'C', 'D'].map(letra => (
                <label key={letra} className="opcao-label">
                  <input
                    type="radio"
                    name={`questao_${i}`}
                    value={letra}
                    checked={respostas[i] === letra}
                    onChange={() => setRespostas(prev => ({ ...prev, [i]: letra }))}
                  />
                  <span>{letra}) {q[`opcao${letra}`]}</span>
                </label>
              ))}
            </div>
          ))
        ) : tipo === 'multipla_escolha' ? (
          <div className="opcoes-resposta">
            <h4>{conteudo.pergunta || 'Escolha a alternativa correta:'}</h4>
            {['A', 'B', 'C', 'D'].map(letra => (
              <label key={letra} className="opcao-label">
                <input
                  type="radio"
                  name="opcao"
                  value={letra}
                  checked={respostas[0] === letra}
                  onChange={() => setRespostas({ 0: letra })}
                />
                <span>{letra}) {conteudo[`opcao${letra}`] || atividade[`opcao${letra}`]}</span>
              </label>
            ))}
          </div>
        ) : (
          <div className="resposta-dissertativa">
            <h4>Sua resposta:</h4>
            <textarea
              value={resposta}
              onChange={(e) => setResposta(e.target.value)}
              placeholder="Digite sua resposta aqui..."
              rows="8"
            />
          </div>
        )}

        <button onClick={handleEnviar} className="btn-enviar">Enviar atividade</button>
      </div>
    </div>
  )
}

function AlterarSenha({ userEmail, userId }) {
  const [senhaData, setSenhaData] = useState({ senhaAtual: '', novaSenha: '', confirmarSenha: '' })
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    setSucesso(false)
    if (!SENHA_FORTE(senhaData.novaSenha)) { setErro('A nova senha não atende aos requisitos de segurança.'); return }
    if (senhaData.novaSenha !== senhaData.confirmarSenha) { setErro('As senhas não coincidem.'); return }
    try {
      const params = new URLSearchParams({ senhaAtual: senhaData.senhaAtual, novaSenha: senhaData.novaSenha })
      const res = await fetch(`https://learnwaveback2.onrender.com/api/usuarios/${userId}/senha?${params}`, { method: 'PATCH' })
      if (!res.ok) { setErro(await res.text()); return }
      setSenhaData({ senhaAtual: '', novaSenha: '', confirmarSenha: '' })
      setSucesso(true)
    } catch {
      setErro('Erro ao conectar com o servidor. Tente novamente.')
    }
  }

  return (
    <div className="alterar-senha-section">
      <h4>Alterar senha</h4>
      <form onSubmit={handleSubmit} className="form-senha">
        <div className="campo-perfil">
          <label>Senha atual</label>
          <input type="password" value={senhaData.senhaAtual} onChange={(e) => setSenhaData({ ...senhaData, senhaAtual: e.target.value })} placeholder="Digite sua senha atual" required />
        </div>
        <div className="campo-perfil">
          <label>Nova senha</label>
          <input type="password" value={senhaData.novaSenha} onChange={(e) => setSenhaData({ ...senhaData, novaSenha: e.target.value })} placeholder="Crie uma senha forte" required />
        </div>
        {senhaData.novaSenha && <PasswordValidator password={senhaData.novaSenha} />}
        <div className="campo-perfil">
          <label>Confirmar nova senha</label>
          <input type="password" value={senhaData.confirmarSenha} onChange={(e) => setSenhaData({ ...senhaData, confirmarSenha: e.target.value })} placeholder="Repita a nova senha" required />
        </div>
        {erro && <p className="senha-erro">{erro}</p>}
        {sucesso && <p className="senha-sucesso">Senha alterada com sucesso.</p>}
        <button type="submit" className="btn-alterar-senha">Salvar nova senha</button>
      </form>
    </div>
  )
}

function DesativarConta({ user, onDesativar }) {
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  const confirmarDesativacao = async () => {
    setLoading(true)
    setErro('')
    try {
      const res = await fetch(`https://learnwaveback2.onrender.com/api/usuarios/${user.id}/status?status=inativo`, { method: 'PATCH' })
      if (!res.ok) throw new Error(await res.text())
      localStorage.clear()
      onDesativar()
    } catch {
      setErro('Erro ao desativar conta. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <>
      <div className="desativar-conta-section">
        <h4>Desativar conta</h4>
        <p>Ao desativar sua conta, você perderá acesso à plataforma e seus dados não aparecerão mais para outros usuários.</p>
        <button onClick={() => setShowModal(true)} className="btn-desativar-conta">Desativar minha conta</button>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => !loading && setShowModal(false)}>
          <div className="modal-desativar" onClick={e => e.stopPropagation()}>
            <div className="modal-desativar-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <h3>Desativar conta?</h3>
            <p>Tem certeza que deseja desativar sua conta? Você será desconectado imediatamente e não conseguirá mais fazer login.</p>
            <p className="modal-desativar-aviso">Esta ação não pode ser desfeita sem contato com o administrador.</p>
            {erro && <p className="senha-erro">{erro}</p>}
            <div className="modal-desativar-actions">
              <button onClick={() => setShowModal(false)} className="btn-cancelar-desativar" disabled={loading}>Cancelar</button>
              <button onClick={confirmarDesativacao} className="btn-confirmar-desativar" disabled={loading}>
                {loading ? 'Desativando...' : 'Sim, desativar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AreaAluno
