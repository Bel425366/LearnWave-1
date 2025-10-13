import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { db, initDatabase } from './database.js';

const app = express();
const PORT = 8080;
const JWT_SECRET = 'learnwave_secret_key';

// Configurar multer para upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/documentos';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Apenas arquivos PDF, JPG, JPEG e PNG são permitidos'));
    }
  }
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Inicializar banco
try {
  initDatabase();
  console.log('Banco de dados inicializado com sucesso!');
} catch (error) {
  console.error('Erro ao inicializar banco:', error);
  process.exit(1);
}

// Dados temporários em memória
let usuarios = [
  {
    id: 1,
    nome: 'Yasmin Teste',
    email: 'yasmincunegundes25@gmail.com',
    senha: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    tipo: 'aluno',
    status_verificacao: 'aprovado'
  }
];

// Cadastro de professor com verificação
app.post('/api/cadastro-professor', upload.single('documento'), (req, res) => {
  const { nome, email, senha, cpf, escola, telefone } = req.body;
  
  if (!req.file) {
    return res.status(400).json({ error: 'Documento comprobatório é obrigatório' });
  }
  
  const hashedPassword = bcrypt.hashSync(senha, 10);
  
  db.run(
    `INSERT INTO usuarios (nome, email, senha, tipo, cpf, escola, telefone, documento_url, status_verificacao) 
     VALUES (?, ?, ?, 'professor', ?, ?, ?, ?, 'pendente')`,
    [nome, email, hashedPassword, cpf, escola, telefone, req.file.path],
    function(err) {
      if (err) {
        // Remover arquivo se erro no banco
        fs.unlinkSync(req.file.path);
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Este email já está cadastrado!' });
        }
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }
      
      // Salvar informações do documento
      db.run(
        `INSERT INTO documentos_verificacao (usuario_id, nome_arquivo, caminho_arquivo, tipo_documento)
         VALUES (?, ?, ?, 'comprobatorio')`,
        [this.lastID, req.file.originalname, req.file.path]
      );
      
      res.json({ 
        id: this.lastID,
        message: 'Cadastro enviado para verificação!'
      });
    }
  );
});

