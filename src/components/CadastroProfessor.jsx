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
