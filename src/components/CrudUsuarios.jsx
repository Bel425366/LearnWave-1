import { useState, useEffect } from 'react'
import UsuarioAPI from '../services/api-learnwave'

function CrudUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    carregarUsuarios()
  }, [])

  const carregarUsuarios = async () => {
    try {
      const data = await UsuarioAPI.listar()
      setUsuarios(data)
    } catch (error) {
      alert('Erro ao carregar usuários: ' + error.message)
    } finally {
      setLoading(false)
    }
  }



  const handleDelete = async (id) => {
    if (confirm('Deletar usuário?')) {
      try {
        await UsuarioAPI.deletar(id)
        alert('Usuário deletado!')
        carregarUsuarios()
      } catch (error) {
        alert('Erro: ' + error.message)
      }
    }
  }

  const getTipoIcon = (tipo) => {
    switch(tipo) {
      case 'ALUNO': return 'A'
      case 'PROFESSOR': return 'P'
      case 'ADMIN': return 'ADM'
      default: return 'U'
    }
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div className="usuarios-section">
      <div className="section-header">
        <h2>Gerenciar Usuários</h2>

      </div>


      
      <div className="usuarios-grid">
        {usuarios.map(usuario => (
          <div key={usuario.id} className="usuario-card">
            <div className="usuario-header">
              <div className="usuario-avatar">
                {getTipoIcon(usuario.tipoUsuario)}
              </div>
              <div className="usuario-info">
                <h3>{usuario.nome}</h3>
                <p className="email">{usuario.email}</p>
              </div>
            </div>
            <div className="usuario-footer">
              <span className={`tipo-badge tipo-${usuario.tipoUsuario?.toLowerCase()}`}>
                {usuario.tipoUsuario === 'ALUNO' ? 'Aluno' : 
                 usuario.tipoUsuario === 'PROFESSOR' ? 'Professor' : 'Admin'}
              </span>
              {usuario.tipoUsuario !== 'ADMIN' && (
                <button className="delete-btn" onClick={() => handleDelete(usuario.id)}>
                  Deletar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        .usuarios-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        
        .usuario-card {
          background: rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          border: 1px solid #e0e0e0;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .usuario-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }
        
        .usuario-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 15px;
        }
        
        .usuario-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: bold;
          color: white;
        }
        
        .usuario-info h3 {
          margin: 0 0 5px 0;
          color: #ffffff;
          font-size: 16px;
          font-weight: 600;
        }
        
        .usuario-info .email {
          margin: 0;
          color: #b0b0b0;
          font-size: 14px;
        }
        
        .usuario-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .tipo-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
        }
        
        .tipo-aluno {
          background: #e3f2fd;
          color: #1976d2;
        }
        
        .tipo-professor {
          background: #f3e5f5;
          color: #7b1fa2;
        }
        
        .tipo-admin {
          background: #fff3e0;
          color: #f57c00;
        }
        
        .delete-btn {
          background: #ffebee;
          color: #d32f2f;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .delete-btn:hover {
          background: #ffcdd2;
        }
      `}</style>
    </div>
  )
}

export default CrudUsuarios