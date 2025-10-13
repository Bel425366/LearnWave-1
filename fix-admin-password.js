import { db, initDatabase } from './server/database.js';

initDatabase();

// Atualizar senha do admin para texto simples
const novaSenh = 'adm1234';

db.run(
  "UPDATE usuarios SET senha = ? WHERE tipo = 'administrador' OR tipo = 'ADMINISTRADOR'",
  [novaSenh],
  function(err) {
    if (err) {
      console.error('Erro ao atualizar senha:', err);
      return;
    }
    
    console.log(`Senha do admin atualizada para: ${novaSenh}`);
    console.log(`Registros atualizados: ${this.changes}`);
    
    // Verificar resultado
    db.all("SELECT id, nome, email, senha, tipo FROM usuarios WHERE tipo = 'administrador' OR tipo = 'ADMINISTRADOR'", (err, rows) => {
      if (err) {
        console.error('Erro:', err);
        return;
      }
      
      console.log('\nAdmins atualizados:');
      rows.forEach(admin => {
        console.log(`ID: ${admin.id}, Nome: ${admin.nome}, Email: ${admin.email}, Senha: ${admin.senha}`);
      });
      
      process.exit(0);
    });
  }
);