import { useState, useEffect } from 'react'
import UserTypeSelection from './components/UserTypeSelection'
import Login from './components/Login'
import Cadastro from './components/Cadastro'
import CadastroProfessor from './components/CadastroProfessor'
import PainelProfessor from './components/PainelProfessor'
import PainelAdmin from './components/PainelAdmin'
import AreaAluno from './components/AreaAluno'
import Preloader from './components/Preloader'
import Mascot from './components/Mascot'
import { Security } from './utils/security'
import './App.css'
import './admin-styles.css'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('currentPage') || 'user-type-selection'
  })
  const [userType, setUserType] = useState(() => {
    return localStorage.getItem('userType') || ''
  })
  const [user, setUser] = useState(() => {
    return Security.getSessionData()
  })
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const saved = localStorage.getItem('isDarkTheme')
    return saved ? JSON.parse(saved) : true
  })
  const [perfilAtualizado, setPerfilAtualizado] = useState(0)
  const [userPerfil, setUserPerfil] = useState(null)

  // Preloader
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  // Carregar perfil da API quando user muda
  useEffect(() => {
    if (user && user.id) {
      fetch(`https://learnwaveback2.onrender.com/api/usuarios/${user.id}/perfil`)
        .then(r => r.ok ? r.json() : null)
        .then(data => setUserPerfil(data))
        .catch(() => setUserPerfil(null))
    } else {
      setUserPerfil(null)
    }
  }, [user, perfilAtualizado])

  // Força re-render quando perfil é atualizado
  useEffect(() => {
    const handlePerfilChange = () => setPerfilAtualizado(prev => prev + 1)
    window.addEventListener('perfilAtualizado', handlePerfilChange)
    return () => window.removeEventListener('perfilAtualizado', handlePerfilChange)
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

  const navigate = (page) => {
    setCurrentPage(page)
    localStorage.setItem('currentPage', page)
  }

  const handleUserTypeSelection = (type) => {
    setUserType(type)
    localStorage.setItem('userType', type)
    if (type === 'professor') {
      navigate('cadastro')
    } else {
      navigate('login')
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'user-type-selection':
        return <UserTypeSelection onSelectUserType={handleUserTypeSelection} />
      case 'login':
      case 'login-professor':
        return <Login userType={userType} onLogin={(userData) => {
          setUser(userData)
          Security.createSession(userData)
        }} onNavigate={navigate} />
      case 'cadastro':
        return <Cadastro userType={userType} onNavigate={navigate} />
      case 'cadastro-professor':
        return <CadastroProfessor onNavigate={navigate} />
      case 'painel-professor':
        return <PainelProfessor user={user} onNavigate={navigate} />
      case 'painel-admin':
        return <PainelAdmin user={user} onNavigate={navigate} />
      case 'area-aluno':
        return <AreaAluno user={user} onNavigate={navigate} />
      default:
        return <UserTypeSelection onSelectUserType={handleUserTypeSelection} />
    }
  }

  if (isLoading) {
    return <Preloader />
  }

  return (
    <div className={`app ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
      <header className="header">
        <div className="header-content">
          <div className="logo-container">
            <img 
              src="/logo.svg" 
              alt="LearnWave Logo" 
              className="site-logo"
            />
            <h1>LearnWave</h1>
          </div>
          <div className="header-actions">
            {currentPage === 'area-aluno' && <Mascot mini isAluno />}
            <button 
              className="theme-toggle" 
              onClick={() => {
                const newTheme = !isDarkTheme
                setIsDarkTheme(newTheme)
                localStorage.setItem('isDarkTheme', JSON.stringify(newTheme))
              }}
              title={isDarkTheme ? 'Tema Claro' : 'Tema Escuro'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                {isDarkTheme ? (
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
                ) : (
                  <path d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"/>
                )}
              </svg>
            </button>
            {user && (
              <div className="user-info">
                {userPerfil?.fotoPerfil && (
                  <img src={userPerfil.fotoPerfil} alt="Perfil" className="header-foto-perfil" />
                )}
                <span>Olá, {Security.sanitizeInput(userPerfil?.nome || user.nome)}! ({user.tipo})</span>
                <button onClick={() => { 
                  setUser(null)
                  setUserType('')
                  setUserPerfil(null)
                  Security.clearSession()
                  navigate('user-type-selection')
                }}>Sair</button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main>{renderPage()}</main>
      <Footer />
    </div>
  )
}

function Footer() {
  const [modal, setModal] = useState(null)

  const conteudos = {
    sobre: {
      titulo: 'Sobre o LearnWave',
      texto: 'O LearnWave é uma plataforma educacional de Língua Portuguesa, criada para conectar alunos e professores em um ambiente de aprendizado moderno e interativo. Nossa missão é tornar o ensino de português mais acessível, dinâmico e eficiente através da tecnologia.'
    },
    privacidade: {
      titulo: 'Política de Privacidade',
      texto: 'O LearnWave respeita a privacidade dos seus usuários. Coletamos apenas dados necessários para o funcionamento da plataforma (nome, email, progresso acadêmico). Seus dados não são compartilhados com terceiros e são armazenados de forma segura. Você pode solicitar a exclusão dos seus dados a qualquer momento entrando em contato com o administrador.'
    },
    termos: {
      titulo: 'Termos de Uso',
      texto: 'Ao utilizar o LearnWave, você concorda em: usar a plataforma exclusivamente para fins educacionais; manter suas credenciais de acesso em sigilo; respeitar professores, alunos e demais usuários; não compartilhar conteúdo protegido por direitos autorais. O LearnWave reserva-se o direito de suspender contas que violem estes termos.'
    }
  }

  return (
    <>
      <footer className="site-footer">
        <p className="footer-copy">© 2024 LearnWave. Todos os direitos reservados.</p>
        <div className="footer-links">
          <button onClick={() => setModal('sobre')}>Sobre</button>
          <span className="footer-dot" />
          <button onClick={() => setModal('privacidade')}>Privacidade</button>
          <span className="footer-dot" />
          <button onClick={() => setModal('termos')}>Termos</button>
        </div>
      </footer>

      {modal && (
        <div className="footer-modal-overlay" onClick={() => setModal(null)}>
          <div className="footer-modal" onClick={(e) => e.stopPropagation()}>
            <button className="footer-modal-close" onClick={() => setModal(null)}>×</button>
            <h3>{conteudos[modal].titulo}</h3>
            <p>{conteudos[modal].texto}</p>
          </div>
        </div>
      )}
    </>
  )
}

export default App