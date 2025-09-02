import { useState, useEffect } from 'react'
import UserTypeSelection from './components/UserTypeSelection'
import Login from './components/Login'
import Cadastro from './components/Cadastro'
import CadastroProfessor from './components/CadastroProfessor'
import Dashboard from './components/Dashboard'
import PainelProfessor from './components/PainelProfessor'
import PainelAdmin from './components/PainelAdmin'
import Videoaulas from './components/Videoaulas'
import Atividades from './components/Atividades'
import Materiais from './components/Materiais'
import AreaAluno from './components/AreaAluno'
import { Security } from './utils/security'
import './App.css'
import './admin-styles.css'

function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('currentPage') || 'user-type-selection'
  })
  const [userType, setUserType] = useState(() => {
    return localStorage.getItem('userType') || ''
  })
  const [user, setUser] = useState(() => {
    return Security.getSessionData()
  })
  const [selectedArea, setSelectedArea] = useState(() => {
    return localStorage.getItem('selectedArea') || ''
  })
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const saved = localStorage.getItem('isDarkTheme')
    return saved ? JSON.parse(saved) : true
  })
  const [perfilAtualizado, setPerfilAtualizado] = useState(0)

  // Força re-render quando perfil é atualizado
  useEffect(() => {
    const handleStorageChange = () => setPerfilAtualizado(prev => prev + 1)
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Verificar sessão periodicamente
  useEffect(() => {
    const checkSession = () => {
      if (user && !Security.isValidSession()) {
        setUser(null)
        setUserType('')
        navigate('user-type-selection')
        alert('Sua sessão expirou. Faça login novamente.')
      }
    }
    
    const interval = setInterval(checkSession, 60000) // Verifica a cada minuto
    return () => clearInterval(interval)
  }, [user])

  const navigate = (page, area = '') => {
    setCurrentPage(page)
    localStorage.setItem('currentPage', page)
    if (area) {
      setSelectedArea(area)
      localStorage.setItem('selectedArea', area)
    }
  }

  const handleUserTypeSelection = (type) => {
    setUserType(type)
    localStorage.setItem('userType', type)
    if (type === 'professor') {
      navigate('cadastro-professor')
    } else {
      navigate('login')
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'user-type-selection':
        return <UserTypeSelection onSelectUserType={handleUserTypeSelection} />
      case 'login':
        return <Login userType={userType} onLogin={(userData) => {
          setUser(userData)
          Security.createSession(userData)
        }} onNavigate={navigate} />
      case 'cadastro':
        return <Cadastro userType={userType} onNavigate={navigate} />
      case 'cadastro-professor':
        return <CadastroProfessor onNavigate={navigate} />
      case 'dashboard':
        return <Dashboard user={user} userType={user?.tipo || userType} onNavigate={navigate} />
      case 'painel-professor':
        return <PainelProfessor user={user} onNavigate={navigate} />
      case 'painel-admin':
        return <PainelAdmin user={user} onNavigate={navigate} />
      case 'videoaulas':
        return <Videoaulas area={selectedArea} onNavigate={navigate} />
      case 'atividades':
        return <Atividades area={selectedArea} onNavigate={navigate} />
      case 'materiais':
        return <Materiais area={selectedArea} onNavigate={navigate} />
      case 'area-aluno':
        return <AreaAluno user={user} onNavigate={navigate} />
      default:
        return <UserTypeSelection onSelectUserType={handleUserTypeSelection} />
    }
  }

  return (
    <div className={`app ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
      <header className="header">
        <div className="header-content">
          <div className="logo-container">
            <img 
              src="/image.png" 
              alt="LearnWave Logo" 
              className="site-logo"
            />
            <h1>LearnWave - Plataforma Educacional</h1>
          </div>
          <div className="header-actions">
            <button 
              className="theme-toggle" 
              onClick={() => {
                const newTheme = !isDarkTheme
                setIsDarkTheme(newTheme)
                localStorage.setItem('isDarkTheme', JSON.stringify(newTheme))
              }}
              title={isDarkTheme ? 'Tema Claro' : 'Tema Escuro'}
            >
              {isDarkTheme ? '☀️' : '🌙'}
            </button>
            {user && (
              <div className="user-info">
                {(() => {
                  try {
                    const perfil = JSON.parse(localStorage.getItem(`perfil_${user.email}`))
                    return perfil?.fotoPerfil ? (
                      <img src={perfil.fotoPerfil} alt="Perfil" className="header-foto-perfil" />
                    ) : null
                  } catch {
                    return null
                  }
                })()}
                <span>Olá, {(() => {
                  try {
                    const perfil = JSON.parse(localStorage.getItem(`perfil_${user.email}`))
                    return Security.sanitizeInput(perfil?.apelido || user.nome)
                  } catch {
                    return Security.sanitizeInput(user.nome)
                  }
                })()}! ({user.tipo})</span>
                <button onClick={() => { 
                  setUser(null)
                  setUserType('')
                  Security.clearSession()
                  navigate('user-type-selection')
                }}>Sair</button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main>{renderPage()}</main>
    </div>
  )
}

export default App