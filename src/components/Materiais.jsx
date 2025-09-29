function Materiais({ area, onNavigate }) {
  const materiais = {
    gramatica: [
      { id: 1, titulo: 'Guia Completo de Classes de Palavras', tipo: 'PDF' },
      { id: 2, titulo: 'Tabela de Concordância Verbal', tipo: 'PDF' },
      { id: 3, titulo: 'Resumo de Sintaxe', tipo: 'PDF' }
    ],
    literatura: [
      { id: 1, titulo: 'Linha do Tempo Literária', tipo: 'PDF' },
      { id: 2, titulo: 'Principais Autores Brasileiros', tipo: 'PDF' },
      { id: 3, titulo: 'Características dos Movimentos', tipo: 'PDF' }
    ],
    redacao: [
      { id: 1, titulo: 'Modelo de Dissertação ENEM', tipo: 'PDF' },
      { id: 2, titulo: 'Banco de Conectivos', tipo: 'PDF' },
      { id: 3, titulo: 'Temas de Redação Atuais', tipo: 'PDF' }
    ],
    interpretacao: [
      { id: 1, titulo: 'Técnicas de Interpretação', tipo: 'PDF' },
      { id: 2, titulo: 'Glossário de Figuras de Linguagem', tipo: 'PDF' },
      { id: 3, titulo: 'Estratégias de Leitura', tipo: 'PDF' }
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
      
      <h2>Materiais de Apoio - {areaNames[area]}</h2>
      
      <div className="materials-list">
        {materiais[area]?.map(material => (
          <div key={material.id} className="material-card">
            <div className="material-icon">M</div>
            <div className="material-info">
              <h3>{material.titulo}</h3>
              <p>Tipo: {material.tipo}</p>
              <button className="download-btn">Baixar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Materiais