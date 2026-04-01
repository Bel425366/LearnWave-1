import { useState } from 'react'
import UsuarioAPI from '../services/api-learnwave'
import PasswordValidator from './PasswordValidator'
import Mascot from './Mascot'

function Cadastro({ userType, onNavigate }) {
  const [formData, setFormData] = useState({
    nome: '', email: '', senha: '', confirmarSenha: '',
    areaEnsino: '', formacao: '', experiencia: ''
  })
  const [documento, setDocumento] = useState(null)
  const [mascotMessage, setMascotMessage] = useState('Crie sua conta e comece sua jornada de aprendizado!')

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.senha !== formData.confirmarSenha) {
      setMascotMessage('As senhas não coincidem, confere aí!')
      alert('Senhas não coincidem!')
      return
    }
    if (userType === 'professor' && !documento) {
      setMascotMessage('Não esquece do documento comprobatório!')
      alert('É obrigatório enviar um documento comprobatório!')
      return
    }
    setMascotMessage('Criando sua conta, um segundo...')
    try {
      const tipoMap = { aluno: 'ALUNO', professor: 'PROFESSOR', administrador: 'ADMINISTRADOR' }
      const tipoUsuarioEnum = tipoMap[userType] || userType.toUpperCase()
      let documentoUrl = null
      if (documento) {
        documentoUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = (e) => resolve(e.target.result)
          reader.onerror = () => reject(new Error('Erro ao processar o arquivo'))
          reader.readAsDataURL(documento)
        })
      }
      const userData = {
        nome: formData.nome, email: formData.email, senha: formData.senha,
        tipoUsuario: tipoUsuarioEnum,
        areaEnsino: formData.areaEnsino || null,
        formacao: formData.formacao || null,
        experiencia: formData.experiencia || null,
        documentoUrl
      }
      await UsuarioAPI.cadastrar(userData)
      if (userType === 'professor') {
        setMascotMessage('Cadastro enviado! Aguarde a aprovação do administrador.')
        alert('Cadastro realizado! Seu cadastro está aguardando aprovação do administrador. Você receberá acesso assim que for aprovado.')
      } else {
        setMascotMessage(`Bem-vindo, ${formData.nome.split(' ')[0]}! Agora faça login!`)
        alert('Cadastro realizado com sucesso! Faça login para continuar.')
      }
      onNavigate('login')
    } catch (error) {
      setMascotMessage('Ops, algo deu errado. Tenta de novo!')
      alert(error.message)
    }
  }

  const areasEnsino = [
    'Gramática', 'Literatura', 'Redação', 'Interpretação de Texto',
    'Ortografia', 'Fonética', 'Semântica', 'Estilística',
    'Morfologia', 'Sintaxe', 'Pontuação', 'Versificação'
  ]

  return (
    <div className="auth-container">
      <div className="auth-split-wrapper">
        <div className="auth-split-left">
          <Mascot message={mascotMessage} />
        </div>
        <div className="auth-split-right">
          <div className="auth-card">
            <div className="auth-card-header">
              <div className="auth-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
                </svg>
              </div>
              <div>
                <h2 className="auth-card-title">Cadastro</h2>
                <p className="auth-card-subtitle">{userType.charAt(0).toUpperCase() + userType.slice(1)}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="auth-field">
                <label>Nome completo</label>
                <input type="text" name="nome" placeholder="Seu nome" value={formData.nome}
                  onChange={handleChange}
                  onFocus={() => setMascotMessage('Como posso te chamar?')}
                  required />
              </div>
              <div className="auth-field">
                <label>Email</label>
                <input type="email" name="email" placeholder="seu@email.com" value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setMascotMessage('Usa um email que você acessa sempre!')}
                  required />
              </div>
              <div className="auth-field">
                <label>Senha</label>
                <input type="password" name="senha" placeholder="Crie uma senha" value={formData.senha}
                  onChange={handleChange}
                  onFocus={() => setMascotMessage('Crie uma senha forte, tá?')}
                  required />
              </div>
              {formData.senha && <PasswordValidator password={formData.senha} />}
              <div className="auth-field">
                <label>Confirmar senha</label>
                <input type="password" name="confirmarSenha" placeholder="Repita a senha" value={formData.confirmarSenha}
                  onChange={handleChange}
                  onFocus={() => setMascotMessage('Repete a senha pra confirmar!')}
                  required />
              </div>

              {userType === 'professor' && (
                <>
                  <div className="auth-field">
                    <label>Área de Ensino</label>
                    <select name="areaEnsino" value={formData.areaEnsino}
                      onChange={handleChange}
                      onFocus={() => setMascotMessage('Qual área você vai ensinar?')}
                      required>
                      <option value="">Selecione...</option>
                      {areasEnsino.map(area => <option key={area} value={area}>{area}</option>)}
                    </select>
                  </div>
                  <div className="auth-field">
                    <label>Formação acadêmica</label>
                    <input type="text" name="formacao" placeholder="Ex: Letras - UFMG" value={formData.formacao}
                      onChange={handleChange}
                      onFocus={() => setMascotMessage('Conta sua formação!')}
                      required />
                  </div>
                  <div className="auth-field">
                    <label>Anos de experiência</label>
                    <input type="text" name="experiencia" placeholder="Ex: 5 anos" value={formData.experiencia}
                      onChange={handleChange}
                      onFocus={() => setMascotMessage('Quantos anos de experiência você tem?')}
                      required />
                  </div>
                  <div className="auth-field">
                    <label>Documento comprobatório *</label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => { setDocumento(e.target.files[0]); setMascotMessage('Perfeito! Documento anexado!') }}
                      onFocus={() => setMascotMessage('Envie um holerite, declaração ou carteira funcional!')}
                      required
                    />
                    <small style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem' }}>
                      PDF, JPG ou PNG — máx. 5MB
                    </small>
                  </div>
                </>
              )}

              <button type="submit" className="auth-btn-primary"
                onMouseEnter={() => setMascotMessage('Bora criar sua conta!')}>
                Cadastrar
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </form>

            <div className="auth-card-footer">
              <p className="auth-footer-text">
                Já tem conta?&nbsp;
                <button type="button" className="auth-link-btn" onClick={() => onNavigate('login')}
                  onMouseEnter={() => setMascotMessage('Já tem conta? Vai fazer login!')}>Faça login</button>
              </p>
              <button type="button" className="auth-back-btn" onClick={() => onNavigate('user-type-selection')}
                onMouseEnter={() => setMascotMessage('Voltando para a seleção...')}>
                ← Voltar à seleção
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cadastro
