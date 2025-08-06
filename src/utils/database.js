// Simulação de banco de dados com localStorage
export const database = {
  // Inicializar banco apenas com admins
  init() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios_db')) || []
    
    // Apenas administradores pré-cadastrados
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
    
    // Adicionar admins se não existirem
    admins.forEach(admin => {
      if (!usuarios.find(u => u.email === admin.email)) {
        usuarios.push(admin)
      }
    })
    
    localStorage.setItem('usuarios_db', JSON.stringify(usuarios))
  },

  // Cadastrar usuário
  cadastrarUsuario(dadosUsuario) {
    this.init()
    const usuarios = JSON.parse(localStorage.getItem('usuarios_db')) || []
    
    console.log('Tentativa de cadastro:', dadosUsuario)
    console.log('Usuários existentes:', usuarios)
    
    // Verificar se email já existe
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
    console.log('Usuário cadastrado com sucesso:', novoUsuario)
    console.log('Banco atualizado:', JSON.parse(localStorage.getItem('usuarios_db')))
    return novoUsuario
  },

  // Fazer login
  login(email, senha, tipo) {
    this.init()
    const usuarios = JSON.parse(localStorage.getItem('usuarios_db')) || []
    console.log('Tentativa de login:', { email, senha, tipo })
    console.log('Usuários disponíveis:', usuarios)
    
    const usuario = usuarios.find(u => 
      u.email.trim() === email.trim() && 
      u.senha.trim() === senha.trim() && 
      u.tipo === tipo
    )

    console.log('Usuário encontrado:', usuario)

    if (!usuario) {
      throw new Error('Email ou senha incorretos!')
    }

    return usuario
  },

  // Listar todos os usuários (para admin)
  listarUsuarios() {
    return JSON.parse(localStorage.getItem('usuarios_db')) || []
  },

  // Remover usuário
  removerUsuario(id) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios_db')) || []
    const novosUsuarios = usuarios.filter(u => u.id !== id)
    localStorage.setItem('usuarios_db', JSON.stringify(novosUsuarios))
  }
}

// Inicializar banco ao carregar
if (typeof window !== 'undefined') {
  database.init()
}