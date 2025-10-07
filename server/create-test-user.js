import { db, initDatabase } from './database.js';
import bcrypt from 'bcryptjs';

// Inicializar banco
initDatabase();

// Criar usuário de teste
const testUser = {
  nome: 'Yasmin Teste',
  email: 'yasmincunegundes25@gmail.com',
  senha: '@teste12',
  tipo: 'aluno'
};

const hashedPassword = bcrypt.hashSync(testUser.senha, 10);

db.run(
  `INSERT OR REPLACE INTO usuarios (nome, email, senha, tipo, status_verificacao) 
   VALUES (?, ?, ?, ?, 'aprovado')`,
  [testUser.nome, testUser.email, hashedPassword, testUser.tipo],
  function(err) {
    if (err) {
      console.error('Erro ao criar usuário:', err);
    } else {
      console.log('Usuário de teste criado com sucesso!');
      console.log('Email:', testUser.email);
      console.log('Senha:', testUser.senha);
      console.log('Tipo:', testUser.tipo);
    }
    
    // Verificar se foi criado
    db.get('SELECT * FROM usuarios WHERE email = ?', [testUser.email], (err, user) => {
      if (err) {
        console.error('Erro ao verificar usuário:', err);
      } else if (user) {
        console.log('Usuário encontrado no banco:', {
          id: user.id,
          nome: user.nome,
          email: user.email,
          tipo: user.tipo
        });
      } else {
        console.log('Usuário não encontrado no banco');
      }
      
      db.close();
    });
  }
);