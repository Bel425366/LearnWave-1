import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';

const db = new sqlite3.Database('./server/learnwave.db');

console.log('🔧 Corrigindo problema de login do administrador...');

// Primeiro, vamos ver o que está no banco
db.all('SELECT * FROM usuarios WHERE tipo = "administrador" OR tipo = "ADMINISTRADOR"', (err, admins) => {
  if (err) {
    console.error('Erro ao buscar admins:', err);
    return;
  }
  
  console.log('📋 Administradores encontrados:', admins);
  
  // Corrigir os dados dos administradores
  const adminPassword = bcrypt.hashSync('adm1234', 10);
  
  // Atualizar ou inserir administradores com dados corretos
  db.run(`DELETE FROM usuarios WHERE email = 'pereiraisabelly585@gmail.com'`, (err) => {
    if (err) console.error('Erro ao deletar admin existente:', err);
    
    db.run(`INSERT INTO usuarios (nome, email, senha, tipo, status_verificacao) VALUES 
      ('Administrador Principal', 'pereiraisabelly585@gmail.com', ?, 'administrador', 'APROVADO')`,
      [adminPassword],
      function(err) {
        if (err) {
          console.error('Erro ao inserir admin:', err);
        } else {
          console.log('✅ Administrador criado com sucesso! ID:', this.lastID);
          
          // Verificar se foi criado corretamente
          db.get('SELECT * FROM usuarios WHERE email = ?', ['pereiraisabelly585@gmail.com'], (err, user) => {
            if (err) {
              console.error('Erro ao verificar admin:', err);
            } else {
              console.log('✅ Admin verificado:', user);
              console.log('🔐 Senha hash:', user.senha);
              console.log('📧 Email:', user.email);
              console.log('👤 Tipo:', user.tipo);
              console.log('✔️ Status:', user.status_verificacao);
              
              // Testar a senha
              const senhaCorreta = bcrypt.compareSync('adm1234', user.senha);
              console.log('🔑 Teste de senha:', senhaCorreta ? 'PASSOU' : 'FALHOU');
            }
            
            db.close();
          });
        }
      }
    );
  });
});