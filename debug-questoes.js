// Cole no console para criar atividade de teste
const atividadeTeste = {
  id: "debug-questoes-" + Date.now(),
  titulo: "Debug - Múltiplas Questões",
  area: "Gramática",
  descricao: "Teste para verificar múltiplas questões",
  tipo: "multipla_escolha",
  status: "Publicada",
  excluido: false,
  questoes: [
    {
      id: 1,
      pergunta: "Primeira pergunta: Qual é a capital do Brasil?",
      opcaoA: "São Paulo",
      opcaoB: "Rio de Janeiro", 
      opcaoC: "Brasília",
      opcaoD: "Salvador",
      respostaCorreta: "C"
    },
    {
      id: 2,
      pergunta: "Segunda pergunta: Quantos dias tem uma semana?",
      opcaoA: "5 dias",
      opcaoB: "6 dias",
      opcaoC: "7 dias",
      opcaoD: "8 dias", 
      respostaCorreta: "C"
    },
    {
      id: 3,
      pergunta: "Terceira pergunta: Qual é o maior planeta do sistema solar?",
      opcaoA: "Terra",
      opcaoB: "Júpiter",
      opcaoC: "Saturno",
      opcaoD: "Marte",
      respostaCorreta: "B"
    }
  ]
};

// Limpar e adicionar
localStorage.removeItem('atividades');
localStorage.setItem('atividades', JSON.stringify([atividadeTeste]));
console.log('Atividade criada:', atividadeTeste);
location.reload();