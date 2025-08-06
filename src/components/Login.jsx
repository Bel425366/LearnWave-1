import { useState, useEffect } from 'react'
import { database } from '../utils/database'

function Login({ userType, onLogin, onNavigate }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  useEffect(() => {
    database.init()
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    if (email && senha) {
      try {
        database.init()
        console.log('Tentando login com:', { email: email.trim(), senha: senha.trim(), tipo: userType })
        const usuario = database.login(email.trim(), senha.trim(), userType)
        console.log('Login bem-sucedido:', usuario)
        onLogin(usuario)
        
        if (userType === 'aluno') {
          onNavigate('area-aluno')
        } else if (userType === 'professor') {
          onNavigate('painel-professor')
        } else if (userType === 'administrador') {
          onNavigate('painel-admin')
        }
      } catch (error) {
        console.log('Erro no login:', error.message)
        const usuarios = JSON.parse(localStorage.getItem('usuarios_db')) || []
        console.log('Todos os usuários no banco:', usuarios)
        alert('Email ou senha incorretos!')
      }
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
        {userType === 'administrador' ? (
          <p className="admin-info">
            <small>Administradores já estão cadastrados no sistema</small>
          </p>
        ) : (
          <p>
            Não tem conta? 
            <button type="button" onClick={() => onNavigate('cadastro')}>
              Cadastre-se aqui
            </button>
          </p>
        )}
        <p>
          <button type="button" onClick={() => onNavigate('user-type-selection')}>
            Voltar à seleção
          </button>
        </p>
      </form>
    </div>
  )
}

export default Login