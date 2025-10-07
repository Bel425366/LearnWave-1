import bcrypt from 'bcryptjs';

const senha = '@teste12';
const hash = bcrypt.hashSync(senha, 10);

console.log('Senha:', senha);
console.log('Hash:', hash);

// Testar se funciona
const match = bcrypt.compareSync(senha, hash);
console.log('Match:', match);