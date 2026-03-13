import { useState } from 'react'
import './UserTypeSelection.css'
import Mascot from './Mascot'

const USER_TYPES = [
  { 
    id: 'aluno', 
    label: 'Aluno', 
    description: 'Aprenda e evolua com conteúdos personalizados',
    icon: (
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    ),
    color: '#667eea'
  },
  { 
    id: 'professor', 
    label: 'Professor', 
    description: 'Crie e compartilhe conhecimento',
    icon: (
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    color: '#f093fb'
  },
  { 
    id: 'administrador', 
    label: 'Administrador', 
    description: 'Gerencie e controle a plataforma',
    icon: (
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    color: '#4facfe'
  }
]

function UserTypeSelection({ onSelectUserType }) {
  const [selectedType, setSelectedType] = useState('')
  const [mascotMood, setMascotMood] = useState('happy')
  const [mascotMessage, setMascotMessage] = useState('Olá! Bem-vindo ao LearnWave! 👋')

  const handleCardHover = (type) => {
    if (type.id === 'aluno') {
      setMascotMood('excited')
      setMascotMessage('Ótima escolha! Vamos aprender juntos! 📚')
    } else if (type.id === 'professor') {
      setMascotMood('happy')
      setMascotMessage('Que legal! Você vai inspirar muitos alunos! 🎓')
    } else if (type.id === 'administrador') {
      setMascotMood('thinking')
      setMascotMessage('Administrador! Você terá controle total! 🛡️')
    }
  }

  const handleCardLeave = () => {
    if (!selectedType) {
      setMascotMood('happy')
      setMascotMessage('Escolha uma opção para começar! 😊')
    }
  }

  const handleCardClick = (typeId) => {
    setSelectedType(typeId)
    setMascotMood('excited')
    setMascotMessage('Perfeito! Agora clique em "Começar"! 🚀')
  }

  const handleContinue = () => {
    if (selectedType) {
      setMascotMood('waving')
      setMascotMessage('Vamos lá! Boa sorte! 🎉')
      setTimeout(() => {
        onSelectUserType(selectedType)
      }, 500)
    }
  }

  return (
    <div className="auth-container">
      <div className="selection-wrapper-split">
        <div className="selection-left">
          <div className="selection-brand">
            <div className="brand-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <h1 className="brand-name">LearnWave</h1>
            <p className="brand-tagline">Sua jornada de aprendizado começa aqui</p>
          </div>

          <div className="selection-content">
            <h2 className="selection-question">Como você deseja continuar?</h2>
            
            <div className="type-cards">
              {USER_TYPES.map(type => (
                <div
                  key={type.id}
                  className={`type-card ${selectedType === type.id ? 'active' : ''}`}
                  onClick={() => handleCardClick(type.id)}
                  onMouseEnter={() => handleCardHover(type)}
                  onMouseLeave={handleCardLeave}
                  style={{'--accent-color': type.color}}
                >
                  <div className="card-glow"></div>
                  <div className="card-icon">{type.icon}</div>
                  <div className="card-content">
                    <h3 className="card-label">{type.label}</h3>
                    <p className="card-desc">{type.description}</p>
                  </div>
                  <div className="card-indicator">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            <button 
              className="btn-start" 
              onClick={handleContinue}
              disabled={!selectedType}
            >
              <span>Começar</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="selection-right">
          <Mascot mood={mascotMood} message={mascotMessage} position="right" />
        </div>
      </div>
    </div>
  )
}

export default UserTypeSelection
