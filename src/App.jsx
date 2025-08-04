import { useState } from 'react'
import Login from './components/Login'
import Cadastro from './components/Cadastro'
import Dashboard from './components/Dashboard'
import Videoaulas from './components/Videoaulas'
import Atividades from './components/Atividades'
import Materiais from './components/Materiais'
import AreaAluno from './components/AreaAluno'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('login')
  const [user, setUser] = useState(null)
  const [selectedArea, setSelectedArea] = useState('')
  const [isDarkTheme, setIsDarkTheme] = useState(true)

  const navigate = (page, area = '') => {
    setCurrentPage(page)
    if (area) setSelectedArea(area)
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login onLogin={setUser} onNavigate={navigate} />
      case 'cadastro':
        return <Cadastro onNavigate={navigate} />
      case 'dashboard':
        return <Dashboard user={user} onNavigate={navigate} />
      case 'videoaulas':
        return <Videoaulas area={selectedArea} onNavigate={navigate} />
      case 'atividades':
        return <Atividades area={selectedArea} onNavigate={navigate} />
      case 'materiais':
        return <Materiais area={selectedArea} onNavigate={navigate} />
      case 'area-aluno':
        return <AreaAluno user={user} onNavigate={navigate} />
      default:
        return <Login onLogin={setUser} onNavigate={navigate} />
    }
  }

  return (
    <div className={`app ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
      <header className="header">
        <div className="header-content">
          <h1>
            <span className="graduation-cap">🎓</span>
            LearnWave - Português
          </h1>
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
                <span>Olá, {user.nome}!</span>
                <button onClick={() => { setUser(null); navigate('login') }}>Sair</button>
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