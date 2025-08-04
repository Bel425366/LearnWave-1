function AreaAluno({ user, onNavigate }) {
  const progresso = {
    gramatica: { concluido: 75, total: 100 },
    literatura: { concluido: 45, total: 100 },
    redacao: { concluido: 60, total: 100 },
    interpretacao: { concluido: 80, total: 100 }
  }

  const atividades_recentes = [
    { area: 'Gramática', atividade: 'Classes de Palavras', nota: 8.5 },
    { area: 'Interpretação', atividade: 'Compreensão Textual', nota: 9.0 },
    { area: 'Redação', atividade: 'Estrutura Dissertativa', nota: 7.5 }
  ]

  return (
    <div className="content-page">
      <nav className="nav-menu">
        <button onClick={() => onNavigate('dashboard')}>Voltar</button>
      </nav>
      
      <h2>Área do Aluno</h2>
      
      <div className="student-info">
        <h3>Informações Pessoais</h3>
        <p><strong>Nome:</strong> {user.nome}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      <div className="progress-section">
        <h3>Progresso por Área</h3>
        <div className="progress-grid">
          {Object.entries(progresso).map(([area, dados]) => (
            <div key={area} className="progress-card">
              <h4>{area.charAt(0).toUpperCase() + area.slice(1)}</h4>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(dados.concluido / dados.total) * 100}%` }}
                ></div>
              </div>
              <p>{dados.concluido}% concluído</p>
            </div>
          ))}
        </div>
      </div>

      <div className="recent-activities">
        <h3>Atividades Recentes</h3>
        <div className="activities-table">
          {atividades_recentes.map((atividade, index) => (
            <div key={index} className="activity-row">
              <span>{atividade.area}</span>
              <span>{atividade.atividade}</span>
              <span className="grade">Nota: {atividade.nota}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="stats">
        <h3>Estatísticas Gerais</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Videoaulas Assistidas</h4>
            <p>24</p>
          </div>
          <div className="stat-card">
            <h4>Atividades Concluídas</h4>
            <p>18</p>
          </div>
          <div className="stat-card">
            <h4>Materiais Baixados</h4>
            <p>12</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AreaAluno