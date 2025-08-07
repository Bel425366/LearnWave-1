const AREAS = [
  { id: 'gramatica', nome: 'Gramática', descricao: 'Sintaxe, morfologia e fonética', icone: '📝' },
  { id: 'literatura', nome: 'Literatura', descricao: 'Obras e autores brasileiros', icone: '📚' },
  { id: 'redacao', nome: 'Redação', descricao: 'Técnicas de escrita e dissertação', icone: '✍️' },
  { id: 'interpretacao', nome: 'Interpretação de Texto', descricao: 'Compreensão e análise textual', icone: '🔍' },
  { id: 'ortografia', nome: 'Ortografia', descricao: 'Regras de escrita e acentuação', icone: '✏️' },
  { id: 'fonetica', nome: 'Fonética', descricao: 'Sons da fala e pronúncia', icone: '🗣️' },
  { id: 'semantica', nome: 'Semântica', descricao: 'Significado das palavras', icone: '💭' },
  { id: 'estilistica', nome: 'Estilística', descricao: 'Recursos expressivos da linguagem', icone: '🎨' },
  { id: 'morfologia', nome: 'Morfologia', descricao: 'Estrutura e formação das palavras', icone: '🔤' },
  { id: 'sintaxe', nome: 'Sintaxe', descricao: 'Organização das palavras na frase', icone: '🔗' },
  { id: 'pontuacao', nome: 'Pontuação', descricao: 'Sinais gráficos e suas funções', icone: '❗' },
  { id: 'versificacao', nome: 'Versificação', descricao: 'Métrica e estrutura poética', icone: '🎭' }
]

function Dashboard({ user, onNavigate }) {

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
        {AREAS.map(area => (
          <div key={area.id} className="area-card">
            <div className="area-icon">{area.icone}</div>
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