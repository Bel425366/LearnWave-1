export const database = {
  _usuariosCache: null,
  _emailMap: null,

  _updateCache() {
    this._usuariosCache = JSON.parse(localStorage.getItem('usuarios_db')) || []
    this._emailMap = new Map()
    this._usuariosCache.forEach(user => {
      this._emailMap.set(user.email.toLowerCase().trim(), user)
    })
  },

  init() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios_db')) || []
    
    const admins = [
      {
        id: 1,
        nome: 'Administrador 1',
        email: 'pereiraisabelly585@gmail.com',
        senha: 'admin123',
        tipo: 'administrador',
        dataCadastro: new Date().toISOString()
      },
      {
        id: 2,
        nome: 'Administrador 2',
        email: 'jusf.2909@gmail.com',
        senha: 'admin123',
        tipo: 'administrador',
        dataCadastro: new Date().toISOString()
      }
    ]
    
    const emailSet = new Set(usuarios.map(u => u.email.toLowerCase()))
    admins.forEach(admin => {
      if (!emailSet.has(admin.email.toLowerCase())) {
        usuarios.push(admin)
      }
    })
    
    localStorage.setItem('usuarios_db', JSON.stringify(usuarios))
    this._updateCache()
  },

  cadastrarUsuario(dadosUsuario) {
    if (!this._usuariosCache) this.init()
    
    const emailKey = dadosUsuario.email.toLowerCase().trim()
    if (this._emailMap.has(emailKey)) {
      throw new Error('Este email já está cadastrado no sistema!')
    }

    const novoUsuario = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now(),
      nome: dadosUsuario.nome.trim(),
      email: dadosUsuario.email.trim(),
      senha: dadosUsuario.senha.trim(),
      tipo: dadosUsuario.tipo,
      areaEnsino: dadosUsuario.areaEnsino?.trim(),
      formacao: dadosUsuario.formacao?.trim(),
      experiencia: dadosUsuario.experiencia?.trim(),
      dataCadastro: new Date().toISOString()
    }

    this._usuariosCache.push(novoUsuario)
    this._emailMap.set(emailKey, novoUsuario)
    localStorage.setItem('usuarios_db', JSON.stringify(this._usuariosCache))
    return novoUsuario
  },

  login(email, senha, tipo) {
    if (!this._usuariosCache) this.init()
    
    const emailKey = email.toLowerCase().trim()
    const usuario = this._emailMap.get(emailKey)
    
    if (!usuario || 
        usuario.senha.trim() !== senha.trim() || 
        usuario.tipo.toLowerCase() !== tipo.toLowerCase()) {
      throw new Error('Email ou senha incorretos!')
    }

    return usuario
  },

  listarUsuarios() {
    if (!this._usuariosCache) this.init()
    return [...this._usuariosCache]
  }
}

if (typeof window !== 'undefined') {
  database.init()
}