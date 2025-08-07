import { useState } from 'react'

const USER_TYPES = [
  { id: 'aluno', label: 'Aluno', icon: '🎓' },
  { id: 'professor', label: 'Professor', icon: '👨‍🏫' },
  { id: 'administrador', label: 'Administrador', icon: '⚙️' }
]

function UserTypeSelection({ onSelectUserType }) {
  const [selectedType, setSelectedType] = useState('')

  const userTypes = [
    { id: 'aluno', label: 'Aluno', icon: '👨‍🎓' },
    { id: 'professor', label: 'Professor', icon: '👨‍🏫' },
    { id: 'administrador', label: 'Administrador', icon: '👨‍💼' }
  ]

  const handleContinue = () => {
    if (selectedType) {
      onSelectUserType(selectedType)
    }
  }

  return (
    <div className="auth-container">
      <div className="user-type-selection">
        <h2>Você é:</h2>
        <div className="user-type-options">
          {USER_TYPES.map(type => (
            <button
              key={type.id}
              className={`user-type-option ${selectedType === type.id ? 'selected' : ''}`}
              onClick={() => setSelectedType(type.id)}
            >
              <span className="user-type-icon">{type.icon}</span>
              <span className="user-type-label">{type.label}</span>
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
  )
}

export default UserTypeSelection