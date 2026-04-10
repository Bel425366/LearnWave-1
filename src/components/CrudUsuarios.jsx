import { useState, useEffect } from 'react'
import UsuarioAPI from '../services/api-learnwave'

function CrudUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { carregarUsuarios() }, [])

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
    if (confirm('Deletar usuário permanentemente?')) {
      try {
        await UsuarioAPI.deletar(id)
        carregarUsuarios()
      } catch (error) {
        alert('Erro: ' + error.message)
      }
    }
  }

  const getTipoLabel = (tipo) => {
    if (tipo === 'ALUNO') return 'Aluno'
    if (tipo === 'PROFESSOR') return 'Professor'
    return 'Admin'
  }

  const getIniciais = (nome) => (nome || 'U').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>

  return (
    <div className="usuarios-section">
      <div className="section-header">
        <h2>Gerenciar Usuários</h2>
        <span style={{ fontSize: '0.85rem', opacity: 0.6 }}>{usuarios.length} usuário(s)</span>
      </div>

      <div className="usuarios-grid">
        {usuarios.map(usuario => {
          const tipo = (usuario.tipoUsuario || usuario.tipo || '').toUpperCase()
          const inativo = usuario.status === 'inativo'
          return (
            <div key={usuario.id} className={`usuario-card${inativo ? ' usuario-inativo' : ''}`}>
              <div className="usuario-header">
                <div className="usuario-avatar" style={{ opacity: inativo ? 0.5 : 1 }}>
                  {getIniciais(usuario.nome)}
                </div>
                <div className="usuario-info">
                  <h3>{usuario.nome}</h3>
                  <p className="email">{usuario.email}</p>
                </div>
              </div>
              <div className="usuario-footer">
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span className={`tipo-badge tipo-${tipo.toLowerCase()}`}>{getTipoLabel(tipo)}</span>
                  {inativo && <span className="badge-inativo">Inativo</span>}
                </div>
                {tipo !== 'ADMIN' && (
                  <button className="delete-btn" onClick={() => handleDelete(usuario.id)}>Deletar</button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <style jsx>{`
        .usuarios-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        .usuario-card {
          background: rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 20px;
          border: 1px solid rgba(255,255,255,0.1);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .usuario-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.15); }
        .usuario-inativo { opacity: 0.6; border-color: rgba(239,68,68,0.3); background: rgba(239,68,68,0.04); }
        .usuario-header { display: flex; align-items: center; gap: 15px; margin-bottom: 15px; }
        .usuario-avatar {
          width: 50px; height: 50px; border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: bold; color: white; flex-shrink: 0;
        }
        .usuario-info h3 { margin: 0 0 4px 0; color: #ffffff; font-size: 15px; font-weight: 600; }
        .usuario-info .email { margin: 0; color: #b0b0b0; font-size: 13px; }
        .usuario-footer { display: flex; justify-content: space-between; align-items: center; }
        .tipo-badge { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
        .tipo-aluno { background: rgba(25,118,210,0.15); color: #60a5fa; }
        .tipo-professor { background: rgba(123,31,162,0.15); color: #c084fc; }
        .tipo-admin { background: rgba(245,124,0,0.15); color: #fb923c; }
        .badge-inativo { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; background: rgba(239,68,68,0.15); color: #f87171; }
        .delete-btn { background: rgba(239,68,68,0.1); color: #f87171; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; transition: background 0.2s; }
        .delete-btn:hover { background: rgba(239,68,68,0.2); }
      `}</style>
    </div>
  )
}

export default CrudUsuarios