import { useState, useEffect } from 'react'

function AtividadesSimples() {
  const [atividades, setAtividades] = useState([])
  const [selectedActivity, setSelectedActivity] = useState(null)

  useEffect(() => {
    // Criar atividade de teste automaticamente
    const atividadeTeste = {
      id: 'teste123',
      titulo: 'TESTE - Múltiplas Questões',
      questoes: [
        {
          pergunta: 'Qual é 2+2?',
          opcaoA: '3',
          opcaoB: '4', 
          opcaoC: '5',
          opcaoD: '6',
          respostaCorreta: 'B'
        },
        {
          pergunta: 'Qual é 3+3?',
          opcaoA: '5',
          opcaoB: '6',
          opcaoC: '7', 
          opcaoD: '8',
          respostaCorreta: 'B'
        }
      ]
    }
    setAtividades([atividadeTeste])
  }, [])

  return (
    <div style={{padding: '20px'}}>
      <h2>TESTE SIMPLES - Atividades</h2>
      
      {!selectedActivity ? (
        <div>
          {atividades.map(atividade => (
            <div key={atividade.id} style={{border: '1px solid #ccc', padding: '10px', margin: '10px'}}>
              <h3>{atividade.titulo}</h3>
              <button onClick={() => setSelectedActivity(atividade)}>
                Iniciar
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h3>{selectedActivity.titulo}</h3>
          {selectedActivity.questoes.map((questao, index) => (
            <div key={index} style={{border: '1px solid #000', padding: '10px', margin: '10px'}}>
              <h4>Questão {index + 1}</h4>
              <p><strong>{questao.pergunta}</strong></p>
              <div>
                <label><input type="radio" name={`q${index}`} /> A) {questao.opcaoA}</label><br/>
                <label><input type="radio" name={`q${index}`} /> B) {questao.opcaoB}</label><br/>
                <label><input type="radio" name={`q${index}`} /> C) {questao.opcaoC}</label><br/>
                <label><input type="radio" name={`q${index}`} /> D) {questao.opcaoD}</label><br/>
              </div>
            </div>
          ))}
          <button onClick={() => setSelectedActivity(null)}>Voltar</button>
        </div>
      )}
    </div>
  )
}

export default AtividadesSimples