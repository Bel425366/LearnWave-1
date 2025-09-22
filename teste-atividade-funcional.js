// Atividade de teste funcional
const atividadeTeste = {
  id: "teste-funcional-" + Date.now(),
  titulo: "Teste de Gramática - Classes de Palavras",
  area: "Gramática",
  descricao: "Teste com múltiplas questões sobre classes de palavras",
  tipo: "multipla_escolha",
  status: "Publicada",
  excluido: false,
  data_criacao: new Date().toISOString(),
  questoes: [
    {
      id: 1,
      pergunta: "Qual das alternativas contém apenas substantivos?",
      opcaoA: "casa, bonito, correr",
      opcaoB: "livro, mesa, caneta",
      opcaoC: "rapidamente, muito, bem",
      opcaoD: "é, estava, será",
      respostaCorreta: "B"
    },
    {
      id: 2,
      pergunta: "Identifique a alternativa que contém apenas adjetivos:",
      opcaoA: "belo, inteligente, rápido",
      opcaoB: "casa, carro, pessoa",
      opcaoC: "correr, pular, nadar",
      opcaoD: "ontem, hoje, amanhã",
      respostaCorreta: "A"
    },
    {
      id: 3,
      pergunta: "Qual alternativa apresenta apenas verbos?",
      opcaoA: "azul, verde, amarelo",
      opcaoB: "estudar, trabalhar, descansar",
      opcaoC: "escola, professor, aluno",
      opcaoD: "muito, pouco, bastante",
      respostaCorreta: "B"
    }
  ]
};

// Adicionar ao localStorage
const atividades = JSON.parse(localStorage.getItem('atividades') || '[]');
atividades.push(atividadeTeste);
localStorage.setItem('atividades', JSON.stringify(atividades));
console.log('Atividade de teste criada com sucesso!');
console.log('ID:', atividadeTeste.id);
console.log('Questões:', atividadeTeste.questoes.length);