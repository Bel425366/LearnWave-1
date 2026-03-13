// API LearnWave - Funções para conectar com o backend
import { localDB } from './localDatabase';
import mockData from '../data/mock-data.json';

const API_BASE = 'http://localhost:8080/api';
const USE_MOCK_DATA = true; // Ativar dados mockados quando backend não estiver disponível

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
                throw new Error('Backend indisponível');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro ao cadastrar no backend:', error);
            
            // Usar dados mockados
            if (USE_MOCK_DATA) {
                console.log('Usando dados mockados para cadastro...');
                const novoUsuario = {
                    id: mockData.usuarios.length + 1,
                    nome: usuario.nome,
                    email: usuario.email,
                    senha: usuario.senha,
                    tipo: usuario.tipoUsuario?.toLowerCase() || usuario.tipo?.toLowerCase(),
                    status_verificacao: 'aprovado',
                    area_ensino: usuario.areaEnsino,
                    formacao: usuario.formacao,
                    experiencia: usuario.experiencia,
                    data_criacao: new Date().toISOString()
                };
                
                mockData.usuarios.push(novoUsuario);
                
                return {
                    id: novoUsuario.id,
                    nome: novoUsuario.nome,
                    email: novoUsuario.email,
                    tipo: novoUsuario.tipo,
                    message: 'Usuário cadastrado com sucesso!'
                };
            }
            
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
                throw new Error('Backend indisponível');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro ao fazer login no backend:', error);
            
            // Usar dados mockados
            if (USE_MOCK_DATA) {
                console.log('Usando dados mockados para login...');
                const usuario = mockData.usuarios.find(u => 
                    u.email === email && 
                    u.senha === senha && 
                    u.tipo === tipoUsuario.toLowerCase()
                );
                
                if (!usuario) {
                    throw new Error('Email ou senha incorretos!');
                }
                
                return {
                    token: 'mock-token-' + usuario.id,
                    user: {
                        id: usuario.id,
                        nome: usuario.nome,
                        email: usuario.email,
                        tipo: usuario.tipo,
                        tipoUsuario: usuario.tipo.toUpperCase(),
                        statusVerificacao: usuario.status_verificacao,
                        areaEnsino: usuario.area_ensino,
                        formacao: usuario.formacao,
                        experiencia: usuario.experiencia
                    }
                };
            }
            
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