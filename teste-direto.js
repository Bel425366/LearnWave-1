// TESTE DIRETO - Cole no console
const atividadeTeste = {
  id: "teste-direto-123",
  titulo: "TESTE DIRETO - 3 Questões",
  area: "Gramática",
  descricao: "Teste para verificar se aparecem todas as questões",
  tipo: "multipla_escolha",
  status: "Publicada",
  excluido: false,
  questoes: [
    {
      id: 1,
      pergunta: "PRIMEIRA PERGUNTA: Qual é a capital do Brasil?",
      opcaoA: "São Paulo",
      opcaoB: "Rio de Janeiro",
      opcaoC: "Brasília",
      opcaoD: "Salvador",
      respostaCorreta: "C"
    },
    {
      id: 2,
      pergunta: "SEGUNDA PERGUNTA: Quantos dias tem uma semana?",
      opcaoA: "5 dias",
      opcaoB: "6 dias", 
      opcaoC: "7 dias",
      opcaoD: "8 dias",
      respostaCorreta: "C"
    },
    {
      id: 3,
      pergunta: "TERCEIRA PERGUNTA: Qual é o maior planeta?",
      opcaoA: "Terra",
      opcaoB: "Júpiter",
      opcaoC: "Saturno", 
      opcaoD: "Marte",
      respostaCorreta: "B"
    }
  ]
};

// Limpar e adicionar
localStorage.clear();
localStorage.setItem('atividades', JSON.stringify([atividadeTeste]));
console.log('ATIVIDADE CRIADA:', atividadeTeste);
console.log('QUESTÕES:', atividadeTeste.questoes.length);
location.reload();