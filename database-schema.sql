-- Estrutura do banco de dados para LearnWave

-- Tabela de usuários
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo_usuario ENUM('aluno', 'professor', 'admin') NOT NULL,
    area_ensino VARCHAR(255), -- Apenas para professores
    formacao VARCHAR(255), -- Apenas para professores
    experiencia VARCHAR(100), -- Apenas para professores
    status ENUM('ativo', 'inativo') DEFAULT 'ativo',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de atividades
CREATE TABLE atividades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    area VARCHAR(100) NOT NULL,
    professor_id INT NOT NULL,
    conteudo TEXT,
    status ENUM('rascunho', 'publicada', 'arquivada') DEFAULT 'rascunho',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (professor_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabela de videoaulas
CREATE TABLE videoaulas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    area VARCHAR(100) NOT NULL,
    professor_id INT NOT NULL,
    url_video VARCHAR(500),
    duracao VARCHAR(20),
    status ENUM('rascunho', 'publicada', 'arquivada') DEFAULT 'rascunho',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (professor_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabela de materiais
CREATE TABLE materiais (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    area VARCHAR(100) NOT NULL,
    professor_id INT NOT NULL,
    arquivo_url VARCHAR(500),
    tipo_arquivo VARCHAR(10),
    tamanho_arquivo INT,
    status ENUM('rascunho', 'publicado', 'arquivado') DEFAULT 'rascunho',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (professor_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabela de progresso dos alunos nas atividades
CREATE TABLE progresso_atividades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    aluno_id INT NOT NULL,
    atividade_id INT NOT NULL,
    status ENUM('nao_iniciada', 'em_andamento', 'concluida') DEFAULT 'nao_iniciada',
    nota DECIMAL(4,2),
    tentativas INT DEFAULT 0,
    data_inicio TIMESTAMP,
    data_conclusao TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (aluno_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (atividade_id) REFERENCES atividades(id) ON DELETE CASCADE,
    UNIQUE KEY unique_aluno_atividade (aluno_id, atividade_id)
);

-- Tabela de progresso dos alunos nas videoaulas
CREATE TABLE progresso_videoaulas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    aluno_id INT NOT NULL,
    videoaula_id INT NOT NULL,
    status ENUM('nao_assistida', 'em_andamento', 'concluida') DEFAULT 'nao_assistida',
    tempo_assistido INT DEFAULT 0, -- em segundos
    data_inicio TIMESTAMP,
    data_conclusao TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (aluno_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (videoaula_id) REFERENCES videoaulas(id) ON DELETE CASCADE,
    UNIQUE KEY unique_aluno_videoaula (aluno_id, videoaula_id)
);

-- Tabela de downloads de materiais
CREATE TABLE downloads_materiais (
    id INT PRIMARY KEY AUTO_INCREMENT,
    aluno_id INT NOT NULL,
    material_id INT NOT NULL,
    data_download TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (aluno_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (material_id) REFERENCES materiais(id) ON DELETE CASCADE
);

-- Tabela de configurações do sistema
CREATE TABLE configuracoes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    chave VARCHAR(100) UNIQUE NOT NULL,
    valor TEXT,
    descricao TEXT,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inserir administrador padrão
INSERT INTO usuarios (nome, email, senha, tipo_usuario) VALUES 
('Administrador', 'admin@learnwave.com', '$2b$10$hashedpassword', 'admin');

-- Inserir configurações padrão
INSERT INTO configuracoes (chave, valor, descricao) VALUES 
('nome_site', 'LearnWave - Português', 'Nome do site'),
('descricao_site', 'Plataforma de ensino de Língua Portuguesa', 'Descrição do site'),
('permitir_cadastro_alunos', 'true', 'Permitir auto-cadastro de alunos'),
('permitir_cadastro_professores', 'true', 'Permitir auto-cadastro de professores');