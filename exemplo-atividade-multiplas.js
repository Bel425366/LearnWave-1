// Exemplo de atividade com múltiplas questões
const atividadeMultipla = {
  id: "atividade-multipla-1",
  titulo: "Gramática - Classes de Palavras",
  area: "Gramática", 
  descricao: "Teste seus conhecimentos sobre classes de palavras",
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
const existe = atividades.find(a => a.id === atividadeMultipla.id);

if (!existe) {
  atividades.push(atividadeMultipla);
  localStorage.setItem('atividades', JSON.stringify(atividades));
  console.log('Atividade com múltiplas questões criada!');
} else {
  console.log('Atividade já existe.');
}