// API LearnWave - Funções para conectar com o backend
import mockData from '../data/mock-data.json';

const API_BASE = 'https://learnwaveback-8.onrender.com/api';
const USE_MOCK_DATA = false; // Ativar dados mockados quando backend não estiver disponível

// USUÁRIOS
const UsuarioAPI = {
    // Cadastrar
    async cadastrar(usuario) {
        try {
            const payload = {
                nome: usuario.nome,
                email: usuario.email,
                senha: usuario.senha,
                tipoUsuario: (usuario.tipoUsuario || usuario.tipo || '').toUpperCase(),
                cpf: usuario.cpf || null,
                telefone: usuario.telefone || null,
                escola: usuario.escola || null,
                areaEnsino: usuario.areaEnsino || null,
                formacao: usuario.formacao || null,
                experiencia: usuario.experiencia || null,
                documentoUrl: usuario.documentoUrl || null
            };
            const response = await fetch(`${API_BASE}/usuarios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) {
                const msg = await response.text();
                throw new Error(msg || `Erro ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            if (!USE_MOCK_DATA) throw error;

            const tipo = (usuario.tipoUsuario || usuario.tipo || '').toLowerCase();
            const todos = JSON.parse(localStorage.getItem('mock_usuarios') || '[]');

            if (todos.find(u => u.email === usuario.email)) {
                throw new Error('Este e-mail já está cadastrado.');
            }

            const novoUsuario = {
                id: Date.now(),
                nome: usuario.nome,
                email: usuario.email,
                senha: usuario.senha,
                cpf: usuario.cpf,
                escola: usuario.escola,
                telefone: usuario.telefone,
                tipo,
                status_verificacao: tipo === 'professor' ? 'pendente' : 'aprovado',
                area_ensino: usuario.areaEnsino,
                formacao: usuario.formacao,
                experiencia: usuario.experiencia,
                documentoImagem: usuario.documentoUrl || null,
                documento: 'Documento Comprobatório',
                data_criacao: new Date().toISOString()
            };

            todos.push(novoUsuario);
            localStorage.setItem('mock_usuarios', JSON.stringify(todos));

            return { id: novoUsuario.id, nome: novoUsuario.nome, email: novoUsuario.email, tipo };
        }
    },

    // Listar todos
    async listar() {
        try {
            const response = await fetch(`${API_BASE}/usuarios`);
            if (!response.ok) throw new Error('Backend indisponível');
            return await response.json();
        } catch (error) {
            if (!USE_MOCK_DATA) throw error;
            const locais = JSON.parse(localStorage.getItem('mock_usuarios') || '[]');
            return [
                ...mockData.usuarios.map(u => ({ ...u, tipoUsuario: u.tipo.toUpperCase() })),
                ...locais.map(u => ({ ...u, tipoUsuario: u.tipo.toUpperCase() }))
            ];
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
            const response = await fetch(`${API_BASE}/usuarios/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Backend indisponível');
            return true;
        } catch (error) {
            if (!USE_MOCK_DATA) throw error;
            const locais = JSON.parse(localStorage.getItem('mock_usuarios') || '[]');
            const filtrado = locais.filter(u => u.id !== id);
            localStorage.setItem('mock_usuarios', JSON.stringify(filtrado));
            return true;
        }
    },

    // Login
    async login(email, senha, tipoUsuario) {
        try {
            const params = new URLSearchParams({ email, senha, tipoUsuario: tipoUsuario.toUpperCase() });
            const response = await fetch(`${API_BASE}/usuarios/login?${params}`, {
                method: 'POST'
            });
            if (!response.ok) {
                const msg = await response.text();
                throw new Error(msg || `Erro ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            if (!USE_MOCK_DATA) throw error;

            const tipo = tipoUsuario.toLowerCase();

            // Buscar primeiro no localStorage, depois no mock-data.json
            const locais = JSON.parse(localStorage.getItem('mock_usuarios') || '[]');
            let usuario = locais.find(u => u.email === email && u.senha === senha && u.tipo === tipo)
                       || mockData.usuarios.find(u => u.email === email && u.senha === senha && u.tipo === tipo);

            if (!usuario) throw new Error('Email ou senha incorretos!');

            if (usuario.status_verificacao === 'pendente') {
                throw new Error('Seu cadastro ainda está aguardando aprovação do administrador.');
            }

            if (usuario.status_verificacao === 'rejeitado') {
                throw new Error('Seu cadastro foi rejeitado. Entre em contato com o administrador.');
            }

            return {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo: usuario.tipo,
                tipoUsuario: usuario.tipo.toUpperCase(),
                statusVerificacao: usuario.status_verificacao,
                areaEnsino: usuario.area_ensino,
                formacao: usuario.formacao,
                experiencia: usuario.experiencia
            };
        }
    },

    // Listar professores pendentes
    async getPendingTeachers() {
        try {
            const response = await fetch(`${API_BASE}/usuarios/professores/pendentes`);
            if (response.ok) return await response.json();
            throw new Error('Backend indisponível');
        } catch (error) {
            if (!USE_MOCK_DATA) throw error;
            const todos = JSON.parse(localStorage.getItem('mock_usuarios') || '[]');
            return todos.filter(u => u.tipo === 'professor' && u.status_verificacao === 'pendente');
        }
    },

    // Aprovar professor
    async approveTeacher(id) {
        try {
            const response = await fetch(`${API_BASE}/usuarios/${id}/aprovar`, { method: 'PATCH' });
            if (response.ok) return true;
            throw new Error('Backend indisponível');
        } catch (error) {
            if (!USE_MOCK_DATA) throw error;
            const todos = JSON.parse(localStorage.getItem('mock_usuarios') || '[]');
            const idx = todos.findIndex(u => u.id === id);
            if (idx !== -1) {
                todos[idx].status_verificacao = 'aprovado';
                localStorage.setItem('mock_usuarios', JSON.stringify(todos));
            }
            return true;
        }
    },

    // Rejeitar professor
    async rejectTeacher(id) {
        try {
            const response = await fetch(`${API_BASE}/usuarios/rejeitar-professor?id=${id}`, { method: 'GET' });
            if (response.ok) return true;
            throw new Error('Backend indisponível');
        } catch (error) {
            if (!USE_MOCK_DATA) throw error;
            const todos = JSON.parse(localStorage.getItem('mock_usuarios') || '[]');
            const idx = todos.findIndex(u => u.id === id);
            if (idx !== -1) {
                todos[idx].status_verificacao = 'rejeitado';
                localStorage.setItem('mock_usuarios', JSON.stringify(todos));
            }
            return true;
        }
    }
};

export const api = UsuarioAPI;
export default UsuarioAPI;