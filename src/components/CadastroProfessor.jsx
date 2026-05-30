import { useState } from 'react'
import PasswordValidator from './PasswordValidator'

const SENHA_FORTE = (pwd) =>
  pwd.length >= 8 &&
  /[A-Z]/.test(pwd) &&
  /[a-z]/.test(pwd) &&
  /\d/.test(pwd) &&
  /[!@#$%^&*(),.?":{}|<>]/.test(pwd)

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
    const file = e.target.files[0]
    if (file && file.size > 2 * 1024 * 1024) {
      alert('Arquivo muito grande! Máximo permitido: 2MB')
      e.target.value = ''
      return
    }
    setDocumento(file)
  }

  const validateForm = () => {
    if (formData.senha !== formData.confirmarSenha) {
      alert('Senhas não coincidem!')
      return false
    }
    if (!SENHA_FORTE(formData.senha)) {
      alert('A senha não atende aos requisitos de segurança.')
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
      reader.onerror = () => reject(new Error('Erro ao ler o arquivo'))
      reader.readAsDataURL(documento)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    try {
      const documentoBase64 = await processFile()
      const payload = {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        cpf: formData.cpf,
        telefone: formData.telefone,
        escola: formData.escola,
        areaEnsino: formData.areaEnsino,
        formacao: formData.formacao,
        experiencia: formData.experiencia,
        tipoUsuario: 'PROFESSOR',
        documentoUrl: documentoBase64,
        statusVerificacao: 'PENDENTE',
        status: 'ativo'
      }
      const res = await fetch('https://learnwaveback2.onrender.com/api/usuarios/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error(await res.text())
      alert('Cadastro realizado! Aguarde a aprovação do administrador.')
      onNavigate('login-professor')
    } catch (err) {
      alert('Erro ao cadastrar: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Cadastro de Professor</h2>
        <form onSubmit={handleSubmit}>
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
            placeholder="E-mail"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="cpf"
            placeholder="CPF (somente números)"
            value={formData.cpf}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="telefone"
            placeholder="Telefone"
            value={formData.telefone}
            onChange={handleChange}
          />
          <input
            type="text"
            name="escola"
            placeholder="Escola / Instituição"
            value={formData.escola}
            onChange={handleChange}
          />
          <input
            type="text"
            name="areaEnsino"
            placeholder="Área de ensino"
            value={formData.areaEnsino}
            onChange={handleChange}
          />
          <textarea
            name="formacao"
            placeholder="Formação acadêmica"
            value={formData.formacao}
            onChange={handleChange}
          />
          <textarea
            name="experiencia"
            placeholder="Experiência profissional"
            value={formData.experiencia}
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
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>
              Documento comprobatório (máx. 2MB)
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
        <p>
          Já tem conta?{' '}
          <button type="button" onClick={() => onNavigate('login-professor')}>
            Entrar
          </button>
        </p>
      </div>
    </div>
  )
}

export default CadastroProfessor