// Cadastro regular (alunos)
app.post('/api/cadastro', (req, res) => {
  const { nome, email, senha, tipo, areaEnsino, formacao, experiencia } = req.body;
  
  const hashedPassword = bcrypt.hashSync(senha, 10);
  const status = (tipo === 'aluno' || tipo === 'administrador') ? 'aprovado' : 'pendente';
  
  db.run(
    `INSERT INTO usuarios (nome, email, senha, tipo, area_ensino, formacao, experiencia, status_verificacao) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [nome, email, hashedPassword, tipo, areaEnsino, formacao, experiencia, status],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Este email já está cadastrado!' });
        }
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }
      
      res.json({ 
        id: this.lastID,
        nome,
        email,
        tipo,
        message: 'Usuário cadastrado com sucesso!'
      });
    }
  );
});

// Login (endpoint principal)
app.post('/api/login', (req, res) => {
  const { email, senha, tipo } = req.body;
  
  db.get(
    'SELECT * FROM usuarios WHERE email = ? AND tipo = ?',
    [email, tipo],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }
      
      if (!user || !bcrypt.compareSync(senha, user.senha)) {
        return res.status(401).json({ error: 'Email ou senha incorretos!' });
      }
      
      if (user.tipo === 'professor' && user.status_verificacao !== 'aprovado') {
        return res.status(403).json({ 
          error: 'Conta pendente de verificação. Aguarde a aprovação dos documentos.' 
        });
      }
      
      const token = jwt.sign({ id: user.id, email: user.email, tipo: user.tipo }, JWT_SECRET);
      
      res.json({
        token,
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          tipo: user.tipo,
          statusVerificacao: user.status_verificacao,
          areaEnsino: user.area_ensino,
          formacao: user.formacao,
          experiencia: user.experiencia
        }
      });
    }
  );
});

// Listar usuários (admin)
app.get('/api/usuarios', (req, res) => {
  db.all(`SELECT id, nome, email, tipo, cpf, escola, telefone, 
                 documento_url, status_verificacao, area_ensino, formacao, 
                 experiencia, data_criacao FROM usuarios`, (err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
    res.json(users);
  });
});

// Listar professores pendentes de verificação
app.get('/api/professores-pendentes', (req, res) => {
  db.all(`SELECT u.*, d.nome_arquivo, d.caminho_arquivo 
          FROM usuarios u 
          LEFT JOIN documentos_verificacao d ON u.id = d.usuario_id
          WHERE u.tipo = 'professor' AND u.status_verificacao = 'pendente'`, 
    (err, professores) => {
      if (err) {
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }
      res.json(professores);
    }
  );
});

// Aprovar/rejeitar professor
app.post('/api/verificar-professor', (req, res) => {
  const { professorId, status, observacoes } = req.body;
  
  db.run(
    'UPDATE usuarios SET status_verificacao = ? WHERE id = ? AND tipo = "professor"',
    [status, professorId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Professor não encontrado' });
      }
      
      res.json({ message: `Professor ${status} com sucesso!` });
    }
  );
});

// Endpoint alternativo para compatibilidade (GET com query params)
app.get('/api/usuarios/login', (req, res) => {
  console.log('Login GET request received:', req.query);
  const { email, senha, tipoUsuario } = req.query;
  
  if (!email || !senha) {
    console.log('Missing required fields:', { email: !!email, senha: !!senha });
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }
  
  // Buscar usuário no banco de dados
  console.log('Searching for user by email:', email);
  
  db.get(
    'SELECT * FROM usuarios WHERE email = ?',
    [email],
    (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }
      
      console.log('User found:', !!user);
      if (!user) {
        return res.status(401).json({ error: 'Email ou senha incorretos!' });
      }
      
      // Se tipo foi fornecido, verificar se bate
      if (tipoUsuario && user.tipo.toUpperCase() !== tipoUsuario.toUpperCase()) {
        console.log('Type mismatch:', { expected: tipoUsuario, actual: user.tipo });
        return res.status(401).json({ error: 'Email ou senha incorretos!' });
      }
      
      const passwordMatch = bcrypt.compareSync(senha, user.senha);
      console.log('Password match:', passwordMatch);
      
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Email ou senha incorretos!' });
      }
      
      if (user.tipo === 'professor' && user.status_verificacao !== 'APROVADO') {
        return res.status(403).json({ 
          error: 'Conta pendente de verificação. Aguarde a aprovação dos documentos.' 
        });
      }
      
      const token = jwt.sign({ id: user.id, email: user.email, tipo: user.tipo }, JWT_SECRET);
      
      res.json({
        token,
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          tipo: user.tipo,
          tipoUsuario: user.tipo.toUpperCase(),
          statusVerificacao: user.status_verificacao,
          areaEnsino: user.area_ensino,
          formacao: user.formacao,
          experiencia: user.experiencia
        }
      });
    }
  );
});

// Endpoint POST para login
app.post('/api/usuarios/login', (req, res) => {
  console.log('Login POST request received:', req.body);
  const { email, senha, tipoUsuario } = req.body;
  
  if (!email || !senha) {
    console.log('Missing required fields:', { email: !!email, senha: !!senha });
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }
  
  // Buscar usuário no banco de dados
  console.log('Searching for user by email:', email);
  
  db.get(
    'SELECT * FROM usuarios WHERE email = ?',
    [email],
    (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }
      
      console.log('User found:', !!user);
      if (!user) {
        return res.status(401).json({ error: 'Email ou senha incorretos!' });
      }
      
      // Se tipo foi fornecido, verificar se bate
      if (tipoUsuario && user.tipo.toUpperCase() !== tipoUsuario.toUpperCase()) {
        console.log('Type mismatch:', { expected: tipoUsuario, actual: user.tipo });
        return res.status(401).json({ error: 'Email ou senha incorretos!' });
      }
      
      const passwordMatch = bcrypt.compareSync(senha, user.senha);
      console.log('Password match:', passwordMatch);
      
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Email ou senha incorretos!' });
      }
      
      if (user.tipo === 'professor' && user.status_verificacao !== 'APROVADO') {
        return res.status(403).json({ 
          error: 'Conta pendente de verificação. Aguarde a aprovação dos documentos.' 
        });
      }
      
      const token = jwt.sign({ id: user.id, email: user.email, tipo: user.tipo }, JWT_SECRET);
      
      
      res.json({
        token,
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          tipo: user.tipo,
          tipoUsuario: user.tipo.toUpperCase(),
          statusVerificacao: user.status_verificacao,
          areaEnsino: user.area_ensino,
          formacao: user.formacao,
          experiencia: user.experiencia
        }
      });
    }
  );
});

// Endpoint para buscar documentos de verificação
app.get('/api/documentos-verificacao/usuario/:userId', (req, res) => {
  const { userId } = req.params;
  
  // Simular documento base64 para teste
  const documentoMock = {
    id: 1,
    usuarioId: userId,
    nomeArquivo: 'comprovante-professor.jpg',
    conteudoBase64: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
  };
  
  res.json([documentoMock]);
});

// Endpoint para cadastro de usuários
app.post('/api/usuarios', (req, res) => {
  console.log('Cadastro request received:', req.body);
  const { nome, email, senha, tipo, areaEnsino, formacao, experiencia } = req.body;
  
  if (!nome || !email || !senha || !tipo) {
    console.log('Missing required fields:', { nome: !!nome, email: !!email, senha: !!senha, tipo: !!tipo });
    return res.status(400).json({ error: 'Nome, email, senha e tipo são obrigatórios' });
  }
  
  try {
    // Verificar se email já existe
    const existingUser = usuarios.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'Este email já está cadastrado!' });
    }
    
    const hashedPassword = bcrypt.hashSync(senha, 10);
    const status = (tipo === 'aluno' || tipo === 'ALUNO' || tipo === 'administrador' || tipo === 'ADMINISTRADOR') ? 'aprovado' : 'pendente';
    
    const newUser = {
      id: usuarios.length + 1,
      nome,
      email,
      senha: hashedPassword,
      tipo,
      area_ensino: areaEnsino,
      formacao,
      experiencia,
      status_verificacao: (tipo === 'aluno' || tipo === 'ALUNO' || tipo === 'administrador' || tipo === 'ADMINISTRADOR') ? 'aprovado' : 'pendente'
    };
    
    usuarios.push(newUser);
    
    console.log('User created successfully:', { id: newUser.id, nome, email, tipo });
    res.json({ 
      id: newUser.id,
      nome,
      email,
      tipo,
      message: 'Usuário cadastrado com sucesso!'
    });
  } catch (error) {
    console.error('Cadastro error:', error);
    res.status(500).json({ error: 'Erro ao processar cadastro: ' + error.message });
  }
});

// Endpoints temporários para teste
app.get('/api/usuarios/professores/pendentes', (req, res) => {
  const professoresPendentes = [
    {
      id: 1,
      nome: 'Professor Teste',
      email: 'professor@teste.com',
      cpf: '123.456.789-00',
      escola: 'Escola Teste',
      telefone: '(11) 99999-9999',
      documento_url: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
    }
  ];
  res.json(professoresPendentes);
});

app.get('/api/documentos-verificacao/usuario/:userId', (req, res) => {
  const documento = {
    id: 1,
    usuarioId: req.params.userId,
    nomeArquivo: 'comprovante.jpg',
    conteudoBase64: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
  };
  res.json([documento]);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});