import { useState } from 'react'

const USER_TYPES = [
  { 
    id: 'aluno', 
    label: 'Aluno', 
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
      </svg>
    )
  },
  { 
    id: 'professor', 
    label: 'Professor', 
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L12 2L3 7V9C3 10.1 3.9 11 5 11V16.5C5 17.3 5.7 18 6.5 18S8 17.3 8 16.5V14H16V16.5C16 17.3 16.7 18 17.5 18S19 17.3 19 16.5V11C20.1 11 21 10.1 21 9Z"/>
      </svg>
    )
  },
  { 
    id: 'administrador', 
    label: 'Administrador', 
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
      </svg>
    )
  }
]

function UserTypeSelection({ onSelectUserType }) {
  const [selectedType, setSelectedType] = useState('')

  const handleContinue = () => {
    if (selectedType) {
      onSelectUserType(selectedType)
    }
  }

  return (
    <div className="auth-container">
      <div className="welcome-section">
        <div className="brand-section">
          <img src="/logo.svg" alt="LearnWave" className="brand-logo" />
          <div className="brand-text">
            <h1>LearnWave</h1>
            <p>Plataforma Educacional</p>
          </div>
        </div>
        <div className="user-type-selection">
          <h2>Como você quer acessar?</h2>
        <div className="user-type-options">
          {USER_TYPES.map(type => (
            <button
              key={type.id}
              className={`user-type-option ${selectedType === type.id ? 'selected' : ''}`}
              onClick={() => setSelectedType(type.id)}
            >
              <div className="user-type-icon">{type.icon}</div>
              <div className="user-type-content">
                <span className="user-type-label">{type.label}</span>
                <span className="user-type-description">
                  {type.id === 'aluno' && 'Acesse conteúdos e atividades'}
                  {type.id === 'professor' && 'Gerencie turmas e materiais'}
                  {type.id === 'administrador' && 'Controle total da plataforma'}
                </span>
              </div>
            </button>
          ))}
          </div>
          <button 
            className="continue-btn" 
            onClick={handleContinue}
            disabled={!selectedType}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserTypeSelection