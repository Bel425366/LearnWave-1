import { useState, useEffect } from 'react'

function Atividades({ area, onNavigate, user }) {
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [atividades, setAtividades] = useState([])
  const [respostas, setRespostas] = useState({})
  const [resultado, setResultado] = useState(null)
  const [jaRespondeu, setJaRespondeu] = useState(false)

  useEffect(() => {
    const atividadesSalvas = JSON.parse(localStorage.getItem('atividades') || '[]')
    const atividadesPublicadas = atividadesSalvas.filter(a => 
      a.status === 'Publicada' && 
      !a.excluido &&
      a.tipo === 'multipla_escolha'
    )
    setAtividades(atividadesPublicadas)
  }, [])

  const corrigirAtividade = () => {
    if (!selectedActivity) return
    
    // Se tem questões múltiplas
    if (selectedActivity.questoes && selectedActivity.questoes.length > 0) {
      // Verificar se todas foram respondidas
      const questoesNaoRespondidas = selectedActivity.questoes.filter(q => !respostas[q.id])
      if (questoesNaoRespondidas.length > 0) {
        alert(`Por favor, responda todas as questões. Faltam ${questoesNaoRespondidas.length} questões.`)
        return
      }
      
      // Calcular acertos
      let acertos = 0
      selectedActivity.questoes.forEach(questao => {
        if (respostas[questao.id] === questao.respostaCorreta) {
          acertos++
        }
      })
      
      const nota = (acertos / selectedActivity.questoes.length) * 10
      
      setResultado({ 
        acertos, 
        total: selectedActivity.questoes.length, 
        nota: nota.toFixed(1) 
      })
    } else {
      // Questão única (formato antigo)
      if (!respostas.unica) return
      const acertou = respostas.unica === selectedActivity.respostaCorreta
      const nota = acertou ? 10 : 0
      setResultado({ acertou, nota, respostaCorreta: selectedActivity.respostaCorreta })
    }
    
    // Salvar resultado
    const notaFinal = selectedActivity.questoes && selectedActivity.questoes.length > 0 
      ? (acertos / selectedActivity.questoes.length) * 10
      : (respostas.unica === selectedActivity.respostaCorreta ? 10 : 0)
      
    const submissao = {
      id: Date.now(),
      atividadeId: selectedActivity.id,
      alunoNome: user?.nome || 'Aluno',
      alunoEmail: user?.email || 'aluno@email.com',
      resposta: JSON.stringify(respostas),
      nota: notaFinal,
      status: 'corrigida',
      dataSubmissao: new Date().toISOString(),
      correcaoAutomatica: true
    }
    
    const submissoes = JSON.parse(localStorage.getItem('submissoes') || '[]')
    submissoes.push(submissao)
    localStorage.setItem('submissoes', JSON.stringify(submissoes))
    
    setJaRespondeu(true)
  }

  const fecharAtividade = () => {
    setSelectedActivity(null)
    setRespostas({})
    setResultado(null)
    setJaRespondeu(false)
  }

  const areaNames = {
    'Gramática': 'Gramática',
    'Literatura': 'Literatura', 
    'Redação': 'Redação',
    'Interpretação de Texto': 'Interpretação de Texto',
    'Ortografia': 'Ortografia',
    'Fonética': 'Fonética',
    'Semântica': 'Semântica',
    'Estilística': 'Estilística',
    'Morfologia': 'Morfologia',
    'Sintaxe': 'Sintaxe',
    'Pontuação': 'Pontuação',
    'Versificação': 'Versificação'
  }

  return (
    <div className="content-page">
      <nav className="nav-menu">
        <button onClick={() => onNavigate('dashboard')}>Voltar</button>
      </nav>
      
      <h2>Atividades - {areaNames[area] || area}</h2>
      
      <button 
        onClick={() => {
          const atividadeTeste = {
            id: "teste_" + Date.now(),
            titulo: "TESTE DIRETO - 2 Questões",
            area: "Gramática",
            tipo: "multipla_escolha",
            status: "Publicada",
            excluido: false,
            questoes: [
              {
                pergunta: "Qual é a capital do Brasil?",
                opcaoA: "São Paulo",
                opcaoB: "Rio de Janeiro",
                opcaoC: "Brasília",
                opcaoD: "Salvador",
                respostaCorreta: "C"
              },
              {
                pergunta: "Quantos dias tem uma semana?",
                opcaoA: "5",
                opcaoB: "6",
                opcaoC: "7",
                opcaoD: "8",
                respostaCorreta: "C"
              }
            ]
          }
          
          const atividadesExistentes = JSON.parse(localStorage.getItem('atividades') || '[]')
          const novasAtividades = [...atividadesExistentes, atividadeTeste]
          localStorage.setItem('atividades', JSON.stringify(novasAtividades))
          
          alert('Atividade de teste criada! Recarregue a página.')
          window.location.reload()
        }}
        style={{background: 'green', color: 'white', padding: '10px', margin: '10px'}}
      >
        CRIAR ATIVIDADE TESTE DIRETO
      </button>
      

      
      <div className="activities-list">
        {atividades.map(atividade => (
          <div key={atividade.id} className="activity-card">
            <h3>{atividade.titulo}</h3>
            <p>Tipo: Múltipla Escolha {atividade.questoes ? `(${atividade.questoes.length} questões)` : ''}</p>
            <p>{atividade.descricao}</p>
            <button 
              className="start-btn"
              onClick={() => setSelectedActivity(atividade)}
            >
              Iniciar
            </button>
          </div>
        ))}
      </div>
      
      {atividades.length === 0 && (
        <div className="no-activities">
          <p>Nenhuma atividade disponível para esta área.</p>
        </div>
      )}

      {selectedActivity && (
        <div className="activity-modal">
          <div className="modal-content">
            <h3>{selectedActivity.titulo}</h3>
            <p>{selectedActivity.descricao}</p>
            <p>DEBUG: {selectedActivity.questoes ? `${selectedActivity.questoes.length} questões encontradas` : 'Nenhuma questão encontrada'}</p>

            
            {!jaRespondeu ? (
              <div className="questoes-container">
                {/* SEMPRE MOSTRAR QUESTÕES SE EXISTIREM */}
                {selectedActivity.questoes && selectedActivity.questoes.length > 0 ? (
                  selectedActivity.questoes.map((questao, index) => {
                    console.log('Renderizando questão:', index, questao)
                    return (
                      <div key={index} className="questao-item">
                        <h4>Questão {index + 1}</h4>
                        <p className="pergunta">{questao.pergunta}</p>
                        <p>DEBUG QUESTÃO: A={questao.opcaoA} B={questao.opcaoB} C={questao.opcaoC} D={questao.opcaoD}</p>
                        <div className="opcoes">
                          <label>
                            <input 
                              type="radio" 
                              name={`questao_${index}`}
                              value="A"
                              onChange={(e) => setRespostas({...respostas, [index]: e.target.value})}
                            />
                            <span>A) {questao.opcaoA || 'VAZIO'}</span>
                          </label>
                          <label>
                            <input 
                              type="radio" 
                              name={`questao_${index}`}
                              value="B"
                              onChange={(e) => setRespostas({...respostas, [index]: e.target.value})}
                            />
                            <span>B) {questao.opcaoB || 'VAZIO'}</span>
                          </label>
                          <label>
                            <input 
                              type="radio" 
                              name={`questao_${index}`}
                              value="C"
                              onChange={(e) => setRespostas({...respostas, [index]: e.target.value})}
                            />
                            <span>C) {questao.opcaoC || 'VAZIO'}</span>
                          </label>
                          <label>
                            <input 
                              type="radio" 
                              name={`questao_${index}`}
                              value="D"
                              onChange={(e) => setRespostas({...respostas, [index]: e.target.value})}
                            />
                            <span>D) {questao.opcaoD || 'VAZIO'}</span>
                          </label>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  /* FORMATO ANTIGO */
                  <div className="questao-multipla">
                    <h4>Questão Única:</h4>
                    <div className="opcoes">
                      <label>
                        <input type="radio" name="resposta" value="A" onChange={(e) => setRespostas({unica: e.target.value})} />
                        <span>A) {selectedActivity.opcaoA}</span>
                      </label>
                      <label>
                        <input type="radio" name="resposta" value="B" onChange={(e) => setRespostas({unica: e.target.value})} />
                        <span>B) {selectedActivity.opcaoB}</span>
                      </label>
                      <label>
                        <input type="radio" name="resposta" value="C" onChange={(e) => setRespostas({unica: e.target.value})} />
                        <span>C) {selectedActivity.opcaoC}</span>
                      </label>
                      <label>
                        <input type="radio" name="resposta" value="D" onChange={(e) => setRespostas({unica: e.target.value})} />
                        <span>D) {selectedActivity.opcaoD}</span>
                      </label>
                    </div>
                  </div>
                )}
                <div className="modal-actions">
                  <button 
                    onClick={corrigirAtividade}
                    className="btn-submit"
                  >
                    Enviar Respostas
                  </button>
                  <button onClick={fecharAtividade}>Cancelar</button>
                </div>
              </div>
            ) : (
              <div className="resultado">
                <h4>Resultado:</h4>
                {resultado.total ? (
                  // Múltiplas questões
                  <div className="resultado-multiplas">
                    <p><strong>Acertos: {resultado.acertos}/{resultado.total}</strong></p>
                    <p><strong>Nota: {resultado.nota}/10</strong></p>
                  </div>
                ) : (
                  // Questão única
                  resultado.acertou ? (
                    <div className="resultado-correto">
                      <p>Parabéns! Você acertou!</p>
                      <p><strong>Nota: {resultado.nota}/10</strong></p>
                    </div>
                  ) : (
                    <div className="resultado-incorreto">
                      <p>Resposta incorreta.</p>
                      <p>Resposta correta: {resultado.respostaCorreta}</p>
                      <p><strong>Nota: {resultado.nota}/10</strong></p>
                    </div>
                  )
                )}
                <button onClick={fecharAtividade} className="btn-fechar">Fechar</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Atividades