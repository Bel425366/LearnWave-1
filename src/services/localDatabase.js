class LocalDatabase {
  constructor() {
    this.initializeData()
  }

  initializeData() {
    if (!localStorage.getItem('learnwave_users')) {
      const initialUsers = [
        {
          id: 1,
          nome: 'Isabelly Pereira',
          email: 'pereiraisabelly585@gmail.com',
          senha: '123456',
          tipo: 'administrador',
          status: 'ativo'
        }
      ]
      localStorage.setItem('learnwave_users', JSON.stringify(initialUsers))
    }

    if (!localStorage.getItem('learnwave_pending_teachers')) {
      localStorage.setItem('learnwave_pending_teachers', JSON.stringify([]))
    }
  }

  register(userData) {
    const users = JSON.parse(localStorage.getItem('learnwave_users') || '[]')
    
    if (users.find(user => user.email === userData.email)) {
      throw new Error('Email já cadastrado')
    }

    const newUser = {
      id: Date.now(),
      ...userData,
      status: userData.tipo === 'professor' ? 'pendente' : 'ativo'
    }

    if (userData.tipo === 'professor') {
      const pendingTeachers = JSON.parse(localStorage.getItem('learnwave_pending_teachers') || '[]')
      pendingTeachers.push(newUser)
      localStorage.setItem('learnwave_pending_teachers', JSON.stringify(pendingTeachers))
    } else {
      users.push(newUser)
      localStorage.setItem('learnwave_users', JSON.stringify(users))
    }

    return newUser
  }

  login(email, senha, tipo) {
    const users = JSON.parse(localStorage.getItem('learnwave_users') || '[]')
    
    // Admin especial
    if (email === 'pereiraisabelly585@gmail.com' && tipo === 'administrador') {
      return {
        id: 1,
        nome: 'Isabelly Pereira',
        email: 'pereiraisabelly585@gmail.com',
        tipo: 'administrador',
        status: 'ativo'
      }
    }
    
    const user = users.find(u => u.email === email && u.senha === senha && u.tipo === tipo)
    
    if (!user) {
      throw new Error('Credenciais inválidas')
    }

    if (user.status !== 'ativo') {
      throw new Error('Usuário não aprovado pelo administrador')
    }

    return user
  }

  getPendingTeachers() {
    return JSON.parse(localStorage.getItem('learnwave_pending_teachers') || '[]')
  }

  approveTeacher(teacherId) {
    const pendingTeachers = JSON.parse(localStorage.getItem('learnwave_pending_teachers') || '[]')
    const users = JSON.parse(localStorage.getItem('learnwave_users') || '[]')
    
    const teacherIndex = pendingTeachers.findIndex(t => t.id === teacherId)
    if (teacherIndex === -1) return false

    const teacher = pendingTeachers[teacherIndex]
    teacher.status = 'ativo'
    
    users.push(teacher)
    pendingTeachers.splice(teacherIndex, 1)
    
    localStorage.setItem('learnwave_users', JSON.stringify(users))
    localStorage.setItem('learnwave_pending_teachers', JSON.stringify(pendingTeachers))
    
    return true
  }

  rejectTeacher(teacherId) {
    const pendingTeachers = JSON.parse(localStorage.getItem('learnwave_pending_teachers') || '[]')
    const teacherIndex = pendingTeachers.findIndex(t => t.id === teacherId)
    
    if (teacherIndex === -1) return false
    
    pendingTeachers.splice(teacherIndex, 1)
    localStorage.setItem('learnwave_pending_teachers', JSON.stringify(pendingTeachers))
    
    return true
  }
}

export const localDB = new LocalDatabase()