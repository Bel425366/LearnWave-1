import { useState, useEffect } from 'react'
import { database } from '../utils/database'

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

  useEffect(() => {
    database.init()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.senha === formData.confirmarSenha) {
      try {
        database.cadastrarUsuario({
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha,
          tipo: userType,
          areaEnsino: formData.areaEnsino,
          formacao: formData.formacao,
          experiencia: formData.experiencia
        })
        alert('Cadastro realizado com sucesso!')
        onNavigate('login')
      } catch (error) {
        alert(error.message)
      }
    } else {
      alert('Senhas não coincidem!')
    }
  }

  const renderCamposEspecificos = () => {
    if (userType === 'professor') {
      return (
        <>
          <select
            name="areaEnsino"
            value={formData.areaEnsino}
            onChange={handleChange}
            required
          >
            <option value="">Área de Ensino</option>
            <option value="Gramática">Gramática</option>
            <option value="Literatura">Literatura</option>
            <option value="Redação">Redação</option>
            <option value="Interpretação de Texto">Interpretação de Texto</option>
            <option value="Ortografia">Ortografia</option>
            <option value="Fonética">Fonética</option>
            <option value="Semântica">Semântica</option>
            <option value="Estilística">Estilística</option>
            <option value="Morfologia">Morfologia</option>
            <option value="Sintaxe">Sintaxe</option>
            <option value="Pontuação">Pontuação</option>
            <option value="Versificação">Versificação</option>
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
    return null
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