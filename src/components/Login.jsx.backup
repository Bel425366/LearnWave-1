import { useState } from 'react'
import UsuarioAPI from '../services/api-learnwave'

function Login({ userType, onLogin, onNavigate }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [showEsqueceuSenha, setShowEsqueceuSenha] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    if (email && senha) {
      try {
        const tipoUsuario = userType.toUpperCase()
        const usuario = await UsuarioAPI.login(email.trim(), senha.trim(), tipoUsuario)
        onLogin(usuario)
        
        const tipo = usuario.tipoUsuario?.toLowerCase() || userType
        if (tipo === 'aluno') {
          onNavigate('area-aluno')
        } else if (tipo === 'professor') {
          onNavigate('painel-professor')
        } else if (tipo === 'administrador') {
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
        
        <p>
          <button type="button" className="esqueceu-senha-btn" onClick={() => setShowEsqueceuSenha(true)}>
            Esqueceu a senha?
          </button>
        </p>
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
      
      {showEsqueceuSenha && (
        <EsqueceuSenha 
          onClose={() => setShowEsqueceuSenha(false)} 
          userType={userType}
        />
      )}
    </div>
  )
}

export default Login
function EsqueceuSenha({ onClose, userType }) {
  const [email, setEmail] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [step, setStep] = useState(1) // 1: email, 2: nova senha

  const verificarEmail = (e) => {
    e.preventDefault()
    
    try {
      const usuarios = JSON.parse(localStorage.getItem('learnwave_users') || '[]')
      const usuario = usuarios.find(u => u.email === email && u.tipo === userType)
      
      if (!usuario) {
        alert('Email não encontrado para este tipo de usuário!')
        return
      }
      
      setStep(2)
    } catch (error) {
      alert('Erro ao verificar email. Tente novamente.')
    }
  }

  const redefinirSenha = (e) => {
    e.preventDefault()
    
    if (novaSenha !== confirmarSenha) {
      alert('Senhas não coincidem!')
      return
    }

    if (novaSenha.length < 6) {
      alert('Nova senha deve ter pelo menos 6 caracteres!')
      return
    }

    try {
      const usuarios = JSON.parse(localStorage.getItem('learnwave_users') || '[]')
      const usuarioIndex = usuarios.findIndex(u => u.email === email)
      
      if (usuarioIndex !== -1) {
        usuarios[usuarioIndex].senha = novaSenha
        localStorage.setItem('learnwave_users', JSON.stringify(usuarios))
        alert('Senha redefinida com sucesso!')
        onClose()
      }
    } catch (error) {
      alert('Erro ao redefinir senha. Tente novamente.')
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content esqueceu-senha-modal">
        <h3>🔒 Redefinir Senha</h3>
        
        {step === 1 ? (
          <form onSubmit={verificarEmail}>
            <p>Digite seu email para redefinir a senha:</p>
            <input
              type="email"
              placeholder="Seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn-confirm">
                Verificar Email
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={redefinirSenha}>
            <p>Email: <strong>{email}</strong></p>
            <p>Digite sua nova senha:</p>
            <input
              type="password"
              placeholder="Nova senha (mín. 6 caracteres)"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirmar nova senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
            />
            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={() => setStep(1)}>
                Voltar
              </button>
              <button type="submit" className="btn-confirm">
                Redefinir Senha
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}