import { useState, useEffect } from 'react'

function VerificacaoProfessores() {
  const [professoresPendentes, setProfessoresPendentes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProfessor, setSelectedProfessor] = useState(null)

  useEffect(() => {
    carregarProfessoresPendentes()
  }, [])

  const carregarProfessoresPendentes = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/professores-pendentes')
      const data = await response.json()
      setProfessoresPendentes(data)
    } catch (error) {
      console.error('Erro ao carregar professores:', error)
    } finally {
      setLoading(false)
    }
  }

  const verificarProfessor = async (professorId, status) => {
    try {
      const response = await fetch('http://localhost:3001/api/verificar-professor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ professorId, status })
      })

      if (response.ok) {
        alert(`Professor ${status} com sucesso!`)
        carregarProfessoresPendentes()
        setSelectedProfessor(null)
      } else {
        alert('Erro na verificação')
      }
    } catch (error) {
      alert('Erro de conexão')
    }
  }

  const visualizarDocumento = (caminhoArquivo) => {
    window.open(`http://localhost:3001/${caminhoArquivo}`, '_blank')
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div className="verificacao-professores">
      <h2>Verificação de Professores</h2>
      
      {professoresPendentes.length === 0 ? (
        <p>Nenhum professor pendente de verificação.</p>
      ) : (
        <div className="professores-lista">
          {professoresPendentes.map(professor => (
            <div key={professor.id} className="professor-card">
              <div className="professor-info">
                <h3>{professor.nome}</h3>
                <p><strong>Email:</strong> {professor.email}</p>
                <p><strong>CPF:</strong> {professor.cpf}</p>

                <p><strong>Escola:</strong> {professor.escola}</p>
                {professor.telefone && <p><strong>Telefone:</strong> {professor.telefone}</p>}
                <p><strong>Data do cadastro:</strong> {new Date(professor.data_criacao).toLocaleDateString()}</p>
              </div>
              
              <div className="professor-actions">
                {professor.caminho_arquivo && (
                  <button 
                    onClick={() => visualizarDocumento(professor.caminho_arquivo)}
                    className="btn-documento"
                  >
                    Ver Documento
                  </button>
                )}
                
                <div className="verification-buttons">
                  <button 
                    onClick={() => verificarProfessor(professor.id, 'aprovado')}
                    className="btn-aprovar"
                  >
                    Aprovar
                  </button>
                  <button 
                    onClick={() => verificarProfessor(professor.id, 'rejeitado')}
                    className="btn-rejeitar"
                  >
                    Rejeitar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default VerificacaoProfessores