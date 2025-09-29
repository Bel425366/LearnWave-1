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
        <img src="/logo.svg" alt="LearnWave" className="preloader-logo" />
        <h1 className="preloader-title">LearnWave</h1>
        <div className="preloader-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    </div>
  )
}

export default Preloader