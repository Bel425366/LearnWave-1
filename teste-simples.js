// Cole no console do navegador (F12):
const teste = {
  id: "teste123",
  titulo: "Teste Gramática",
  area: "Gramática", 
  descricao: "Teste",
  tipo: "multipla_escolha",
  status: "Publicada",
  excluido: false,
  questoes: [{
    id: 1,
    pergunta: "2+2=?",
    opcaoA: "3",
    opcaoB: "4", 
    opcaoC: "5",
    opcaoD: "6",
    respostaCorreta: "B"
  }]
};
localStorage.setItem('atividades', JSON.stringify([teste]));
location.reload();