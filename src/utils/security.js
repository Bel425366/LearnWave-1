// Utilitários de segurança
export const Security = {
  // Criptografia simples para dados sensíveis
  encrypt: (text) => {
    return btoa(encodeURIComponent(text))
  },

  decrypt: (encrypted) => {
    try {
      return decodeURIComponent(atob(encrypted))
    } catch {
      return null
    }
  },

  // Validação de sessão
  isValidSession: () => {
    const user = localStorage.getItem('currentUser')
    const sessionTime = localStorage.getItem('sessionTime')
    
    if (!user || !sessionTime) return false
    
    // Sessão expira em 24 horas
    const now = Date.now()
    const sessionStart = parseInt(sessionTime)
    const sessionDuration = 24 * 60 * 60 * 1000 // 24 horas
    
    return (now - sessionStart) < sessionDuration
  },

  // Criar sessão segura
  createSession: (userData) => {
    const encrypted = Security.encrypt(JSON.stringify(userData))
    localStorage.setItem('currentUser', encrypted)
    localStorage.setItem('sessionTime', Date.now().toString())
  },

  // Obter dados da sessão
  getSessionData: () => {
    if (!Security.isValidSession()) {
      Security.clearSession()
      return null
    }
    
    const encrypted = localStorage.getItem('currentUser')
    if (!encrypted) return null
    
    const decrypted = Security.decrypt(encrypted)
    try {
      return JSON.parse(decrypted)
    } catch {
      return null
    }
  },

  // Limpar sessão
  clearSession: () => {
    localStorage.removeItem('currentUser')
    localStorage.removeItem('sessionTime')
    localStorage.removeItem('currentPage')
    localStorage.removeItem('userType')
    localStorage.removeItem('selectedArea')
  },

  // Sanitizar entrada do usuário
  sanitizeInput: (input) => {
    if (typeof input !== 'string') return input
    
    return input
      .replace(/[<>]/g, '') // Remove < e >
      .replace(/javascript:/gi, '') // Remove javascript:
      .replace(/on\w+=/gi, '') // Remove eventos onclick, onload, etc
      .trim()
  },

  // Validar email
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  // Validar senha forte
  isStrongPassword: (password) => {
    return password.length >= 6 && 
           /[A-Za-z]/.test(password) && 
           /[0-9]/.test(password)
  }
}