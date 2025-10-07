import { db, initDatabase } from './database.js';

// Inicializar banco
initDatabase();

// Listar todos os usuários
console.log('=== USUÁRIOS NO BANCO ===');
db.all('SELECT * FROM usuarios', (err, users) => {
  if (err) {
    console.error('Erro ao buscar usuários:', err);
  } else {
    console.log('Total de usuários:', users.length);
    users.forEach(user => {
      console.log(`ID: ${user.id}, Nome: ${user.nome}, Email: ${user.email}, Tipo: ${user.tipo}`);
    });
  }
  
  // Fechar conexão
  db.close();
});