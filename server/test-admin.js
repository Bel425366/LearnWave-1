import { db, initDatabase } from './database.js';
import bcrypt from 'bcryptjs';

initDatabase();

// Verificar admins no banco
db.all("SELECT * FROM usuarios WHERE tipo = 'administrador'", (err, rows) => {
  if (err) {
    console.error('Erro:', err);
    return;
  }
  
  console.log('Administradores no banco:');
  rows.forEach(admin => {
    console.log(`ID: ${admin.id}, Nome: ${admin.nome}, Email: ${admin.email}`);
    
    // Testar senha
    const senhaCorreta = bcrypt.compareSync('admin123', admin.senha);
    console.log(`Senha 'admin123' funciona: ${senhaCorreta}`);
  });
  
  process.exit(0);
});