import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db, initDatabase } from './database.js';

const app = express();
const PORT = 3001;
const JWT_SECRET = 'learnwave_secret_key';

app.use(cors());
app.use(express.json());

// Inicializar banco
initDatabase();

// Cadastro
app.post('/api/cadastro', (req, res) => {
  const { nome, email, senha, tipo, areaEnsino, formacao, experiencia } = req.body;
  
  const hashedPassword = bcrypt.hashSync(senha, 10);
  
  db.run(
    `INSERT INTO usuarios (nome, email, senha, tipo, area_ensino, formacao, experiencia) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [nome, email, hashedPassword, tipo, areaEnsino, formacao, experiencia],
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
      
      const token = jwt.sign({ id: user.id, email: user.email, tipo: user.tipo }, JWT_SECRET);
      
      res.json({
        token,
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          tipo: user.tipo,
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
  db.all('SELECT id, nome, email, tipo, area_ensino, formacao, experiencia, data_criacao FROM usuarios', (err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
    res.json(users);
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});