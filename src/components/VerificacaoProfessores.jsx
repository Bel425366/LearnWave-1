import { useState, useEffect } from 'react'
import { localDB } from '../services/localDatabase'

function VerificacaoProfessores() {
  const [professoresPendentes, setProfessoresPendentes] = useState([])
  const [imagemModal, setImagemModal] = useState(null)

  useEffect(() => {
    carregarProfessoresPendentes()
  }, [])

  const carregarProfessoresPendentes = () => {
    const pendentes = localDB.getPendingTeachers()
    console.log('Professores pendentes:', pendentes)
    setProfessoresPendentes(pendentes)
  }

  const aprovarProfessor = (professorId) => {
    if (localDB.approveTeacher(professorId)) {
      alert('Professor aprovado com sucesso!')
      carregarProfessoresPendentes()
    }
  }

  const rejeitarProfessor = (professorId) => {
    if (localDB.rejectTeacher(professorId)) {
      alert('Professor rejeitado!')
      carregarProfessoresPendentes()
    }
  }

  return (
    <div className="verificacao-professores">
      <div className="section-header">
        <h2>📋 Verificação de Credenciais Docentes</h2>
        <p className="section-subtitle">Analise e aprove os cadastros de professores pendentes</p>
      </div>
      
      {professoresPendentes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📄</div>
          <h3>Nenhuma solicitação pendente</h3>
          <p>Todas as solicitações de cadastro foram processadas.</p>
        </div>
      ) : (
        <div className="professores-grid">
          {professoresPendentes.map(professor => (
            <div key={professor.id} className="professor-card-formal">
              <div className="card-header">
                <div className="professor-avatar">
                  👨‍🏫
                </div>
                <div className="professor-basic-info">
                  <h3 className="professor-nome">{professor.nome}</h3>
                  <p className="professor-email">{professor.email}</p>
                  <span className="status-badge pending">Pendente de Aprovação</span>
                </div>
              </div>
              
              <div className="card-body">
                <div className="info-grid">
                  <div className="info-item">
                    <label>CPF:</label>
                    <span>{professor.cpf}</span>
                  </div>
                  <div className="info-item">
                    <label>Instituição:</label>
                    <span>{professor.escola}</span>
                  </div>
                  {professor.telefone && (
                    <div className="info-item">
                      <label>Telefone:</label>
                      <span>{professor.telefone}</span>
                    </div>
                  )}
                  <div className="info-item">
                    <label>Data da Solicitação:</label>
                    <span>{new Date().toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
                
                {professor.documentoImagem && (
                  <div className="documento-section">
                    <label>Documento Comprobatório:</label>
                    <div className="documento-preview">
                      <img 
                        src={professor.documentoImagem} 
                        alt="Documento do professor" 
                        className="documento-img"
                        onClick={() => window.open(professor.documentoImagem, '_blank')}
                      />
                      <p className="documento-nome">{professor.documento}</p>
                      <button 
                        className="btn-visualizar"
                        onClick={() => setImagemModal(professor.documentoImagem)}
                      >
                        🔍 Visualizar em Tela Cheia
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="card-footer">
                <div className="acoes-formais">
                  <button 
                    className="btn-aprovar-formal"
                    onClick={() => aprovarProfessor(professor.id)}
                  >
                    ✅ Aprovar Cadastro
                  </button>
                  <button 
                    className="btn-rejeitar-formal"
                    onClick={() => rejeitarProfessor(professor.id)}
                  >
                    ❌ Rejeitar Solicitação
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {imagemModal && (
        <div className="modal-overlay" onClick={() => setImagemModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Documento Comprobatório</h3>
              <button className="modal-close" onClick={() => setImagemModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <img src={imagemModal} alt="Documento" className="modal-image" />
            </div>
            <div className="modal-footer">
              <button className="btn-download" onClick={() => {
                const link = document.createElement('a')
                link.href = imagemModal
                link.download = 'documento-professor.jpg'
                link.click()
              }}>
                📥 Baixar Documento
              </button>
              <button className="btn-fechar" onClick={() => setImagemModal(null)}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VerificacaoProfessores