function Videoaulas({ area, onNavigate }) {
  const videoaulas = {
    gramatica: [
      { id: 1, titulo: 'Classes de Palavras', duracao: '15 min' },
      { id: 2, titulo: 'Sintaxe da Oração', duracao: '20 min' },
      { id: 3, titulo: 'Concordância Verbal', duracao: '18 min' }
    ],
    literatura: [
      { id: 1, titulo: 'Barroco no Brasil', duracao: '25 min' },
      { id: 2, titulo: 'Romantismo', duracao: '22 min' },
      { id: 3, titulo: 'Modernismo', duracao: '30 min' }
    ],
    redacao: [
      { id: 1, titulo: 'Estrutura da Dissertação', duracao: '20 min' },
      { id: 2, titulo: 'Argumentação', duracao: '25 min' },
      { id: 3, titulo: 'Coesão e Coerência', duracao: '18 min' }
    ],
    interpretacao: [
      { id: 1, titulo: 'Tipos de Texto', duracao: '15 min' },
      { id: 2, titulo: 'Figuras de Linguagem', duracao: '20 min' },
      { id: 3, titulo: 'Inferência Textual', duracao: '22 min' }
    ],
    ortografia: [
      { id: 1, titulo: 'Regras de Acentuação', duracao: '18 min' },
      { id: 2, titulo: 'Uso do Hífen', duracao: '15 min' },
      { id: 3, titulo: 'Palavras Homônimas', duracao: '20 min' }
    ],
    fonetica: [
      { id: 1, titulo: 'Fonemas e Letras', duracao: '16 min' },
      { id: 2, titulo: 'Encontros Vocálicos', duracao: '14 min' },
      { id: 3, titulo: 'Dígrafos', duracao: '12 min' }
    ],
    semantica: [
      { id: 1, titulo: 'Sinônimos e Antônimos', duracao: '17 min' },
      { id: 2, titulo: 'Polissemia', duracao: '19 min' },
      { id: 3, titulo: 'Denotação e Conotação', duracao: '21 min' }
    ],
    estilistica: [
      { id: 1, titulo: 'Figuras de Linguagem', duracao: '23 min' },
      { id: 2, titulo: 'Vícios de Linguagem', duracao: '16 min' },
      { id: 3, titulo: 'Níveis de Linguagem', duracao: '18 min' }
    ],
    morfologia: [
      { id: 1, titulo: 'Formação de Palavras', duracao: '19 min' },
      { id: 2, titulo: 'Prefixos e Sufixos', duracao: '17 min' },
      { id: 3, titulo: 'Radical e Desinências', duracao: '15 min' }
    ],
    sintaxe: [
      { id: 1, titulo: 'Período Simples', duracao: '21 min' },
      { id: 2, titulo: 'Período Composto', duracao: '24 min' },
      { id: 3, titulo: 'Funções Sintáticas', duracao: '20 min' }
    ],
    pontuacao: [
      { id: 1, titulo: 'Vírgula e Ponto', duracao: '16 min' },
      { id: 2, titulo: 'Dois Pontos e Ponto e Vírgula', duracao: '14 min' },
      { id: 3, titulo: 'Travessão e Aspas', duracao: '13 min' }
    ],
    versificacao: [
      { id: 1, titulo: 'Métrica e Ritmo', duracao: '18 min' },
      { id: 2, titulo: 'Rimas e Estrofes', duracao: '16 min' },
      { id: 3, titulo: 'Soneto e Formas Poéticas', duracao: '22 min' }
    ]
  }

  const areaNames = {
    gramatica: 'Gramática',
    literatura: 'Literatura',
    redacao: 'Redação',
    interpretacao: 'Interpretação de Texto',
    ortografia: 'Ortografia',
    fonetica: 'Fonética',
    semantica: 'Semântica',
    estilistica: 'Estilística',
    morfologia: 'Morfologia',
    sintaxe: 'Sintaxe',
    pontuacao: 'Pontuação',
    versificacao: 'Versificação'
  }

  return (
    <div className="content-page">
      <nav className="nav-menu">
        <button onClick={() => onNavigate('dashboard')}>Voltar</button>
      </nav>
      
      <h2>Videoaulas - {areaNames[area]}</h2>
      
      <div className="videos-list">
        {videoaulas[area]?.map(video => (
          <div key={video.id} className="video-card">
            <div className="video-thumbnail">📹</div>
            <div className="video-info">
              <h3>{video.titulo}</h3>
              <p>Duração: {video.duracao}</p>
              <button className="play-btn">Assistir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Videoaulas
