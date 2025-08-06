import { useState, useEffect } from 'react'

function AreaAluno({ user, onNavigate }) {
  const [activeTab, setActiveTab] = useState('atividades')
  const [atividadeAtual, setAtividadeAtual] = useState(null)
  const [progressoAluno, setProgressoAluno] = useState(() => {
    const saved = localStorage.getItem(`progresso_${user.email}`)
    return saved ? JSON.parse(saved) : {
      atividadesConcluidas: [],
      videoaulasAssistidas: [],
      materiaisBaixados: [],
      notas: {}
    }
  })
  
  const todasAtividades = (JSON.parse(localStorage.getItem('atividades')) || []).filter(a => !a.excluido)
  const todasVideoaulas = (JSON.parse(localStorage.getItem('videoaulas')) || []).filter(v => !v.excluido)
  const todosMateriais = (JSON.parse(localStorage.getItem('materiais')) || []).filter(m => !m.excluido)

  useEffect(() => {
    localStorage.setItem(`progresso_${user.email}`, JSON.stringify(progressoAluno))
  }, [progressoAluno, user.email])

  const abrirAtividade = (atividade) => {
    setAtividadeAtual(atividade)
  }

  const enviarAtividade = (resposta) => {
    const submissoes = JSON.parse(localStorage.getItem('submissoes')) || []
    const novaSubmissao = {
      id: Date.now(),
      atividadeId: atividadeAtual.id,
      alunoEmail: user.email,
      alunoNome: user.nome,
      resposta,
      data: new Date().toLocaleString(),
      status: 'pendente',
      nota: null
    }
    submissoes.push(novaSubmissao)
    localStorage.setItem('submissoes', JSON.stringify(submissoes))
    
    setProgressoAluno(prev => ({
      ...prev,
      atividadesConcluidas: [...prev.atividadesConcluidas, atividadeAtual.id]
    }))
    setAtividadeAtual(null)
    alert('Atividade enviada! Aguarde a correção do professor.')
  }

  const marcarVideoaulaAssistida = (videoId) => {
    setProgressoAluno(prev => ({
      ...prev,
      videoaulasAssistidas: [...prev.videoaulasAssistidas, videoId]
    }))
    alert('Videoaula marcada como assistida!')
  }

  const baixarMaterial = (materialId) => {
    setProgressoAluno(prev => ({
      ...prev,
      materiaisBaixados: [...prev.materiaisBaixados, materialId]
    }))
    alert('Material baixado!')
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'atividades':
        return (
          <div className="atividades-disponiveis">
            <h3>Todas as Atividades Disponíveis</h3>
            {todasAtividades.filter(a => a.status === 'Publicada').map(atividade => {
              const concluida = progressoAluno.atividadesConcluidas.includes(atividade.id)
              const submissoes = JSON.parse(localStorage.getItem('submissoes')) || []
              const minhaSubmissao = submissoes.find(s => s.atividadeId === atividade.id && s.alunoEmail === user.email)
              
              return (
                <div key={atividade.id} className="atividade-card">
                  <h4>{atividade.titulo}</h4>
                  <p>Área: {atividade.area}</p>
                  <p>{atividade.descricao}</p>
                  {minhaSubmissao ? (
                    <div>
                      <span className={`status ${minhaSubmissao.status}`}>
                        {minhaSubmissao.status === 'pendente' ? 'Aguardando Correção' : 'Corrigida'}
                      </span>
                      {minhaSubmissao.nota && <span className="nota">Nota: {minhaSubmissao.nota}</span>}
                    </div>
                  ) : (
                    <button onClick={() => abrirAtividade(atividade)}>Fazer Atividade</button>
                  )}
                </div>
              )
            })}
          </div>
        )
      case 'videoaulas':
        return (
          <div className="videoaulas-disponiveis">
            <h3>Todas as Videoaulas Disponíveis</h3>
            {todasVideoaulas.map(video => {
              const assistida = progressoAluno.videoaulasAssistidas.includes(video.id)
              return (
                <div key={video.id} className="video-card">
                  <h4>{video.titulo}</h4>
                  <p>Área: {video.area}</p>
                  <p>Duração: {video.duracao}</p>
                  <p>URL: <a href={video.url} target="_blank" rel="noopener noreferrer">{video.url}</a></p>
                  {assistida ? (
                    <span className="status assistida">Assistida</span>
                  ) : (
                    <button onClick={() => marcarVideoaulaAssistida(video.id)}>Assistir</button>
                  )}
                </div>
              )
            })}
          </div>
        )
      case 'materiais':
        return (
          <div className="materiais-disponiveis">
            <h3>Todos os Materiais Disponíveis</h3>
            {todosMateriais.map(material => {
              const baixado = progressoAluno.materiaisBaixados.includes(material.id)
              return (
                <div key={material.id} className="material-card">
                  <h4>{material.titulo}</h4>
                  <p>Área: {material.area}</p>
                  <p>Tipo: {material.tipo} | Arquivo: {material.arquivo}</p>
                  {baixado ? (
                    <span className="status baixado">Baixado</span>
                  ) : (
                    <button onClick={() => baixarMaterial(material.id)}>Baixar</button>
                  )}
                </div>
              )
            })}
          </div>
        )
      case 'progresso':
        const submissoes = JSON.parse(localStorage.getItem('submissoes')) || []
        const minhasSubmissoes = submissoes.filter(s => s.alunoEmail === user.email && s.nota !== null)
        const notaMedia = minhasSubmissoes.length > 0 
          ? (minhasSubmissoes.reduce((acc, s) => acc + s.nota, 0) / minhasSubmissoes.length).toFixed(1)
          : 0
        return (
          <div className="meu-progresso">
            <h3>Meu Progresso</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <h4>Atividades Concluídas</h4>
                <p>{progressoAluno.atividadesConcluidas.length}</p>
              </div>
              <div className="stat-card">
                <h4>Videoaulas Assistidas</h4>
                <p>{progressoAluno.videoaulasAssistidas.length}</p>
              </div>
              <div className="stat-card">
                <h4>Materiais Baixados</h4>
                <p>{progressoAluno.materiaisBaixados.length}</p>
              </div>
              <div className="stat-card">
                <h4>Nota Média</h4>
                <p>{notaMedia}</p>
              </div>
            </div>
            <div className="detalhes-progresso">
              <h4>Atividades Realizadas:</h4>
              {minhasSubmissoes.map(submissao => {
                const atividade = todasAtividades.find(a => a.id === submissao.atividadeId)
                return atividade ? (
                  <div key={submissao.id} className="atividade-concluida">
                    <span>{atividade.titulo}</span>
                    <span>Nota: {submissao.nota || 'Pendente'}</span>
                  </div>
                ) : null
              })}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  if (atividadeAtual) {
    return <FazerAtividade atividade={atividadeAtual} onEnviar={enviarAtividade} onVoltar={() => setAtividadeAtual(null)} />
  }

  return (
    <div className="area-aluno">
      <h2>Área do Aluno - {user.nome}</h2>
      
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
          Meu Progresso
        </button>
      </div>

      <div className="tab-content">
        {renderContent()}
      </div>
    </div>
  )
}

function FazerAtividade({ atividade, onEnviar, onVoltar }) {
  const [resposta, setResposta] = useState('')
  const [opcaoSelecionada, setOpcaoSelecionada] = useState('')

  const handleEnviar = () => {
    const respostaFinal = atividade.tipo === 'multipla_escolha' ? opcaoSelecionada : resposta
    if (respostaFinal.trim()) {
      onEnviar(respostaFinal)
    } else {
      alert('Por favor, responda a atividade.')
    }
  }

  return (
    <div className="fazer-atividade">
      <button onClick={onVoltar} className="btn-voltar">← Voltar</button>
      <div className="atividade-container">
        <h2>{atividade.titulo}</h2>
        <p><strong>Área:</strong> {atividade.area}</p>
        <div className="descricao-atividade">
          <p>{atividade.descricao}</p>
        </div>
        
        {atividade.tipo === 'multipla_escolha' ? (
          <div className="opcoes-resposta">
            <h4>Escolha a alternativa correta:</h4>
            {['A', 'B', 'C', 'D'].map(letra => (
              <label key={letra} className="opcao-label">
                <input
                  type="radio"
                  name="opcao"
                  value={letra}
                  checked={opcaoSelecionada === letra}
                  onChange={(e) => setOpcaoSelecionada(e.target.value)}
                />
                <span>{letra}) {atividade[`opcao${letra}`]}</span>
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
        
        <button onClick={handleEnviar} className="btn-enviar">Enviar Atividade</button>
      </div>
    </div>
  )
}

export default AreaAluno