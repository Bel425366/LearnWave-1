import { useState } from 'react'

function Atividades({ area, onNavigate }) {
  const [selectedActivity, setSelectedActivity] = useState(null)

  const atividades = {
    gramatica: [
      { id: 1, titulo: 'Exercícios de Classes de Palavras', questoes: 10 },
      { id: 2, titulo: 'Quiz de Sintaxe', questoes: 15 },
      { id: 3, titulo: 'Concordância - Prática', questoes: 12 }
    ],
    literatura: [
      { id: 1, titulo: 'Características do Barroco', questoes: 8 },
      { id: 2, titulo: 'Autores Românticos', questoes: 10 },
      { id: 3, titulo: 'Análise de Obras Modernistas', questoes: 12 }
    ],
    redacao: [
      { id: 1, titulo: 'Estrutura Dissertativa', questoes: 5 },
      { id: 2, titulo: 'Tipos de Argumento', questoes: 8 },
      { id: 3, titulo: 'Conectivos e Coesão', questoes: 10 }
    ],
    interpretacao: [
      { id: 1, titulo: 'Compreensão Textual', questoes: 12 },
      { id: 2, titulo: 'Figuras de Linguagem', questoes: 15 },
      { id: 3, titulo: 'Inferência e Pressuposição', questoes: 10 }
    ]
  }

  const areaNames = {
    gramatica: 'Gramática',
    literatura: 'Literatura',
    redacao: 'Redação',
    interpretacao: 'Interpretação de Texto'
  }

  return (
    <div className="content-page">
      <nav className="nav-menu">
        <button onClick={() => onNavigate('dashboard')}>Voltar</button>
      </nav>
      
      <h2>Atividades - {areaNames[area]}</h2>
      
      <div className="activities-list">
        {atividades[area]?.map(atividade => (
          <div key={atividade.id} className="activity-card">
            <h3>{atividade.titulo}</h3>
            <p>{atividade.questoes} questões</p>
            <button 
              className="start-btn"
              onClick={() => setSelectedActivity(atividade)}
            >
              Iniciar
            </button>
          </div>
        ))}
      </div>

      {selectedActivity && (
        <div className="activity-modal">
          <div className="modal-content">
            <h3>{selectedActivity.titulo}</h3>
            <p>Atividade iniciada! ({selectedActivity.questoes} questões)</p>
            <button onClick={() => setSelectedActivity(null)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Atividades