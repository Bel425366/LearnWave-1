function Dashboard({ user, onNavigate }) {
  const areas = [
    { id: 'gramatica', nome: 'Gramática', descricao: 'Sintaxe, morfologia e fonética' },
    { id: 'literatura', nome: 'Literatura', descricao: 'Obras e autores brasileiros' },
    { id: 'redacao', nome: 'Redação', descricao: 'Técnicas de escrita e dissertação' },
    { id: 'interpretacao', nome: 'Interpretação de Texto', descricao: 'Compreensão e análise textual' }
  ]

  return (
    <div className="dashboard">
      <nav className="nav-menu">
        <button onClick={() => onNavigate('dashboard')}>Início</button>
        <button onClick={() => onNavigate('area-aluno')}>Área do Aluno</button>
      </nav>
      
      <div className="welcome">
        <h2>Bem-vindo ao LearnWave, {user.nome}!</h2>
        <p>Escolha uma área da Língua Portuguesa para começar seus estudos:</p>
      </div>

      <div className="areas-grid">
        {areas.map(area => (
          <div key={area.id} className="area-card">
            <h3>{area.nome}</h3>
            <p>{area.descricao}</p>
            <div className="area-buttons">
              <button onClick={() => onNavigate('videoaulas', area.id)}>
                Videoaulas
              </button>
              <button onClick={() => onNavigate('atividades', area.id)}>
                Atividades
              </button>
              <button onClick={() => onNavigate('materiais', area.id)}>
                Materiais
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard