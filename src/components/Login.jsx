import { useState } from 'react'
import { localDB } from '../services/localDatabase'

function Login({ userType, onLogin, onNavigate }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')



  const handleLogin = (e) => {
    e.preventDefault()
    if (email && senha) {
      try {
        const usuario = localDB.login(email.trim(), senha.trim(), userType)
        onLogin(usuario)
        
        if (userType === 'aluno') {
          onNavigate('area-aluno')
        } else if (userType === 'professor') {
          onNavigate('painel-professor')
        } else if (userType === 'administrador') {
          onNavigate('painel-admin')
        }
      } catch (error) {
        alert(error.message)
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