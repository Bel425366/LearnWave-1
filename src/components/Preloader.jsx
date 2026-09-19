import { useEffect, useState } from 'react'

function Preloader() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="preloader">
      <div className="preloader-content">
        <div className="preloader-logo-wrap">
          <img src="/logo.svg" alt="LearnWave" className="preloader-logo" />
        </div>
        <h1 className="preloader-title">
          <span className="pl-learn">Learn</span><span className="pl-wave">Wave</span>
        </h1>
        <p className="preloader-sub">Plataforma Educacional</p>
        <div className="preloader-bar">
          <div className="preloader-bar-fill"></div>
        </div>
      </div>
    </div>
  )
}

export default Preloader
