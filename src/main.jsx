import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  componentDidCatch(error) {
    this.setState({ error })
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '2rem', color: 'red', background: '#fff', fontFamily: 'monospace' }}>
          <h2>Erro capturado:</h2>
          <pre>{this.state.error.toString()}</pre>
          <pre>{this.state.error.stack}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
