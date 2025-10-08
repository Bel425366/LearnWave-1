import { useState, useEffect } from 'react'
import { userService } from '../services/userService'
import './GerenciarUsuarios.css'

function GerenciarUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)


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



  if (loading) return <div>Carregando...</div>

  return (
    <div className="gerenciar-usuarios">
      <h2>Gerenciar Usuários</h2>
      


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