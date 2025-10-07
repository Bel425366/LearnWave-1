import sql from 'mssql';
import bcrypt from 'bcryptjs';

const config = {
  user: 'sa', // SUBSTITUA pelo seu usuário do SQL Server
  password: 'SUA_SENHA_AQUI', // SUBSTITUA pela sua senha do SQL Server
  server: 'localhost', // ou o endereço do seu servidor
  database: 'LearnWave',
  options: {
    encrypt: false, // para desenvolvimento local
    trustServerCertificate: true
  }
};

let pool;

export const initDatabase = async () => {
  try {
    pool = await sql.connect(config);
    console.log('Conectado ao SQL Server');
    return pool;
  } catch (err) {
    console.error('Erro ao conectar ao SQL Server:', err);
    throw err;
  }
};

export const getPool = () => {
  if (!pool) {
    throw new Error('Database not initialized');
  }
  return pool;
};

export { sql };