import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('learnwave.db');

console.log('🔧 Corrigindo status_verificacao no banco...');

// Atualizar todos os registros com status minúsculo para maiúsculo
db.run(`UPDATE usuarios SET status_verificacao = 'APROVADO' WHERE status_verificacao = 'aprovado'`, function(err) {
  if (err) {
    console.error('Erro ao atualizar aprovado:', err);
  } else {
    console.log('✅ Atualizados', this.changes, 'registros de aprovado para APROVADO');
  }
});

db.run(`UPDATE usuarios SET status_verificacao = 'PENDENTE' WHERE status_verificacao = 'pendente'`, function(err) {
  if (err) {
    console.error('Erro ao atualizar pendente:', err);
  } else {
    console.log('✅ Atualizados', this.changes, 'registros de pendente para PENDENTE');
  }
});

db.run(`UPDATE usuarios SET status_verificacao = 'REJEITADO' WHERE status_verificacao = 'rejeitado'`, function(err) {
  if (err) {
    console.error('Erro ao atualizar rejeitado:', err);
  } else {
    console.log('✅ Atualizados', this.changes, 'registros de rejeitado para REJEITADO');
  }
  
  // Verificar o resultado final
  db.all('SELECT email, tipo, status_verificacao FROM usuarios', (err, users) => {
    if (err) {
      console.error('Erro ao verificar usuários:', err);
    } else {
      console.log('\n📋 Status final dos usuários:');
      users.forEach(user => {
        console.log(`${user.email} (${user.tipo}): ${user.status_verificacao}`);
      });
    }
    
    db.close();
  });
});