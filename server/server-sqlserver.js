import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { initDatabase, getPool, sql } from './database-sqlserver.js';

const app = express();
const PORT = 8080;
const JWT_SECRET = 'learnwave_secret_key';

app.use(cors());
app.use(express.json());

// Inicializar banco
initDatabase().catch(console.error);

// Cadastro
app.post('/api/usuarios', async (req, res) => {
  console.log('Cadastro request:', req.body);
  const { nome, email, senha, tipo, areaEnsino, formacao, experiencia } = req.body;
  
  if (!nome || !email || !senha || !tipo) {
    return res.status(400).json({ error: 'Nome, email, senha e tipo são obrigatórios' });
  }
  
  try {
    const pool = getPool();
    const hashedPassword = bcrypt.hashSync(senha, 10);
    
    // Definir status_verificacao baseado no tipo
    let statusVerificacao = 'PENDENTE';
    if (tipo === 'ADMIN' || tipo === 'ESTUDANTE') {
      statusVerificacao = 'APROVADO';
    }
    
    const result = await pool.request()
      .input('nome', sql.NVarChar, nome)
      .input('email', sql.NVarChar, email)
      .input('senha', sql.NVarChar, hashedPassword)
      .input('tipo_usuario', sql.NVarChar, tipo)
      .input('status_verificacao', sql.NVarChar, statusVerificacao)
      .input('area_ensino', sql.NVarChar, areaEnsino)
      .input('formacao', sql.NVarChar, formacao)
      .input('experiencia', sql.NVarChar, experiencia)
      .query(`
        INSERT INTO usuarios (nome, email, senha, tipo_usuario, status_verificacao, area_ensino, formacao, experiencia)
        VALUES (@nome, @email, @senha, @tipo_usuario, @status_verificacao, @area_ensino, @formacao, @experiencia);
        SELECT SCOPE_IDENTITY() AS id;
      `);
    
    const userId = result.recordset[0].id;
    console.log('User created with ID:', userId);
    
    res.json({
      id: userId,
      nome,
      email,
      tipo,
      message: 'Usuário cadastrado com sucesso!'
    });
  } catch (error) {
    console.error('Cadastro error:', error);
    if (error.message.includes('UNIQUE KEY constraint')) {
      return res.status(400).json({ error: 'Este email já está cadastrado!' });
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Login
app.post('/api/usuarios/login', async (req, res) => {
  console.log('Login request:', req.body);
  const { email, senha, tipo } = req.body;
  
  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }
  
  try {
    const pool = getPool();
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT * FROM usuarios WHERE email = @email AND status = \'ativo\'');
    
    const user = result.recordset[0];
    
    if (!user) {
      return res.status(401).json({ error: 'Email ou senha incorretos!' });
    }
    
    // Verificar tipo se fornecido
    if (tipo && user.tipo_usuario !== tipo) {
      return res.status(401).json({ error: 'Email ou senha incorretos!' });
    }
    
    const passwordMatch = bcrypt.compareSync(senha, user.senha);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Email ou senha incorretos!' });
    }
    
    const token = jwt.sign({ id: user.id, email: user.email, tipo: user.tipo_usuario }, JWT_SECRET);
    
    res.json({
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo_usuario,
        areaEnsino: user.area_ensino,
        formacao: user.formacao,
        experiencia: user.experiencia
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});