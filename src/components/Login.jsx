import { useState } from 'react'
import UsuarioAPI from '../services/api-learnwave'
import Mascot from './Mascot'

const USER_TYPE_CONFIG = {
  aluno: {
    label: 'Aluno',
    color: '#667eea',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    )
  },
  professor: {
    label: 'Professor',
    color: '#f093fb',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    )
  },
  administrador: {
    label: 'Administrador',
    color: '#4facfe',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    )
  }
}

function Login({ userType, onLogin, onNavigate }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [showEsqueceuSenha, setShowEsqueceuSenha] = useState(false)
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [mascotMessage, setMascotMessage] = useState('Bem-vindo de volta! Digite seus dados para entrar.')

  const config = USER_TYPE_CONFIG[userType] || USER_TYPE_CONFIG.aluno

  const handleLogin = async (e) => {
    e.preventDefault()
    setErro('')
    if (email && senha) {
      setLoading(true)
      setMascotMessage('Verificando seus dados...')
      try {
        const tipoUsuario = userType.toUpperCase()
        const usuario = await UsuarioAPI.login(email.trim(), senha.trim(), tipoUsuario)
        onLogin(usuario)

        setMascotMessage('Login realizado! Redirecionando...')
        const tipo = (usuario.tipoUsuario || usuario.tipo || userType).toLowerCase()
        if (tipo === 'aluno' || tipo === 'estudante') {
          onNavigate('area-aluno')
        } else if (tipo === 'professor') {
          onNavigate('painel-professor')
        } else if (tipo === 'admin' || tipo === 'administrador') {
          onNavigate('painel-admin')
        }
      } catch (error) {
        setErro(error.message)
        setMascotMessage('Ops, algo deu errado. Confere os dados!')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-split-wrapper">
        <div className="auth-split-left">
          <Mascot message={mascotMessage} />
        </div>
        <div className="auth-split-right">
          <div className="auth-card">
            {/* Header com tipo de usuário */}
            <div className="auth-card-header">
              <div className="auth-card-icon" style={{ background: `linear-gradient(135deg, ${config.color}, ${config.color}dd)` }}>
                {config.icon}
              </div>
              <div>
                <h2 className="auth-card-title">Entrar</h2>
                <p className="auth-card-subtitle">{config.label}</p>
              </div>
            </div>

            <form onSubmit={handleLogin}>
              <div className="auth-field">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setMascotMessage('Digite o email que você usou no cadastro!')}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="auth-field">
                <label>Senha</label>
                <div className="input-senha-wrapper">
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    placeholder="Sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    onFocus={() => setMascotMessage('Agora a senha. Eu não vou espiar!')}
                    required
                    autoComplete="current-password"
                  />
                  <button type="button" className="btn-olho" onClick={() => setMostrarSenha(!mostrarSenha)} tabIndex={-1} aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}>
                    {mostrarSenha ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </div>

              {erro && (
                <div className="auth-erro">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span>{erro}</span>
                </div>
              )}

              <button
                type="submit"
                className="auth-btn-primary"
                disabled={loading}
                onMouseEnter={() => setMascotMessage('Bora entrar!')}
              >
                {loading ? 'Entrando...' : 'Entrar'}
                {!loading && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                )}
              </button>
            </form>

            {/* Esqueceu a senha */}
            <div className="auth-esqueceu-senha">
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => setShowEsqueceuSenha(true)}
                onMouseEnter={() => setMascotMessage('Esqueceu a senha? Sem problemas!')}
              >
                Esqueceu a senha?
              </button>
            </div>

            {/* Footer */}
            <div className="auth-card-footer">
              {userType === 'administrador' ? (
                <p className="auth-footer-text auth-admin-note">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                  Administradores já estão cadastrados no sistema
                </p>
              ) : (
                <p className="auth-footer-text">
                  Não tem conta?&nbsp;
                  <button
                    type="button"
                    className="auth-link-btn"
                    onClick={() => onNavigate('cadastro')}
                    onMouseEnter={() => setMascotMessage('Vamos criar sua conta!')}
                  >
                    Cadastre-se
                  </button>
                </p>
              )}
              <button
                type="button"
                className="auth-back-btn"
                onClick={() => onNavigate('user-type-selection')}
                onMouseEnter={() => setMascotMessage('Voltando para a seleção...')}
              >
                ← Voltar à seleção
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Esqueceu Senha */}
      {showEsqueceuSenha && (
        <div className="modal-overlay" onClick={() => setShowEsqueceuSenha(false)}>
          <div className="modal-content esqueceu-senha-modal" onClick={(e) => e.stopPropagation()}>
            <div className="esqueceu-senha-header">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <h3>Recuperar Senha</h3>
            </div>
            <p className="esqueceu-senha-info">
              Para redefinir sua senha, entre em contato com o administrador da plataforma informando seu email de cadastro.
            </p>
            <p className="esqueceu-senha-dica">
              <strong>Dica:</strong> Verifique se está usando o email correto e tente novamente. Lembre-se que a senha diferencia maiúsculas de minúsculas.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn-confirm"
                onClick={() => setShowEsqueceuSenha(false)}
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Login