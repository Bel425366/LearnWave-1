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
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status}`);
            }
            
            return await response.json();
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
    async login(email, senha, tipoUsuario) {
        try {
            const params = new URLSearchParams({
                email: email,
                senha: senha,
                tipoUsuario: tipoUsuario.toUpperCase()
            });
            
            const response = await fetch(`${API_BASE}/usuarios/login?${params}`, {
                method: 'POST'
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            throw error;
        }
    },

    // Listar professores pendentes
    async getPendingTeachers() {
        try {
            // Tentar diferentes endpoints
            let response = await fetch(`${API_BASE}/usuarios/professores/pendentes`);
            
            if (!response.ok) {
                // Tentar endpoint alternativo
                response = await fetch(`${API_BASE}/professores-pendentes`);
            }
            
            if (!response.ok) {
                // Buscar todos os usuários e filtrar professores pendentes
                response = await fetch(`${API_BASE}/usuarios`);
                if (response.ok) {
                    const usuarios = await response.json();
                    return usuarios.filter(u => 
                        (u.tipo === 'professor' || u.tipoUsuario === 'PROFESSOR' || u.tipo_usuario === 'professor') &&
                        (u.status_verificacao === 'pendente' || u.statusVerificacao === 'PENDENTE')
                    );
                }
            }
            
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar professores pendentes:', error);
            throw error;
        }
    },

    // Aprovar professor
    async approveTeacher(id) {
        try {
            let response = await fetch(`${API_BASE}/usuarios/${id}/aprovar`, {
                method: 'PATCH'
            });
            
            if (!response.ok) {
                // Tentar endpoint alternativo
                response = await fetch(`${API_BASE}/verificar-professor`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ professorId: id, status: 'APROVADO' })
                });
            }
            
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }
            return true;
        } catch (error) {
            console.error('Erro ao aprovar professor:', error);
            throw error;
        }
    },

    // Rejeitar professor
    async rejectTeacher(id) {
        try {
            console.log('Rejeitando professor ID:', id);
            const response = await fetch(`${API_BASE}/usuarios/rejeitar-professor?id=${id}`, {
                method: 'GET'
            });
            
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }
            return true;
        } catch (error) {
            console.error('Erro ao rejeitar professor:', error);
            throw error;
        }
    }
};

export const api = UsuarioAPI;
export default UsuarioAPI;