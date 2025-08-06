const API_URL = 'http://localhost:3001/api';

export const database = {
  init() {},

  async cadastrarUsuario(dadosUsuario) {
    try {
      const response = await fetch(`${API_URL}/cadastro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosUsuario),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      return data;
    } catch (error) {
      if (error.name === 'TypeError') {
        throw new Error('Servidor não está rodando. Execute: cd server && npm start');
      }
      throw error;
    }
  },

  async login(email, senha, tipo) {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha, tipo }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      localStorage.setItem('token', data.token);
      return data.user;
    } catch (error) {
      if (error.name === 'TypeError') {
        throw new Error('Servidor não está rodando. Execute: cd server && npm start');
      }
      throw error;
    }
  },

  async listarUsuarios() {
    const response = await fetch(`${API_URL}/usuarios`);
    return response.json();
  }
};