import { useState } from 'react'
import UserTypeSelection from './components/UserTypeSelection'
import Login from './components/Login'
import Cadastro from './components/Cadastro'
import Dashboard from './components/Dashboard'
import PainelProfessor from './components/PainelProfessor'
import PainelAdmin from './components/PainelAdmin'
import Videoaulas from './components/Videoaulas'
import Atividades from './components/Atividades'
import Materiais from './components/Materiais'
import AreaAluno from './components/AreaAluno'
// import logo from './assets/logo.png' // Descomente se usar assets
import './App.css'
import './admin-styles.css'

function App() {
  const [currentPage, setCurrentPage] = useState('user-type-selection')
  const [userType, setUserType] = useState('')
  const [user, setUser] = useState(null)
  const [selectedArea, setSelectedArea] = useState('')
  const [isDarkTheme, setIsDarkTheme] = useState(true)

  const navigate = (page, area = '') => {
    setCurrentPage(page)
    if (area) setSelectedArea(area)
  }

  const handleUserTypeSelection = (type) => {
    setUserType(type)
    navigate('login')
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'user-type-selection':
        return <UserTypeSelection onSelectUserType={handleUserTypeSelection} />
      case 'login':
        return <Login userType={userType} onLogin={setUser} onNavigate={navigate} />
      case 'cadastro':
        return <Cadastro userType={userType} onNavigate={navigate} />
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
            <h1>LearnWave - Português</h1>
          </div>
          <div className="header-actions">
            <button 
              className="theme-toggle" 
              onClick={() => setIsDarkTheme(!isDarkTheme)}
              title={isDarkTheme ? 'Tema Claro' : 'Tema Escuro'}
            >
              {isDarkTheme ? '☀️' : '🌙'}
            </button>
            {user && (
              <div className="user-info">
                <span>Olá, {user.nome}! ({user.tipo})</span>
                <button onClick={() => { setUser(null); setUserType(''); navigate('user-type-selection') }}>Sair</button>
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