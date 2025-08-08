import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { db, initDatabase } from './database.js';

const app = express();
const PORT = 3001;
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
initDatabase();

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

// Login
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

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});