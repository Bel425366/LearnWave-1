// API LearnWave - Funções para conectar com o backend
const API_BASE = 'http://localhost:8080/api';

// USUÁRIOS
const UsuarioAPI = {
    // Cadastrar
    async cadastrar(usuario) {
        try {
            const response = await fetch(`${API_BASE}/usuarios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(usuario)
            });
            
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }
            
            const text = await response.text();
            return text ? JSON.parse(text) : {};
        } catch (error) {
            console.error('Erro ao cadastrar:', error);
            throw error;
        }
    },

    // Listar todos
    async listar() {
        try {
            const response = await fetch(`${API_BASE}/usuarios`);
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Erro ao listar:', error);
            throw error;
        }
    },

    // Buscar por ID
    async buscarPorId(id) {
        try {
            const response = await fetch(`${API_BASE}/usuarios/${id}`);
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar:', error);
            throw error;
        }
    },

    // Atualizar
    async atualizar(id, usuario) {
        try {
            const response = await fetch(`${API_BASE}/usuarios/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(usuario)
            });
            
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }
            
            const text = await response.text();
            return text ? JSON.parse(text) : {};
        } catch (error) {
            console.error('Erro ao atualizar:', error);
            throw error;
        }
    },

    // Deletar
    async deletar(id) {
        try {
            const response = await fetch(`${API_BASE}/usuarios/${id}`, {
                method: 'DELETE'
            });
            return response.ok;
        } catch (error) {
            console.error('Erro ao deletar:', error);
            throw error;
        }
    },

    // Login
    async login(email, senha) {
        try {
            const response = await fetch(`${API_BASE}/usuarios/login?email=${email}&senha=${senha}`, {
                method: 'POST'
            });
            
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }
            
            const text = await response.text();
            return text ? JSON.parse(text) : {};
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            throw error;
        }
    }
};

export default UsuarioAPI
UsuarioAPI