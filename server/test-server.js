import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

// Teste simples
app.post('/api/usuarios', (req, res) => {
  console.log('Received:', req.body);
  res.json({ message: 'Teste OK', data: req.body });
});

app.post('/api/usuarios/login', (req, res) => {
  console.log('Login received:', req.body);
  res.json({ 
    user: { 
      nome: 'Teste', 
      email: req.body.email, 
      tipo: req.body.tipo || 'aluno' 
    } 
  });
});

app.listen(PORT, () => {
  console.log(`Servidor de teste rodando na porta ${PORT}`);
});