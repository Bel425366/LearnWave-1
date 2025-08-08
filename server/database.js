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
      cpf TEXT,
      disciplina TEXT,
      escola TEXT,
      telefone TEXT,
      documento_url TEXT,
      status_verificacao TEXT DEFAULT 'pendente',
      area_ensino TEXT,
      formacao TEXT,
      experiencia TEXT,
      data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tabela de documentos de verificação
    db.run(`CREATE TABLE IF NOT EXISTS documentos_verificacao (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      nome_arquivo TEXT NOT NULL,
      caminho_arquivo TEXT NOT NULL,
      tipo_documento TEXT NOT NULL,
      data_upload DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )`);

    // Inserir admins padrão
    const adminPassword = bcrypt.hashSync('admin123', 10);
    
    db.run(`INSERT OR IGNORE INTO usuarios (nome, email, senha, tipo, status_verificacao) VALUES 
      ('Administrador 1', 'pereiraisabelly585@gmail.com', ?, 'administrador', 'aprovado'),
      ('Administrador 2', 'jusf.2909@gmail.com', ?, 'administrador', 'aprovado')`,
      [adminPassword, adminPassword]
    );
  });
};

export { db };