// Script para criar atividade de debug
const atividadeDebug = {
  id: "debug-" + Date.now(),
  titulo: "Teste Debug - Gramática",
  area: "Gramática",
  descricao: "Atividade para testar o sistema",
  tipo: "multipla_escolha",
  status: "Publicada",
  excluido: false,
  data_criacao: new Date().toISOString(),
  questoes: [
    {
      id: 1,
      pergunta: "Qual é a capital do Brasil?",
      opcaoA: "São Paulo",
      opcaoB: "Rio de Janeiro", 
      opcaoC: "Brasília",
      opcaoD: "Salvador",
      respostaCorreta: "C"
    },
    {
      id: 2,
      pergunta: "Quantos dias tem uma semana?",
      opcaoA: "5 dias",
      opcaoB: "6 dias",
      opcaoC: "7 dias", 
      opcaoD: "8 dias",
      respostaCorreta: "C"
    }
  ]
};

// Limpar localStorage e adicionar atividade
localStorage.removeItem('atividades');
const atividades = [atividadeDebug];
localStorage.setItem('atividades', JSON.stringify(atividades));

console.log('Atividade de debug criada!');
console.log('ID:', atividadeDebug.id);
console.log('Questões:', atividadeDebug.questoes.length);
console.log('Dados salvos:', JSON.parse(localStorage.getItem('atividades')));