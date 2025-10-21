import { useState, useEffect } from 'react'
import { api } from '../services/api-learnwave'

function VerificacaoProfessores() {
  const [professoresPendentes, setProfessoresPendentes] = useState([])
  const [imagemModal, setImagemModal] = useState(null)

  useEffect(() => {
    carregarProfessoresPendentes()
  }, [])

  const carregarProfessoresPendentes = async () => {
    try {
      console.log('Buscando professores pendentes...')
      let pendentes = []
      
      try {
        pendentes = await api.getPendingTeachers()
        console.log('Professores pendentes recebidos:', pendentes)
      } catch (error) {
        console.log('Erro na API, usando dados mock:', error)
        // Dados mock para teste
        pendentes = [
          {
            id: 1,
            nome: 'Professor Teste',
            email: 'professor@teste.com',
            cpf: '123.456.789-00',
            escola: 'Escola Teste',
            telefone: '(11) 99999-9999'
          }
        ]
      }
      
      // Buscar documentos para cada professor
      const professoresComDocumentos = await Promise.all(
        pendentes.map(async (professor) => {
          try {
            // Tentar buscar documento do endpoint correto
            let response = await fetch(`http://localhost:8080/api/documentos-verificacao/usuario/${professor.id}`)
            
            if (!response.ok) {
              // Se não encontrar, tentar endpoint alternativo
              response = await fetch(`http://localhost:8080/api/usuarios/${professor.id}/documento`)
            }
            
            if (response.ok) {
              const documentos = await response.json()
              if (Array.isArray(documentos) && documentos.length > 0) {
                professor.documentoImagem = documentos[0].conteudoBase64 || documentos[0].documento_url
                professor.documento = documentos[0].nomeArquivo || documentos[0].nome_arquivo || 'Documento'
              } else if (documentos.conteudoBase64 || documentos.documento_url) {
                // Se retornar objeto único
                professor.documentoImagem = documentos.conteudoBase64 || documentos.documento_url
                professor.documento = documentos.nomeArquivo || documentos.nome_arquivo || 'Documento'
              }
            }
            
            // Se ainda não tem imagem, buscar documento_url do usuário
            if (!professor.documentoImagem) {
              try {
                const docResponse = await fetch(`http://localhost:8080/api/usuarios/${professor.id}/documento`)
                if (docResponse.ok) {
                  const documentoUrl = await docResponse.text()
                  if (documentoUrl) {
                    professor.documentoImagem = documentoUrl
                    professor.documento = 'Documento Comprobatório'
                  }
                }
              } catch (error) {
                console.error('Erro ao buscar documento do usuário:', error)
              }
            }
            
            // Usar documento_url se existir
            if (!professor.documentoImagem && professor.documento_url) {
              professor.documentoImagem = professor.documento_url
              professor.documento = 'Comprovante'
            }
            
            // Se tem documento_url, mostrar imagem padrão
            if (!professor.documentoImagem && professor.documento_url) {
              professor.documentoImagem = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNGY4NWY0Ii8+PHRleHQgeD0iNTAlIiB5PSI0MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkRvY3VtZW50bzwvdGV4dD48dGV4dCB4PSI1MCUiIHk9IjYwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+RW52aWFkbzwvdGV4dD48L3N2Zz4='
              professor.documento = 'Documento Enviado'
            }
            
          } catch (error) {
            console.error('Erro ao buscar documento do professor:', error)
            // Em caso de erro, tentar usar documento_url se existir
            if (professor.documento_url) {
              professor.documentoImagem = professor.documento_url
              professor.documento = 'Comprovante'
            }
          }
          return professor
        })
      )
      
      console.log('Professores pendentes:', professoresComDocumentos)
      console.log('Documentos encontrados:', professoresComDocumentos.map(p => ({
        id: p.id,
        nome: p.nome,
        documentoImagem: p.documentoImagem ? 'SIM' : 'NÃO',
        documento: p.documento,
        documento_url: p.documento_url
      })))
      setProfessoresPendentes(professoresComDocumentos)
    } catch (error) {
      console.error('Erro ao carregar professores pendentes:', error)
    }
  }

  const aprovarProfessor = async (professorId) => {
    try {
      await api.approveTeacher(professorId)
      alert('Professor aprovado com sucesso!')
      carregarProfessoresPendentes()
    } catch (error) {
      console.error('Erro ao aprovar professor:', error)
      alert('Erro ao aprovar professor')
    }
  }

  const rejeitarProfessor = async (professorId) => {
    console.log('ID do professor para rejeitar:', professorId)
    if (!confirm('Tem certeza que deseja rejeitar este professor? Esta ação não pode ser desfeita.')) {
      return
    }
    
    try {
      await api.rejectTeacher(professorId)
      alert('Professor rejeitado!')
      carregarProfessoresPendentes()
    } catch (error) {
      console.error('Erro ao rejeitar professor:', error)
      alert('Erro ao rejeitar professor')
    }
  }

  return (
    <div className="verificacao-professores">
      <div className="section-header">
        <h2>Verificação de Credenciais Docentes</h2>
        <p className="section-subtitle">Analise e aprove os cadastros de professores pendentes</p>
      </div>
      
      {professoresPendentes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">-</div>
          <h3>Nenhuma solicitação pendente</h3>
          <p>Todas as solicitações de cadastro foram processadas.</p>
        </div>
      ) : (
        <div className="professores-grid">
          {professoresPendentes.map(professor => (
            <div key={professor.id} className="professor-card-formal">
              <div className="card-header">
                <div className="professor-avatar">
                  P
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
                        src={professor.documentoImagem.startsWith('data:') ? professor.documentoImagem : `http://localhost:8080/${professor.documentoImagem}`} 
                        alt="Documento do professor" 
                        className="documento-img"
                        onClick={() => {
                          const imageUrl = professor.documentoImagem.startsWith('data:') ? professor.documentoImagem : `http://localhost:8080/${professor.documentoImagem}`
                          window.open(imageUrl, '_blank')
                        }}
                        onError={(e) => {
                          console.error('Erro ao carregar imagem:', professor.documentoImagem)
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'block'
                        }}
                      />
                      <div style={{display: 'none', padding: '20px', border: '1px dashed #ccc', textAlign: 'center'}}>
                        Erro ao carregar imagem do documento
                      </div>
                      <p className="documento-nome">{professor.documento}</p>
                      <button 
                        className="btn-visualizar"
                        onClick={() => {
                          const imageUrl = professor.documentoImagem.startsWith('data:') ? professor.documentoImagem : `http://localhost:8080/${professor.documentoImagem}`
                          setImagemModal(imageUrl)
                        }}
                      >
                        Visualizar em Tela Cheia
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
                    Aprovar Cadastro
                  </button>
                  <button 
                    className="btn-rejeitar-formal"
                    onClick={() => rejeitarProfessor(professor.id)}
                  >
                    Rejeitar Solicitação
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
              <img 
                src={imagemModal} 
                alt="Documento" 
                className="modal-image"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'block'
                }}
              />
              <div style={{display: 'none', padding: '40px', textAlign: 'center'}}>
                <p>Erro ao carregar a imagem do documento</p>
                <p>URL: {imagemModal}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-download" onClick={() => {
                const link = document.createElement('a')
                link.href = imagemModal
                link.download = 'documento-professor.jpg'
                link.click()
              }}>
                Baixar Documento
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