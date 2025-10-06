import { useState, useEffect } from 'react'
import { userService } from '../services/userService'
import './GerenciarUsuarios.css'

function GerenciarUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [editando, setEditando] = useState(null)
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
      const data = await userService.listarUsuarios()
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
        await userService.atualizar(editando, formData)
        alert('Usuário atualizado com sucesso!')
      } else {
        await userService.cadastrar(formData)
        alert('Usuário criado com sucesso!')
      }
      
      setFormData({
        nome: '',
        email: '',
        tipoUsuario: 'ALUNO',
        areaEnsino: '',
        formacao: '',
        experiencia: ''
      })
      setEditando(null)
      carregarUsuarios()
    } catch (error) {
      alert('Erro: ' + error.message)
    }
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
  }

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja deletar este usuário?')) {
      try {
        await userService.deletar(id)
        alert('Usuário deletado com sucesso!')
        carregarUsuarios()
      } catch (error) {
        alert('Erro ao deletar usuário: ' + error.message)
      }
    }
  }

  const cancelarEdicao = () => {
    setEditando(null)
    setFormData({
      nome: '',
      email: '',
      tipoUsuario: 'ALUNO',
      areaEnsino: '',
      formacao: '',
      experiencia: ''
    })
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div className="gerenciar-usuarios">
      <h2>Gerenciar Usuários</h2>
      
      <form onSubmit={handleSubmit} className="usuario-form">
        <h3>{editando ? 'Editar Usuário' : 'Novo Usuário'}</h3>
        
        <input
          type="text"
          placeholder="Nome"
          value={formData.nome}
          onChange={(e) => setFormData({...formData, nome: e.target.value})}
          required
        />
        
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
        
        <select
          value={formData.tipoUsuario}
          onChange={(e) => setFormData({...formData, tipoUsuario: e.target.value})}
        >
          <option value="ALUNO">Aluno</option>
          <option value="PROFESSOR">Professor</option>
          <option value="ADMIN">Administrador</option>
        </select>
        
        {formData.tipoUsuario === 'PROFESSOR' && (
          <>
            <input
              type="text"
              placeholder="Área de Ensino"
              value={formData.areaEnsino}
              onChange={(e) => setFormData({...formData, areaEnsino: e.target.value})}
            />
            
            <input
              type="text"
              placeholder="Formação"
              value={formData.formacao}
              onChange={(e) => setFormData({...formData, formacao: e.target.value})}
            />
            
            <input
              type="text"
              placeholder="Experiência"
              value={formData.experiencia}
              onChange={(e) => setFormData({...formData, experiencia: e.target.value})}
            />
          </>
        )}
        
        <div className="form-actions">
          <button type="submit">
            {editando ? 'Atualizar' : 'Criar'}
          </button>
          {editando && (
            <button type="button" onClick={cancelarEdicao}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="usuarios-lista">
        <h3>Lista de Usuários</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Tipo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(usuario => (
              <tr key={usuario.id}>
                <td>{usuario.id}</td>
                <td>{usuario.nome}</td>
                <td>{usuario.email}</td>
                <td>{usuario.tipoUsuario}</td>
                <td>
                  <button onClick={() => handleEdit(usuario)}>
                    Editar
                  </button>
                  <button onClick={() => handleDelete(usuario.id)}>
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default GerenciarUsuarios