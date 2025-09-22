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

    // Tabela de atividades
    db.run(`CREATE TABLE IF NOT EXISTS atividades (
      id TEXT PRIMARY KEY,
      titulo TEXT NOT NULL,
      area TEXT NOT NULL,
      descricao TEXT NOT NULL,
      tipo TEXT NOT NULL,
      opcaoA TEXT,
      opcaoB TEXT,
      opcaoC TEXT,
      opcaoD TEXT,
      resposta_correta TEXT,
      status TEXT DEFAULT 'Rascunho',
      professor_id INTEGER,
      excluido BOOLEAN DEFAULT 0,
      data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (professor_id) REFERENCES usuarios(id)
    )`);

    // Tabela de submissões
    db.run(`CREATE TABLE IF NOT EXISTS submissoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      atividade_id TEXT NOT NULL,
      aluno_id INTEGER NOT NULL,
      aluno_nome TEXT NOT NULL,
      aluno_email TEXT NOT NULL,
      resposta TEXT NOT NULL,
      nota REAL,
      status TEXT DEFAULT 'pendente',
      correcao_automatica BOOLEAN DEFAULT 0,
      data_submissao DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (atividade_id) REFERENCES atividades(id),
      FOREIGN KEY (aluno_id) REFERENCES usuarios(id)
    )`);

    // Inserir admins padrão
    const adminPassword = bcrypt.hashSync('admin123', 10);
    
    db.run(`INSERT OR IGNORE INTO usuarios (nome, email, senha, tipo, status_verificacao) VALUES 
      ('Administrador 1', 'pereiraisabelly585@gmail.com', ?, 'administrador', 'aprovado'),
      ('Administrador 2', 'jusf.2909@gmail.com', ?, 'administrador', 'aprovado')`,
      [adminPassword, adminPassword]
    );

    console.log('Banco de dados inicializado com sucesso!');
  });
};

// Função para salvar submissão
export const salvarSubmissao = (submissao) => {
  return new Promise((resolve, reject) => {
    const { atividade_id, aluno_id, aluno_nome, aluno_email, resposta, nota, status, correcao_automatica } = submissao;
    
    db.run(
      `INSERT INTO submissoes (atividade_id, aluno_id, aluno_nome, aluno_email, resposta, nota, status, correcao_automatica) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [atividade_id, aluno_id, aluno_nome, aluno_email, resposta, nota, status, correcao_automatica],
      function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, ...submissao });
        }
      }
    );
  });
};

// Função para buscar submissões
export const buscarSubmissoes = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM submissoes ORDER BY data_submissao DESC', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Função para atualizar nota de submissão
export const atualizarNota = (submissaoId, nota) => {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE submissoes SET nota = ?, status = "corrigida" WHERE id = ?',
      [nota, submissaoId],
      function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      }
    );
  });
};

export { db };