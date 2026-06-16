import { useState, useEffect } from 'react'
import Mascot from './Mascot'
import PasswordValidator from './PasswordValidator'

const SENHA_FORTE = (pwd) =>
  pwd.length >= 8 &&
  /[A-Z]/.test(pwd) &&
  /[a-z]/.test(pwd) &&
  /\d/.test(pwd) &&
  /[!@#$%^&*(),.?":{}|<>]/.test(pwd)

const API_BASE = 'https://learnwaveback2.onrender.com/api'

function AreaAluno({ user, onNavigate }) {
  const [activeTab, setActiveTab] = useState('atividades')
  const [atividadeAtual, setAtividadeAtual] = useState(null)
  const [perfilData, setPerfilData] = useState({ apelido: user.nome, bio: '', fotoPerfil: null })

  // Carregar perfil da API
  useEffect(() => {
    fetch(`${API_BASE}/usuarios/${user.id}/perfil`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setPerfilData({
            apelido: data.nome || user.nome,
            bio: data.bio || '',
            fotoPerfil: data.fotoPerfil || null
          })
        }
      })
      .catch(() => {})
  }, [user.id, user.nome])

  // States do backend
  const [todasAtividades, setTodasAtividades] = useState([])
  const [professores, setProfessores] = useState([])
  const [progressoAtividades, setProgressoAtividades] = useState([])
  const [progressoVideoaulas, setProgressoVideoaulas] = useState([])
  const [downloadsAluno, setDownloadsAluno] = useState([])
  const [progressoGeral, setProgressoGeral] = useState(null)
  const [notasDetalhadas, setNotasDetalhadas] = useState([])
  const [favoritos, setFavoritos] = useState([])

  // Carregar dados iniciais
  useEffect(() => {
    fetch(`${API_BASE}/atividades`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setTodasAtividades(Array.isArray(data) ? data : []))
      .catch(() => setTodasAtividades([]))

    fetch(`${API_BASE}/usuarios/professores/aprovados`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setProfessores(Array.isArray(data) ? data : []))
      .catch(() => setProfessores([]))
  }, [])

  // Carregar progresso do aluno da API
  useEffect(() => {
    if (!user.id) return

    fetch(`${API_BASE}/progresso-atividades/aluno/${user.id}`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setProgressoAtividades(Array.isArray(data) ? data : []))
      .catch(() => setProgressoAtividades([]))

    fetch(`${API_BASE}/progresso-videoaulas/aluno/${user.id}`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setProgressoVideoaulas(Array.isArray(data) ? data : []))
      .catch(() => setProgressoVideoaulas([]))

    fetch(`${API_BASE}/downloads/aluno/${user.id}`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setDownloadsAluno(Array.isArray(data) ? data : []))
      .catch(() => setDownloadsAluno([]))

    fetch(`${API_BASE}/notas/progresso/${user.id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => setProgressoGeral(data))
      .catch(() => setProgressoGeral(null))

    fetch(`${API_BASE}/notas/detalhado/${user.id}`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setNotasDetalhadas(Array.isArray(data) ? data : []))
      .catch(() => setNotasDetalhadas([]))

    // Carregar favoritos
    fetch(`${API_BASE}/favoritos/aluno/${user.id}`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setFavoritos(Array.isArray(data) ? data : []))
      .catch(() => setFavoritos([]))
  }, [user.id])

  // Favoritar/Desfavoritar professor
  const favoritarProfessor = async (professorId) => {
    try {
      const res = await fetch(`${API_BASE}/favoritos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alunoId: Number(user.id), professorId: Number(professorId) })
      })
      if (res.ok) {
        const novo = await res.json()
        setFavoritos(prev => [...prev, novo])
      }
    } catch {}
  }

  const desfavoritarProfessor = async (professorId) => {
    try {
      await fetch(`${API_BASE}/favoritos/${user.id}/${professorId}`, { method: 'DELETE' })
      setFavoritos(prev => prev.filter(f => f.professorId !== professorId))
    } catch {}
  }

  // salvarPerfil envia para a API

  // Enviar atividade — integrado com API
  const enviarAtividade = async (resposta) => {
    let notaAutomatica = null

    const conteudo = (() => {
      try { return atividadeAtual.conteudo ? JSON.parse(atividadeAtual.conteudo) : {} }
      catch { return {} }
    })()
    const tipo = conteudo.tipo || atividadeAtual.tipo || 'dissertativa'
    const questoes = conteudo.questoes?.length > 0 ? conteudo.questoes : []

    // Calcular nota para múltipla escolha
    if (tipo === 'multipla_escolha') {
      if (questoes.length > 0) {
        const respostasAluno = JSON.parse(resposta)
        const acertos = questoes.filter((q, i) => respostasAluno[i] === q.respostaCorreta).length
        notaAutomatica = parseFloat(((acertos / questoes.length) * 10).toFixed(1))
      } else {
        notaAutomatica = resposta === conteudo.respostaCorreta ? 10 : 0
      }
    }

    try {
      // 1. POST — criar progresso (iniciar atividade)
      const postRes = await fetch(`${API_BASE}/progresso-atividades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alunoId: Number(user.id), atividadeId: Number(atividadeAtual.id) })
      })

      if (!postRes.ok) {
        const errText = await postRes.text()
        throw new Error(errText || `Erro ${postRes.status}`)
      }

      const progressoCriado = await postRes.json()

      // 2. PATCH — concluir com nota
      if (notaAutomatica !== null) {
        await fetch(`${API_BASE}/progresso-atividades/${progressoCriado.id}/concluir?nota=${notaAutomatica}`, {
          method: 'PATCH'
        })
      }

      // 3. Atualizar state local
      setProgressoAtividades(prev => [...prev, { ...progressoCriado, nota: notaAutomatica, status: notaAutomatica !== null ? 'CONCLUIDO' : 'EM_ANDAMENTO' }])

      // 4. Recarregar progresso geral
      fetch(`${API_BASE}/notas/progresso/${user.id}`)
        .then(r => r.ok ? r.json() : null)
        .then(data => setProgressoGeral(data))
        .catch(() => {})

      fetch(`${API_BASE}/notas/detalhado/${user.id}`)
        .then(r => r.ok ? r.json() : [])
        .then(data => setNotasDetalhadas(Array.isArray(data) ? data : []))
        .catch(() => {})

    } catch (err) {
      console.error('Erro ao enviar atividade:', err)
      alert('Erro ao registrar progresso: ' + err.message)
    }

    setAtividadeAtual(null)
    if (notaAutomatica !== null) {
      alert(`Atividade corrigida automaticamente! Sua nota: ${notaAutomatica}`)
    } else {
      alert('Atividade enviada! Aguarde a correção do professor.')
    }
  }

  // Marcar videoaula como assistida — integrado com API
  const marcarVideoaulaAssistida = async (videoId) => {
    try {
      // POST — criar progresso
      const postRes = await fetch(`${API_BASE}/progresso-videoaulas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alunoId: Number(user.id), videoaulaId: Number(videoId) })
      })

      if (!postRes.ok) throw new Error(await postRes.text())
      const progressoCriado = await postRes.json()

      // PATCH — concluir
      await fetch(`${API_BASE}/progresso-videoaulas/${progressoCriado.id}/concluir`, { method: 'PATCH' })

      // Atualizar state
      setProgressoVideoaulas(prev => [...prev, { ...progressoCriado, status: 'CONCLUIDO' }])
    } catch (err) {
      console.error('Erro ao marcar videoaula:', err)
      // Fallback silencioso - não bloqueia UX
    }
  }

  // Registrar download de material — integrado com API
  const baixarMaterial = async (materialId) => {
    try {
      const postRes = await fetch(`${API_BASE}/downloads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alunoId: Number(user.id), materialId: Number(materialId) })
      })

      if (!postRes.ok) throw new Error(await postRes.text())
      const downloadCriado = await postRes.json()

      setDownloadsAluno(prev => [...prev, downloadCriado])
    } catch (err) {
      console.error('Erro ao registrar download:', err)
    }
  }

  const salvarPerfil = async (novosDados) => {
    try {
      // Atualizar nome
      const nomeRes = await fetch(`${API_BASE}/usuarios/${user.id}/nome?nome=${encodeURIComponent(novosDados.apelido)}`, {
        method: 'PATCH'
      })
      if (!nomeRes.ok) throw new Error(await nomeRes.text())

      // Atualizar bio e foto via /perfil
      const perfilPayload = {}
      if (novosDados.bio !== undefined) perfilPayload.bio = novosDados.bio
      if (novosDados.fotoPerfil !== undefined) perfilPayload.fotoPerfil = novosDados.fotoPerfil

      await fetch(`${API_BASE}/usuarios/${user.id}/perfil`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(perfilPayload)
      })

      setPerfilData(novosDados)
      alert('Perfil atualizado com sucesso!')
      window.dispatchEvent(new Event('perfilAtualizado'))
    } catch (err) {
      setPerfilData(novosDados)
      alert('Erro ao salvar no servidor: ' + err.message)
    }
  }

  // Dados derivados
  const atividadesAtivas = todasAtividades.filter(a => a.situacao === 'ativo' || !a.situacao)
  const notaMedia = progressoGeral?.media != null ? progressoGeral.media.toFixed(1) : '—'

  // Objeto compatível com componentes filhos
  const progressoAluno = {
    atividadesConcluidas: progressoAtividades.filter(p => p.status === 'CONCLUIDO').map(p => p.atividadeId),
    videoaulasAssistidas: progressoVideoaulas.filter(p => p.status === 'CONCLUIDO').map(p => p.videoaulaId),
    materiaisBaixados: downloadsAluno.map(d => d.materialId),
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
            <span className="painel-stat-val">{progressoGeral?.atividadesConcluidas ?? 0}</span>
            <span className="painel-stat-lbl">Atividades</span>
          </div>
          <div className="painel-stat">
            <span className="painel-stat-val">{progressoVideoaulas.filter(p => p.status === 'CONCLUIDO').length}</span>
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
            progressoAtividades={progressoAtividades}
            userEmail={user.email}
            onAbrirAtividade={setAtividadeAtual}
            favoritos={favoritos}
            onFavoritar={favoritarProfessor}
            onDesfavoritar={desfavoritarProfessor}
          />
        )}
        {activeTab === 'videoaulas' && (
          <TabVideoaulas
            professores={professores}
            progressoAluno={progressoAluno}
            onMarcar={marcarVideoaulaAssistida}
            favoritos={favoritos}
            onFavoritar={favoritarProfessor}
            onDesfavoritar={desfavoritarProfessor}
          />
        )}
        {activeTab === 'materiais' && (
          <TabMateriais
            professores={professores}
            progressoAluno={progressoAluno}
            onBaixar={baixarMaterial}
            favoritos={favoritos}
            onFavoritar={favoritarProfessor}
            onDesfavoritar={desfavoritarProfessor}
          />
        )}
        {activeTab === 'progresso' && (
          <TabProgresso
            progressoGeral={progressoGeral}
            progressoVideoaulas={progressoVideoaulas}
            downloadsAluno={downloadsAluno}
            notasDetalhadas={notasDetalhadas}
            todasAtividades={atividadesAtivas}
            notaMedia={notaMedia}
            professores={professores}
          />
        )}
        {activeTab === 'perfil' && (
          <PerfilAluno perfilData={perfilData} onSalvar={salvarPerfil} user={user} />
        )}
      </div>
    </div>
  )
}

function TabAtividades({ atividades, professores, progressoAtividades, userEmail, onAbrirAtividade, favoritos, onFavoritar, onDesfavoritar }) {
  const publicadas = atividades.filter(a => (a.status === 'Publicada' || a.status === 'PUBLICADO') && a.situacao !== 'lixeira' && a.situacao !== 'excluido')
  const [professorSelecionado, setProfessorSelecionado] = useState(null)
  const [busca, setBusca] = useState('')
  const [favoritosAberto, setFavoritosAberto] = useState(true)

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
            const meuProgresso = progressoAtividades.find(p => p.atividadeId === atividade.id)
            return (
              <div key={atividade.id} className="aluno-card">
                <div className="aluno-card-header">
                  <span className="aluno-card-tag">{atividade.area}</span>
                  {meuProgresso && (
                    <span className={`aluno-badge ${meuProgresso.status === 'EM_ANDAMENTO' ? 'badge-pendente' : 'badge-ok'}`}>
                      {meuProgresso.status === 'EM_ANDAMENTO' ? 'Aguardando correção' : 'Concluída'}
                    </span>
                  )}
                </div>
                <h3 className="aluno-card-title">{atividade.titulo}</h3>
                <p className="aluno-card-desc">{atividade.descricao}</p>
                {meuProgresso ? (
                  meuProgresso.nota != null && (
                    <div className="aluno-nota">Nota: <strong>{meuProgresso.nota}</strong></div>
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

  const filtrados = professoresComAtividades.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()))
  const favIds = favoritos.map(f => f.professorId)
  const profsFavoritos = filtrados.filter(p => favIds.includes(p.id))
  const profsOutros = filtrados

  const renderProfCard = (prof) => {
    const qtd = publicadas.filter(a => a.professorId === prof.id).length
    const isFav = favIds.includes(prof.id)
    return (
      <div key={prof.id} className="aluno-card" style={{ cursor: 'pointer', position: 'relative' }}>
        <button className="btn-favorito" onClick={(e) => { e.stopPropagation(); isFav ? onDesfavoritar(prof.id) : onFavoritar(prof.id) }} title={isFav ? 'Remover dos favoritos' : 'Favoritar'}>
          {isFav ? '⭐' : '☆'}
        </button>
        <div onClick={() => setProfessorSelecionado(prof)} style={{ flex: 1 }}>
          <div className="aluno-card-header">
            <span className="aluno-card-tag">Professor</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{qtd} atividade{qtd !== 1 ? 's' : ''}</span>
          </div>
          <h3 className="aluno-card-title">{prof.nome}</h3>
          {prof.areaEnsino && <p className="aluno-card-desc">{prof.areaEnsino}</p>}
          <span className="aluno-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.5rem' }}>
            Ver atividades
          </span>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <input className="pesquisa-professor" type="text" placeholder="🔍 Pesquisar professor..." value={busca} onChange={e => setBusca(e.target.value)} />

      {profsFavoritos.length > 0 && (
        <div className="secao-favoritos">
          <button className="favoritos-toggle" onClick={() => setFavoritosAberto(!favoritosAberto)}>
            <span>{favoritosAberto ? '▼' : '▶'} ⭐ Meus Professores ({profsFavoritos.length})</span>
          </button>
          {favoritosAberto && (
            <div className="aluno-grid" style={{ marginTop: '0.75rem' }}>
              {profsFavoritos.map(renderProfCard)}
            </div>
          )}
        </div>
      )}

      <div>
        {profsFavoritos.length > 0 && <p style={{ fontSize: '0.85rem', opacity: 0.6, marginBottom: '0.75rem' }}>Todos os Professores</p>}
        {filtrados.length === 0 ? (
          <EstadoVazio mensagem="Nenhum professor encontrado." />
        ) : (
          <div className="aluno-grid">
            {profsOutros.map(renderProfCard)}
          </div>
        )}
      </div>
    </div>
  )
}

function TabVideoaulas({ professores, progressoAluno, onMarcar, favoritos, onFavoritar, onDesfavoritar }) {
  const [professorSelecionado, setProfessorSelecionado] = useState(null)
  const [videoaulas, setVideoaulas] = useState([])
  const [todasPublicadas, setTodasPublicadas] = useState([])
  const [professoresComVideo, setProfessoresComVideo] = useState([])
  const [loadingProfessores, setLoadingProfessores] = useState(true)
  const [busca, setBusca] = useState('')
  const [favoritosAberto, setFavoritosAberto] = useState(true)

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
    const carregarPublicadas = async () => {
      setLoadingProfessores(true)
      try {
        const res = await fetch('https://learnwaveback2.onrender.com/api/videoaulas/publicadas')
        if (!res.ok) throw new Error('API indisponível')
        const data = await res.json()
        const publicadas = Array.isArray(data) ? data : []
        setTodasPublicadas(publicadas)

        // Extrair professorIds únicos das videoaulas publicadas
        const profIds = [...new Set(publicadas.map(v => v.professorId).filter(Boolean))]
        const profsComVideo = professores.filter(p => profIds.includes(p.id))
        setProfessoresComVideo(profsComVideo)
      } catch {
        // Fallback: nenhuma videoaula disponível
        setTodasPublicadas([])
        setProfessoresComVideo([])
      } finally {
        setLoadingProfessores(false)
      }
    }

    if (professores.length > 0) carregarPublicadas()
    else setLoadingProfessores(false)
  }, [professores])

  const selecionarProfessor = (prof) => {
    setProfessorSelecionado(prof)
    setVideoaulas(todasPublicadas.filter(v => v.professorId === prof.id))
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
        {videoaulas.length === 0 && <EstadoVazio mensagem="Nenhuma videoaula publicada ainda." />}
        {videoaulas.length > 0 && (
          <div className="aluno-grid">
            {videoaulas.map(video => {
              const assistida = progressoAluno.videoaulasAssistidas.includes(video.id)
              const videoUrl = video.urlVideo || video.url
              const thumbnail = getYoutubeThumbnail(videoUrl)
              const youtubeId = getYoutubeId(videoUrl)
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
                      href={youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : videoUrl}
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

  const filtrados = professoresComVideo.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()))
  const favIds = favoritos.map(f => f.professorId)
  const profsFavoritos = filtrados.filter(p => favIds.includes(p.id))

  const renderProfCard = (prof) => {
    const qtd = todasPublicadas.filter(v => v.professorId === prof.id).length
    const isFav = favIds.includes(prof.id)
    return (
      <div key={prof.id} className="aluno-card" style={{ cursor: 'pointer', position: 'relative' }}>
        <button className="btn-favorito" onClick={(e) => { e.stopPropagation(); isFav ? onDesfavoritar(prof.id) : onFavoritar(prof.id) }} title={isFav ? 'Remover dos favoritos' : 'Favoritar'}>
          {isFav ? '⭐' : '☆'}
        </button>
        <div onClick={() => selecionarProfessor(prof)} style={{ flex: 1 }}>
          <div className="aluno-card-header">
            <span className="aluno-card-tag">Professor</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{qtd} videoaula{qtd !== 1 ? 's' : ''}</span>
          </div>
          <h3 className="aluno-card-title">{prof.nome}</h3>
          {prof.areaEnsino && <p className="aluno-card-desc">{prof.areaEnsino}</p>}
          <span className="aluno-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.5rem' }}>
            Ver videoaulas
          </span>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <input className="pesquisa-professor" type="text" placeholder="🔍 Pesquisar professor..." value={busca} onChange={e => setBusca(e.target.value)} />

      {profsFavoritos.length > 0 && (
        <div className="secao-favoritos">
          <button className="favoritos-toggle" onClick={() => setFavoritosAberto(!favoritosAberto)}>
            <span>{favoritosAberto ? '▼' : '▶'} ⭐ Meus Professores ({profsFavoritos.length})</span>
          </button>
          {favoritosAberto && <div className="aluno-grid" style={{ marginTop: '0.75rem' }}>{profsFavoritos.map(renderProfCard)}</div>}
        </div>
      )}

      <div>
        {profsFavoritos.length > 0 && <p style={{ fontSize: '0.85rem', opacity: 0.6, marginBottom: '0.75rem' }}>Todos os Professores</p>}
        {filtrados.length === 0 ? <EstadoVazio mensagem="Nenhum professor encontrado." /> : (
          <div className="aluno-grid">{filtrados.map(renderProfCard)}</div>
        )}
      </div>
    </div>
  )
}

function TabMateriais({ professores, progressoAluno, onBaixar, favoritos, onFavoritar, onDesfavoritar }) {
  const [professorSelecionado, setProfessorSelecionado] = useState(null)
  const [materiais, setMateriais] = useState([])
  const [loading, setLoading] = useState(false)
  const [areasAbertas, setAreasAbertas] = useState({})
  const [professoresComMaterial, setProfessoresComMaterial] = useState([])
  const [loadingProfessores, setLoadingProfessores] = useState(true)
  const [busca, setBusca] = useState('')
  const [favoritosAberto, setFavoritosAberto] = useState(true)
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

  const filtrados = professoresComMateriais.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()))
  const favIds = favoritos.map(f => f.professorId)
  const profsFavoritos = filtrados.filter(p => favIds.includes(p.id))

  const renderProfCard = (prof) => {
    const isFav = favIds.includes(prof.id)
    return (
      <div key={prof.id} className="aluno-card" style={{ cursor: 'pointer', position: 'relative' }}>
        <button className="btn-favorito" onClick={(e) => { e.stopPropagation(); isFav ? onDesfavoritar(prof.id) : onFavoritar(prof.id) }} title={isFav ? 'Remover dos favoritos' : 'Favoritar'}>
          {isFav ? '⭐' : '☆'}
        </button>
        <div onClick={() => selecionarProfessor(prof)} style={{ flex: 1 }}>
          <div className="aluno-card-header">
            <span className="aluno-card-tag">Professor</span>
          </div>
          <h3 className="aluno-card-title">{prof.nome}</h3>
          {prof.areaEnsino && <p className="aluno-card-desc">{prof.areaEnsino}</p>}
          <span className="aluno-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.5rem' }}>
            Ver materiais
          </span>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <input className="pesquisa-professor" type="text" placeholder="🔍 Pesquisar professor..." value={busca} onChange={e => setBusca(e.target.value)} />

      {profsFavoritos.length > 0 && (
        <div className="secao-favoritos">
          <button className="favoritos-toggle" onClick={() => setFavoritosAberto(!favoritosAberto)}>
            <span>{favoritosAberto ? '▼' : '▶'} ⭐ Meus Professores ({profsFavoritos.length})</span>
          </button>
          {favoritosAberto && <div className="aluno-grid" style={{ marginTop: '0.75rem' }}>{profsFavoritos.map(renderProfCard)}</div>}
        </div>
      )}

      <div>
        {profsFavoritos.length > 0 && <p style={{ fontSize: '0.85rem', opacity: 0.6, marginBottom: '0.75rem' }}>Todos os Professores</p>}
        {filtrados.length === 0 ? <EstadoVazio mensagem="Nenhum professor encontrado." /> : (
          <div className="aluno-grid">{filtrados.map(renderProfCard)}</div>
        )}
      </div>
    </div>
  )
}

function TabProgresso({ progressoGeral, progressoVideoaulas, downloadsAluno, notasDetalhadas, todasAtividades, notaMedia, professores }) {
  const stats = [
    { val: progressoGeral?.atividadesConcluidas ?? 0, lbl: 'Atividades concluídas' },
    { val: progressoVideoaulas.filter(p => p.status === 'CONCLUIDO').length, lbl: 'Videoaulas assistidas' },
    { val: downloadsAluno.length, lbl: 'Materiais baixados' },
    { val: notaMedia, lbl: 'Média geral' },
  ]

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

      {progressoGeral && (
        <div className="detalhes-progresso" style={{ marginBottom: '1.5rem' }}>
          <h4>Resumo</h4>
          <div className="atividade-concluida">
            <span>Total de atividades</span>
            <span>{progressoGeral.totalAtividades ?? 0}</span>
          </div>
          <div className="atividade-concluida">
            <span>Percentual concluído</span>
            <span>{progressoGeral.percentualConcluido != null ? `${progressoGeral.percentualConcluido.toFixed(0)}%` : '0%'}</span>
          </div>
        </div>
      )}

      {notasDetalhadas.length > 0 && (
        <div className="detalhes-progresso">
          <h4>Notas por atividade</h4>
          {notasDetalhadas.map((nota, i) => {
            const atividade = todasAtividades.find(a => a.id === nota.atividadeId)
            return (
              <div key={nota.id || i} className="atividade-concluida">
                <span>{atividade ? atividade.titulo : `Atividade ${nota.atividadeId}`}</span>
                <span>Nota: {nota.nota != null ? nota.nota : '—'}</span>
              </div>
            )
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
  const [mostrar, setMostrar] = useState({ atual: false, nova: false, confirmar: false })

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

  const BtnOlho = ({ campo }) => (
    <button type="button" className="btn-olho" onClick={() => setMostrar(p => ({ ...p, [campo]: !p[campo] }))} tabIndex={-1}>
      {mostrar[campo] ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      )}
    </button>
  )

  return (
    <div className="alterar-senha-section">
      <h4>Alterar senha</h4>
      <form onSubmit={handleSubmit} className="form-senha">
        <div className="campo-perfil">
          <label>Senha atual</label>
          <div className="input-senha-wrapper">
            <input type={mostrar.atual ? 'text' : 'password'} value={senhaData.senhaAtual} onChange={(e) => setSenhaData({ ...senhaData, senhaAtual: e.target.value })} placeholder="Digite sua senha atual" required />
            <BtnOlho campo="atual" />
          </div>
        </div>
        <div className="campo-perfil">
          <label>Nova senha</label>
          <div className="input-senha-wrapper">
            <input type={mostrar.nova ? 'text' : 'password'} value={senhaData.novaSenha} onChange={(e) => setSenhaData({ ...senhaData, novaSenha: e.target.value })} placeholder="Crie uma senha forte" required />
            <BtnOlho campo="nova" />
          </div>
        </div>
        {senhaData.novaSenha && <PasswordValidator password={senhaData.novaSenha} />}
        <div className="campo-perfil">
          <label>Confirmar nova senha</label>
          <div className="input-senha-wrapper">
            <input type={mostrar.confirmar ? 'text' : 'password'} value={senhaData.confirmarSenha} onChange={(e) => setSenhaData({ ...senhaData, confirmarSenha: e.target.value })} placeholder="Repita a nova senha" required />
            <BtnOlho campo="confirmar" />
          </div>
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
