function LoadingSpinner({ size = 'medium', message = 'Carregando...' }) {
  return (
    <div className={`loading-container ${size}`}>
      <div className="loading-spinner"></div>
      <p>{message}</p>
    </div>
  )
}

export default LoadingSpinner