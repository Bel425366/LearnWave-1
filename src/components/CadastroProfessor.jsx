import { useState } from 'react'
import { localDB } from '../services/localDatabase'
import PasswordValidator from './PasswordValidator'

function CadastroProfessor({ onNavigate }) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',

    escola: '',
    telefone: '',
    senha: '',
    confirmarSenha: ''
  })
  const [documento, setDocumento] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    
    if (name === 'cpf') {
      const numericValue = value.replace(/\D/g, '')
      if (numericValue.length <= 11) {
        setFormData({ ...formData, [name]: numericValue })
      }
      return
    }
    
    const sanitizedValue = typeof value === 'string' ? value.replace(/[<>]/g, '').trim() : value
    setFormData({ ...formData, [name]: sanitizedValue })
  }

  const handleFileChange = (e) => {
    setDocumento(e.target.files[0])
  }

  const institutionalDomains = ['.edu.br', '.gov.br', '.escola.', '.colegio.']
  
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email) && institutionalDomains.some(domain => email.includes(domain))
  }

  const validateForm = () => {
    if (formData.senha !== formData.confirmarSenha) {
      alert('Senhas não coincidem!')
      return false
    }
    if (!validateEmail(formData.email)) {
      alert('Use um e-mail institucional (.edu.br, .gov.br, etc.)')
      return false
    }
    if (formData.senha.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres')
      return false
    }
    if (formData.cpf.length !== 11) {
      alert('CPF deve conter exatamente 11 números')
      return false
    }
    if (!documento) {
      alert('É obrigatório enviar um documento comprobatório')
      return false
    }
    return true
  }

  const processFile = () => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = () => reject(new Error('Erro ao processar o arquivo'))
      reader.readAsDataURL(documento)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
      const documentoImagem = await processFile()
      
      localDB.register({
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        cpf: formData.cpf,
        escola: formData.escola,
        telefone: formData.telefone,
        documento: documento.name,
        documentoImagem,
        tipo: 'professor',
        dataEnvio: new Date().toISOString()
      })
      
      alert('Cadastro enviado com sucesso! Aguarde a verificação dos documentos pelo administrador.')
      onNavigate('login')
    } catch (error) {
      alert('Erro: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Cadastro de Professor</h2>
        
        <input
          type="text"
          name="nome"
          placeholder="Nome completo"
          value={formData.nome}
          onChange={handleChange}
          required
        />
        
        <input
          type="email"
          name="email"
          placeholder="E-mail institucional (ex: professor@escola.edu.br)"
          value={formData.email}
          onChange={handleChange}
          required
        />
        
        <input
          type="text"
          name="cpf"
          placeholder="CPF (apenas números)"
          value={formData.cpf}
          onChange={handleChange}
          maxLength="11"
          required
        />
        

        
        <input
          type="text"
          name="escola"
          placeholder="Escola ou instituição"
          value={formData.escola}
          onChange={handleChange}
          required
        />
        
        <input
          type="tel"
          name="telefone"
          placeholder="Telefone (opcional)"
          value={formData.telefone}
          onChange={handleChange}
        />
        
        <input
          type="password"
          name="senha"
          placeholder="Senha"
          value={formData.senha}
          onChange={handleChange}
          required
        />
        {formData.senha && <PasswordValidator password={formData.senha} />}
        
        <input
          type="password"
          name="confirmarSenha"
          placeholder="Confirmar senha"
          value={formData.confirmarSenha}
          onChange={handleChange}
          required
        />
        
        <div className="file-upload-container">
          <label className="file-upload-label">Documento Comprobatório *</label>
          <div className="file-upload-wrapper">
            <input
              type="file"
              id="documento"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              required
              className="file-input"
            />
            <label htmlFor="documento" className="file-upload-button">
              <span className="upload-icon">+</span>
              <span className="upload-text">
                {documento ? documento.name : 'Escolher arquivo'}
              </span>
            </label>
          </div>
          <small className="file-help-text">
            Envie holerite, declaração da escola ou carteira funcional (PDF, JPG, PNG - máx. 5MB)
          </small>
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Cadastrar'}
        </button>
        
        <p>
          Já tem conta? 
          <button type="button" onClick={() => onNavigate('login')}>
            Faça login
          </button>
        </p>
        
        <p>
          <button type="button" onClick={() => onNavigate('user-type-selection')}>
            Voltar à seleção
          </button>
        </p>
      </form>
    </div>
  )
}

export default CadastroProfessor