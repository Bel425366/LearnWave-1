import { useState } from 'react'

const API_BASE = 'https://learnwaveback2.onrender.com/api'

function RedefinirSenha({ onConcluir }) {
  const token = new URLSearchParams(window.location.search).get('token')

  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')

    if (!token) {
      setErro('Link inválido. Solicite uma nova recuperação de senha.')
      return
    }
    if (novaSenha.length < 6) {
      setErro('A senha deve ter no mínimo 6 caracteres.')
      return
    }
    if (novaSenha !== confirmarSenha) {
      setErro('As senhas não coincidem.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/usuarios/redefinir-senha`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, novaSenha })
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setErro(data.mensagem || 'Não foi possível redefinir a senha. Tente novamente.')
        setLoading(false)
        return
      }

      setSucesso(data.mensagem || 'Senha redefinida com sucesso!')
      setTimeout(() => onConcluir(), 2000)
    } catch {
      setErro('Erro ao conectar com o servidor. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-split-wrapper" style={{ justifyContent: 'center' }}>
        <div className="auth-card" style={{ maxWidth: 440, width: '100%' }}>
          <div className="esqueceu-senha-header">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <h3>Redefinir Senha</h3>
          </div>

          {sucesso ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <p className="senha-sucesso" style={{ marginBottom: '1.5rem' }}>{sucesso}</p>
              <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>Redirecionando para o login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form">
              <p className="esqueceu-senha-info" style={{ marginBottom: '1.2rem' }}>
                Escolha uma nova senha para sua conta. Mínimo de 6 caracteres.
              </p>

              <div className="auth-field">
                <label>Nova senha</label>
                <div className="input-senha-wrapper">
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    placeholder="Digite a nova senha"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    required
                    autoComplete="new-password"
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

              <div className="auth-field">
                <label>Confirmar nova senha</label>
                <div className="input-senha-wrapper">
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    placeholder="Repita a nova senha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>

              {erro && <p className="senha-erro" style={{ marginTop: '0.5rem' }}>{erro}</p>}

              <button type="submit" className="auth-btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
                {loading ? 'Redefinindo...' : 'Redefinir senha'}
              </button>

              <div className="auth-card-footer">
                <button type="button" className="auth-back-btn" onClick={onConcluir}>
                  ← Voltar ao login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default RedefinirSenha
