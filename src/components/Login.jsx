import { useState } from 'react'

function Login({ onLogin, onNavigate }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    if (email && senha) {
      onLogin({ nome: email.split('@')[0], email })
      onNavigate('dashboard')
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
        <p>
          Não tem conta? 
          <button type="button" onClick={() => onNavigate('cadastro')}>
            Cadastre-se
          </button>
        </p>
      </form>
    </div>
  )
}

export default Login