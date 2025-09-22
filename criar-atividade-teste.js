// Script para criar uma atividade de teste
const atividadeTeste = {
  id: "atividade-teste-1",
  titulo: "Classes de Palavras - Substantivos",
  area: "Gramática",
  descricao: "Identifique a alternativa que contém apenas substantivos:",
  tipo: "multipla_escolha",
  opcaoA: "casa, bonito, correr",
  opcaoB: "livro, mesa, caneta",
  opcaoC: "rapidamente, muito, bem",
  opcaoD: "é, estava, será",
  respostaCorreta: "B",
  status: "Publicada",
  excluido: false,
  data_criacao: new Date().toISOString()
};

// Adicionar ao localStorage
const atividades = JSON.parse(localStorage.getItem('atividades') || '[]');
const atividadeExiste = atividades.find(a => a.id === atividadeTeste.id);

if (!atividadeExiste) {
  atividades.push(atividadeTeste);
  localStorage.setItem('atividades', JSON.stringify(atividades));
  console.log('Atividade de teste criada com sucesso!');
} else {
  console.log('Atividade de teste já existe.');
}