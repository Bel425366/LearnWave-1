import { useState } from 'react'
import Mascot from './Mascot'
import './UserTypeSelection.css'

const USER_TYPES = [
  {
    id: 'aluno',
    label: 'Aluno',
    description: 'Acesse conteúdos, atividades e acompanhe seu progresso.',
    accentColor: '#38BDF8',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    )
  },
  {
    id: 'professor',
    label: 'Professor',
    description: 'Gerencie turmas, conteúdos e acompanhe seus alunos.',
    accentColor: '#A78BFA',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    )
  },
  {
    id: 'administrador',
    label: 'Administrador',
    description: 'Controle total da plataforma e suas funcionalidades.',
    accentColor: '#22D3EE',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    )
  }
]

const HOVER_MESSAGES = {
  aluno: 'Boa escolha! Como aluno você terá acesso a atividades, videoaulas e materiais.',
  professor: 'Que ótimo! Como professor você pode criar atividades e acompanhar seus alunos.',
  administrador: 'Acesso total à plataforma. Bem-vindo, administrador!'
}

function UserTypeSelection({ onSelectUserType }) {
  const [hoverMessage, setHoverMessage] = useState('Oi! Eu sou o Bob. Selecione como deseja acessar o LearnWave!')

  return (
    <div className="auth-container">
      <div className="selection-wrapper-split">
        <div className="selection-left">
          <div className="selection-brand">
            <div className="brand-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <h1 className="brand-name"><span className="brand-learn">Learn</span><span className="brand-wave">Wave</span></h1>
            <p className="brand-tagline">Plataforma educacional de Língua Portuguesa</p>
            <div className="brand-bar" />
          </div>

          <div className="selection-content">
            <p className="selection-question">Como você deseja acessar?</p>
            <div className="selection-question-bar" />

            <div className="type-cards">
              {USER_TYPES.map(type => (
                <div
                  key={type.id}
                  className="type-card"
                  style={{ '--accent-color': type.accentColor }}
                  onMouseEnter={() => setHoverMessage(HOVER_MESSAGES[type.id])}
                  onMouseLeave={() => setHoverMessage('Oi! Eu sou o Bob. Selecione como deseja acessar o LearnWave!')}
                >
                  <div className="card-glow" />
                  <div className="card-icon">{type.icon}</div>
                  <div className="card-content">
                    <span className="card-label">{type.label}</span>
                    <span className="card-desc">{type.description}</span>
                  </div>
                  <button
                    className="card-action-btn"
                    onClick={() => onSelectUserType(type.id)}
                  >
                    Acessar como {type.label}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="selection-right">
          <Mascot mood="happy" />
        </div>
      </div>
    </div>
  )
}

export default UserTypeSelection
