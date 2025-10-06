const API_BASE_URL = 'http://localhost:8080/api'; // URL do seu backend Java Spring Boot

class UserService {
  async cadastrar(userData) {
    const response = await fetch(`${API_BASE_URL}/usuarios/cadastro`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Erro ao cadastrar usuário');
    }

    return response.json();
  }

  async login(email, senha) {
    const response = await fetch(`${API_BASE_URL}/usuarios/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, senha })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Erro ao fazer login');
    }

    return response.json();
  }

  async listarUsuarios() {
    const response = await fetch(`${API_BASE_URL}/usuarios`);
    
    if (!response.ok) {
      throw new Error('Erro ao listar usuários');
    }

    return response.json();
  }

  async buscarPorId(id) {
    const response = await fetch(`${API_BASE_URL}/usuarios/${id}`);
    
    if (!response.ok) {
      throw new Error('Usuário não encontrado');
    }

    return response.json();
  }

  async atualizar(id, userData) {
    const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Erro ao atualizar usuário');
    }

    return response.json();
  }

  async deletar(id) {
    const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Erro ao deletar usuário');
    }

    return true;
  }
}

export const userService = new UserService();