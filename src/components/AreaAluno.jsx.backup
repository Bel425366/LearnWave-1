import { useState, useEffect } from 'react'

function AreaAluno({ user, onNavigate }) {
  const [activeTab, setActiveTab] = useState('atividades')
  const [atividadeAtual, setAtividadeAtual] = useState(null)
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
  const [progressoAluno, setProgressoAluno] = useState(() => {
    try {
      const saved = localStorage.getItem(`progresso_${user.email}`)
      return saved ? JSON.parse(saved) : {
        atividadesConcluidas: [],
        videoaulasAssistidas: [],
        materiaisBaixados: [],
        notas: {}
      }
    } catch {
      return {
        atividadesConcluidas: [],
        videoaulasAssistidas: [],
        materiaisBaixados: [],
        notas: {}
      }
    }
  })
  
  const todasAtividades = (() => {
    try {
      return (JSON.parse(localStorage.getItem('atividades')) || []).filter(a => !a.excluido)
    } catch {
      return []
    }
  })()
  const todasVideoaulas = (() => {
    try {
      return (JSON.parse(localStorage.getItem('videoaulas')) || []).filter(v => !v.excluido)
    } catch {
      return []
    }
  })()
  const todosMateriais = (() => {
    try {
      return (JSON.parse(localStorage.getItem('materiais')) || []).filter(m => !m.excluido)
    } catch {
      return []
    }
  })()

  useEffect(() => {
    localStorage.setItem(`progresso_${user.email}`, JSON.stringify(progressoAluno))
  }, [progressoAluno, user.email])

  useEffect(() => {
    localStorage.setItem(`perfil_${user.email}`, JSON.stringify(perfilData))
  }, [perfilData, user.email])

  const abrirAtividade = (atividade) => {
    setAtividadeAtual(atividade)
  }

  const enviarAtividade = (resposta) => {
    try {
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
    } catch (error) {
      alert('Erro ao enviar atividade. Tente novamente.')
      return
    }
    
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

  const salvarPerfil = async (novosDados) => {
    try {
      // Salvar no banco de dados
      const response = await fetch(`http://localhost:8080/api/usuarios/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...user,
          nome: novosDados.apelido,
          bio: novosDados.bio,
          fotoPerfil: novosDados.fotoPerfil
        })
      })
      
      if (response.ok) {
        setPerfilData(novosDados)
        alert('Perfil atualizado com sucesso!')
        window.dispatchEvent(new Event('storage'))
      } else {
        throw new Error('Erro ao salvar no servidor')
      }
    } catch (error) {
      console.error('Erro ao salvar perfil:', error)
      // Salvar apenas no localStorage como fallback
      setPerfilData(novosDados)
      alert('Perfil atualizado localmente. Erro ao sincronizar com servidor.')
      window.dispatchEvent(new Event('storage'))
    }
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
      case 'perfil':
        return <PerfilAluno perfilData={perfilData} onSalvar={salvarPerfil} user={user} />
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
        <button 
          className={activeTab === 'perfil' ? 'active' : ''}
          onClick={() => setActiveTab('perfil')}
        >
          Meu Perfil
        </button>
      </div>

      <div className="tab-content">
        {renderContent()}
      </div>
    </div>
  )
}

function PerfilAluno({ perfilData, onSalvar, user }) {
  const [formData, setFormData] = useState(perfilData || { apelido: '', bio: '', fotoPerfil: null })
  const [previewFoto, setPreviewFoto] = useState(perfilData?.fotoPerfil || null)

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
    onSalvar(formData)
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
          <small>{formData.bio?.length || 0}/200 caracteres</small>
        </div>

        <button type="submit" className="btn-salvar-perfil">
          Salvar Perfil
        </button>
      </form>
      
      {user && <AlterarSenha userEmail={user.email} />}
      {user && <DesativarConta user={user} onDesativar={() => window.location.reload()} />}
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

function AlterarSenha({ userEmail }) {
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

export default AreaAluno