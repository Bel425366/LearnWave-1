import { useState } from 'react'
import UsuarioAPI from '../services/api-learnwave'
import PasswordValidator from './PasswordValidator'

function Cadastro({ userType, onNavigate }) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    areaEnsino: '',
    formacao: '',
    experiencia: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.senha !== formData.confirmarSenha) {
      alert('Senhas não coincidem!')
      return
    }

    try {
      const userData = {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        tipoUsuario: userType === 'aluno' ? 'ALUNO' : userType === 'professor' ? 'PROFESSOR' : 'ADMIN',
        areaEnsino: formData.areaEnsino || null,
        formacao: formData.formacao || null,
        experiencia: formData.experiencia || null
      }
      
      await UsuarioAPI.cadastrar(userData)
      
      if (userType === 'aluno') {
        alert('Cadastro realizado com sucesso! Bem-vindo!')
        onNavigate('area-aluno')
      } else {
        alert('Cadastro realizado com sucesso!')
        onNavigate('login')
      }
    } catch (error) {
      alert(error.message)
    }
  }

  const areasEnsino = [
    'Gramática', 'Literatura', 'Redação', 'Interpretação de Texto',
    'Ortografia', 'Fonética', 'Semântica', 'Estilística',
    'Morfologia', 'Sintaxe', 'Pontuação', 'Versificação'
  ]

  const renderCamposEspecificos = () => {
    if (userType !== 'professor') return null

    return (
      <>
        <select name="areaEnsino" value={formData.areaEnsino} onChange={handleChange} required>
          <option value="">Área de Ensino</option>
          {areasEnsino.map(area => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>
        
        <input
          type="text"
          name="formacao"
          placeholder="Formação acadêmica"
          value={formData.formacao}
          onChange={handleChange}
          required
        />
        
        <input
          type="text"
          name="experiencia"
          placeholder="Anos de experiência"
          value={formData.experiencia}
          onChange={handleChange}
          required
        />
      </>
    )
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Cadastro - {userType.charAt(0).toUpperCase() + userType.slice(1)}</h2>
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
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
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
        {renderCamposEspecificos()}
        <button type="submit">Cadastrar</button>
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

export default Cadastro