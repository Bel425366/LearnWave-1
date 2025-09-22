# Sistema de Correção Automática - LearnWave

## Funcionalidades Implementadas

### 1. Correção Automática de Atividades
- **Tipo de Atividade**: Múltipla Escolha
- **Correção**: Automática baseada na resposta correta definida pelo professor
- **Pontuação**: 
  - Resposta correta = 10 pontos
  - Resposta incorreta = 0 pontos

### 2. Como Funciona

#### Para Professores:
1. **Criar Atividade**:
   - Acesse o Painel do Professor
   - Vá para a aba "Atividades"
   - Clique em "Nova Atividade"
   - Preencha os dados:
     - Título da atividade
     - Área (Gramática, Literatura, etc.)
     - Descrição
     - Tipo: Selecione "Múltipla Escolha"
     - Opções A, B, C, D
     - **Resposta Correta**: Selecione a alternativa correta
     - Status: "Publicada" (para ficar disponível aos alunos)

2. **Acompanhar Resultados**:
   - As atividades de múltipla escolha são corrigidas automaticamente
   - Os resultados aparecem na aba "Progresso dos Alunos"
   - Submissões marcadas como "corrigida" e "correção automática"

#### Para Alunos:
1. **Fazer Atividade**:
   - Acesse o Dashboard
   - Escolha uma área (ex: Gramática)
   - Clique em "Atividades"
   - Selecione uma atividade disponível
   - Clique em "Iniciar"

2. **Responder**:
   - Selecione uma das alternativas (A, B, C ou D)
   - Clique em "Enviar Resposta"
   - **Resultado Imediato**:
     - ✅ Resposta correta: Nota 10
     - ❌ Resposta incorreta: Nota 0 + mostra a resposta correta

### 3. Estrutura do Banco de Dados

#### Tabela `atividades`:
```sql
CREATE TABLE atividades (
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
  data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Tabela `submissoes`:
```sql
CREATE TABLE submissoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  atividade_id TEXT NOT NULL,
  aluno_id INTEGER NOT NULL,
  aluno_nome TEXT NOT NULL,
  aluno_email TEXT NOT NULL,
  resposta TEXT NOT NULL,
  nota REAL,
  status TEXT DEFAULT 'pendente',
  correcao_automatica BOOLEAN DEFAULT 0,
  data_submissao DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Exemplo de Uso

#### Criando uma Atividade de Teste:
```javascript
const atividade = {
  titulo: "Classes de Palavras - Substantivos",
  area: "Gramática",
  descricao: "Identifique a alternativa que contém apenas substantivos:",
  tipo: "multipla_escolha",
  opcaoA: "casa, bonito, correr",
  opcaoB: "livro, mesa, caneta",
  opcaoC: "rapidamente, muito, bem", 
  opcaoD: "é, estava, será",
  respostaCorreta: "B",
  status: "Publicada"
};
```

### 5. Fluxo de Correção

1. **Aluno responde** → Seleciona alternativa
2. **Sistema compara** → Resposta do aluno vs. resposta correta
3. **Correção automática** → Atribui nota (10 ou 0)
4. **Feedback imediato** → Mostra resultado na tela
5. **Armazenamento** → Salva no banco com flag `correcao_automatica = true`

### 6. Vantagens

- **Feedback Imediato**: Aluno recebe o resultado na hora
- **Economia de Tempo**: Professor não precisa corrigir manualmente
- **Padronização**: Critério de correção sempre consistente
- **Escalabilidade**: Suporta muitos alunos simultaneamente

### 7. Limitações Atuais

- Apenas atividades de múltipla escolha
- Pontuação binária (10 ou 0)
- Uma tentativa por atividade

### 8. Próximas Melhorias

- [ ] Múltiplas tentativas
- [ ] Pontuação parcial
- [ ] Questões verdadeiro/falso
- [ ] Feedback explicativo
- [ ] Relatórios detalhados