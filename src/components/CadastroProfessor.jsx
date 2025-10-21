import { useState } from 'react'
import UsuarioAPI from '../services/api-learnwave'
import PasswordValidator from './PasswordValidator'

function CadastroProfessor({ onNavigate }) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    escola: '',
    telefone: '',
    areaEnsino: '',
    formacao: '',
    experiencia: '',
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
      console.log('Documento processado:', documentoImagem ? 'SIM' : 'NÃO')
      console.log('Tamanho do documento:', documentoImagem ? documentoImagem.length : 0)
      
      const usuario = await UsuarioAPI.cadastrar({
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        cpf: formData.cpf,
        escola: formData.escola,
        telefone: formData.telefone,
        areaEnsino: formData.areaEnsino,
        formacao: formData.formacao,
        experiencia: formData.experiencia,
        documentoUrl: documentoImagem,
        tipo: 'PROFESSOR'
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
        
        <select
          name="areaEnsino"
          value={formData.areaEnsino}
          onChange={handleChange}
          required
        >
          <option value="">Selecione a área de ensino</option>
          <option value="Gramática">Gramática</option>
          <option value="Literatura">Literatura</option>
          <option value="Redação">Redação</option>
          <option value="Interpretação de Texto">Interpretação de Texto</option>
          <option value="Ortografia">Ortografia</option>
          <option value="Sintaxe">Sintaxe</option>
          <option value="Morfologia">Morfologia</option>
          <option value="Semântica">Semântica</option>
          <option value="Fonética">Fonética</option>
          <option value="Produção Textual">Produção Textual</option>
          <option value="Análise Literária">Análise Literária</option>
          <option value="Português Geral">Português Geral</option>
        </select>
        
        <textarea
          name="formacao"
          placeholder="Formação acadêmica (ex: Licenciatura em Letras - USP, Mestrado em Literatura - UNICAMP)"
          value={formData.formacao}
          onChange={handleChange}
          rows="3"
          required
        />
        
        <textarea
          name="experiencia"
          placeholder="Experiência profissional"
          value={formData.experiencia}
          onChange={handleChange}
          rows="3"
          required
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