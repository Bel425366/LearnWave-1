export const database = {
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
    
    admins.forEach(admin => {
      if (!usuarios.find(u => u.email === admin.email)) {
        usuarios.push(admin)
      }
    })
    
    localStorage.setItem('usuarios_db', JSON.stringify(usuarios))
  },

  cadastrarUsuario(dadosUsuario) {
    this.init()
    const usuarios = JSON.parse(localStorage.getItem('usuarios_db')) || []
    
    if (usuarios.find(u => u.email.trim() === dadosUsuario.email.trim())) {
      throw new Error('Este email já está cadastrado no sistema!')
    }

    const novoUsuario = {
      id: Date.now(),
      nome: dadosUsuario.nome.trim(),
      email: dadosUsuario.email.trim(),
      senha: dadosUsuario.senha.trim(),
      tipo: dadosUsuario.tipo,
      areaEnsino: dadosUsuario.areaEnsino?.trim(),
      formacao: dadosUsuario.formacao?.trim(),
      experiencia: dadosUsuario.experiencia?.trim(),
      dataCadastro: new Date().toISOString()
    }

    usuarios.push(novoUsuario)
    localStorage.setItem('usuarios_db', JSON.stringify(usuarios))
    return novoUsuario
  },

  login(email, senha, tipo) {
    this.init()
    const usuarios = JSON.parse(localStorage.getItem('usuarios_db')) || []
    
    const usuario = usuarios.find(u => 
      u.email.trim() === email.trim() && 
      u.senha.trim() === senha.trim() && 
      u.tipo === tipo
    )

    if (!usuario) {
      throw new Error('Email ou senha incorretos!')
    }

    return usuario
  },

  listarUsuarios() {
    return JSON.parse(localStorage.getItem('usuarios_db')) || []
  }
}

if (typeof window !== 'undefined') {
  database.init()
}