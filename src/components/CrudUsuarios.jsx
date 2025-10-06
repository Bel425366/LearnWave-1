import { useState, useEffect } from 'react'
import { UsuarioAPI } from '../services/api-learnwave'

function CrudUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [editando, setEditando] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    tipoUsuario: 'ALUNO',
    areaEnsino: '',
    formacao: '',
    experiencia: ''
  })

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editando) {
        await UsuarioAPI.atualizar(editando, formData)
        alert('Usuário atualizado!')
      } else {
        await UsuarioAPI.cadastrar(formData)
        alert('Usuário criado!')
      }
      
      resetForm()
      carregarUsuarios()
    } catch (error) {
      alert('Erro: ' + error.message)
    }
  }

  const resetForm = () => {
    setFormData({
      nome: '',
      email: '',
      tipoUsuario: 'ALUNO',
      areaEnsino: '',
      formacao: '',
      experiencia: ''
    })
    setEditando(null)
    setShowForm(false)
  }

  const handleEdit = (usuario) => {
    setFormData({
      nome: usuario.nome,
      email: usuario.email,
      tipoUsuario: usuario.tipoUsuario,
      areaEnsino: usuario.areaEnsino || '',
      formacao: usuario.formacao || '',
      experiencia: usuario.experiencia || ''
    })
    setEditando(usuario.id)
    setShowForm(true)
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
        <button 
          className="refresh-btn" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancelar' : 'Novo Usuário'}
        </button>
      </div>

      {showForm && (
        <div className="config-card">
          <h3>{editando ? 'Editar Usuário' : 'Novo Usuário'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Nome"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <select
                value={formData.tipoUsuario}
                onChange={(e) => setFormData({...formData, tipoUsuario: e.target.value})}
              >
                <option value="ALUNO">Aluno</option>
                <option value="PROFESSOR">Professor</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>
            
            {formData.tipoUsuario === 'PROFESSOR' && (
              <>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Área de Ensino"
                    value={formData.areaEnsino}
                    onChange={(e) => setFormData({...formData, areaEnsino: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Formação"
                    value={formData.formacao}
                    onChange={(e) => setFormData({...formData, formacao: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Experiência"
                    value={formData.experiencia}
                    onChange={(e) => setFormData({...formData, experiencia: e.target.value})}
                  />
                </div>
              </>
            )}
            
            <div className="form-actions">
              <button type="submit" className="save-btn">
                {editando ? 'Atualizar' : 'Criar'}
              </button>
              <button type="button" onClick={resetForm}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="usuarios-grid">
        {usuarios.map(usuario => (
          <div key={usuario.id} className="usuario-card">
            <div className="usuario-avatar">
              {getTipoIcon(usuario.tipoUsuario)}
            </div>
            <div className="usuario-info">
              <h3>{usuario.nome}</h3>
              <p className="email">{usuario.email}</p>
              <span className={`tipo-badge tipo-${usuario.tipoUsuario?.toLowerCase()}`}>
                {usuario.tipoUsuario}
              </span>
            </div>
            <div className="usuario-actions">
              <button onClick={() => handleEdit(usuario)}>Editar</button>
              {usuario.tipoUsuario !== 'ADMIN' && (
                <button className="delete-btn" onClick={() => handleDelete(usuario.id)}>
                  Deletar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CrudUsuarios