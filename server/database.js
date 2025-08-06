import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';

const db = new sqlite3.Database('learnwave.db');

// Inicializar banco
export const initDatabase = () => {
  db.serialize(() => {
    // Tabela usuarios
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL,
      tipo TEXT NOT NULL,
      area_ensino TEXT,
      formacao TEXT,
      experiencia TEXT,
      data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Inserir admins padrão
    const adminPassword = bcrypt.hashSync('admin123', 10);
    
    db.run(`INSERT OR IGNORE INTO usuarios (nome, email, senha, tipo) VALUES 
      ('Administrador 1', 'pereiraisabelly585@gmail.com', ?, 'administrador'),
      ('Administrador 2', 'jusf.2909@gmail.com', ?, 'administrador')`,
      [adminPassword, adminPassword]
    );
  });
};

export { db };