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