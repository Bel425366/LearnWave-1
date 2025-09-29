const REQUIREMENTS = [
  { id: 'length', text: 'Mínimo 8 caracteres', test: (pwd) => pwd.length >= 8 },
  { id: 'uppercase', text: 'Pelo menos 1 letra maiúscula', test: (pwd) => /[A-Z]/.test(pwd) },
  { id: 'lowercase', text: 'Pelo menos 1 letra minúscula', test: (pwd) => /[a-z]/.test(pwd) },
  { id: 'number', text: 'Pelo menos 1 número', test: (pwd) => /\d/.test(pwd) },
  { id: 'special', text: 'Pelo menos 1 caractere especial', test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) }
]

function PasswordValidator({ password }) {
  return (
    <div className="password-validator">
      <h4>Requisitos da senha:</h4>
      <ul className="requirements-list">
        {REQUIREMENTS.map(req => {
          const isValid = req.test(password)
          return (
            <li key={req.id} className={`requirement ${isValid ? 'valid' : 'invalid'}`}>
              <span className="requirement-icon">{isValid ? '✓' : '✗'}</span>
              {req.text}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default PasswordValidator