CREATE DATABASE LearnWave;
GO

USE LearnWave;
GO

CREATE TABLE usuarios (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nome NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) UNIQUE NOT NULL,
    senha NVARCHAR(255) NOT NULL,
    tipo_usuario NVARCHAR(20) NOT NULL CHECK (tipo_usuario IN ('aluno', 'professor', 'admin')),
    area_ensino NVARCHAR(255),
    formacao NVARCHAR(255),
    experiencia NVARCHAR(100),
    status NVARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
    data_criacao DATETIME2 DEFAULT GETDATE(),
    data_atualizacao DATETIME2 DEFAULT GETDATE()
);

CREATE TABLE atividades (
    id INT IDENTITY(1,1) PRIMARY KEY,
    titulo NVARCHAR(255) NOT NULL,
    descricao NTEXT,
    area NVARCHAR(100) NOT NULL,
    professor_id INT NOT NULL,
    conteudo NTEXT,
    status NVARCHAR(20) DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'publicada', 'arquivada')),
    data_criacao DATETIME2 DEFAULT GETDATE(),
    data_atualizacao DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (professor_id) REFERENCES usuarios(id)
);

CREATE TABLE videoaulas (
    id INT IDENTITY(1,1) PRIMARY KEY,
    titulo NVARCHAR(255) NOT NULL,
    descricao NTEXT,
    area NVARCHAR(100) NOT NULL,
    professor_id INT NOT NULL,
    url_video NVARCHAR(500),
    duracao NVARCHAR(20),
    status NVARCHAR(20) DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'publicada', 'arquivada')),
    data_criacao DATETIME2 DEFAULT GETDATE(),
    data_atualizacao DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (professor_id) REFERENCES usuarios(id)
);

CREATE TABLE materiais (
    id INT IDENTITY(1,1) PRIMARY KEY,
    titulo NVARCHAR(255) NOT NULL,
    descricao NTEXT,
    area NVARCHAR(100) NOT NULL,
    professor_id INT NOT NULL,
    arquivo_url NVARCHAR(500),
    tipo_arquivo NVARCHAR(10),
    tamanho_arquivo INT,
    status NVARCHAR(20) DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'publicado', 'arquivado')),
    data_criacao DATETIME2 DEFAULT GETDATE(),
    data_atualizacao DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (professor_id) REFERENCES usuarios(id)
);

CREATE TABLE progresso_atividades (
    id INT IDENTITY(1,1) PRIMARY KEY,
    aluno_id INT NOT NULL,
    atividade_id INT NOT NULL,
    status NVARCHAR(20) DEFAULT 'nao_iniciada' CHECK (status IN ('nao_iniciada', 'em_andamento', 'concluida')),
    nota DECIMAL(4,2),
    tentativas INT DEFAULT 0,
    data_inicio DATETIME2,
    data_conclusao DATETIME2,
    data_atualizacao DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (aluno_id) REFERENCES usuarios(id),
    FOREIGN KEY (atividade_id) REFERENCES atividades(id),
    CONSTRAINT unique_aluno_atividade UNIQUE (aluno_id, atividade_id)
);

CREATE TABLE progresso_videoaulas (
    id INT IDENTITY(1,1) PRIMARY KEY,
    aluno_id INT NOT NULL,
    videoaula_id INT NOT NULL,
    status NVARCHAR(20) DEFAULT 'nao_assistida' CHECK (status IN ('nao_assistida', 'em_andamento', 'concluida')),
    tempo_assistido INT DEFAULT 0,
    data_inicio DATETIME2,
    data_conclusao DATETIME2,
    data_atualizacao DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (aluno_id) REFERENCES usuarios(id),
    FOREIGN KEY (videoaula_id) REFERENCES videoaulas(id),
    CONSTRAINT unique_aluno_videoaula UNIQUE (aluno_id, videoaula_id)
);

CREATE TABLE downloads_materiais (
    id INT IDENTITY(1,1) PRIMARY KEY,
    aluno_id INT NOT NULL,
    material_id INT NOT NULL,
    data_download DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (aluno_id) REFERENCES usuarios(id),
    FOREIGN KEY (material_id) REFERENCES materiais(id)
);

CREATE TABLE configuracoes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    chave NVARCHAR(100) UNIQUE NOT NULL,
    valor NTEXT,
    descricao NTEXT,
    data_atualizacao DATETIME2 DEFAULT GETDATE()
);

CREATE INDEX IX_usuarios_email ON usuarios(email);
CREATE INDEX IX_usuarios_tipo ON usuarios(tipo_usuario);
CREATE INDEX IX_atividades_professor ON atividades(professor_id);
CREATE INDEX IX_atividades_area ON atividades(area);
CREATE INDEX IX_videoaulas_professor ON videoaulas(professor_id);
CREATE INDEX IX_videoaulas_area ON videoaulas(area);
CREATE INDEX IX_materiais_professor ON materiais(professor_id);
CREATE INDEX IX_materiais_area ON materiais(area);

CREATE PROCEDURE sp_login
    @email NVARCHAR(255),
    @senha NVARCHAR(255)
AS
BEGIN
    SELECT id, nome, email, tipo_usuario, area_ensino, formacao, experiencia
    FROM usuarios
    WHERE email = @email AND senha = @senha AND status = 'ativo';
END;
GO

CREATE PROCEDURE sp_cadastrar_usuario
    @nome NVARCHAR(255),
    @email NVARCHAR(255),
    @senha NVARCHAR(255),
    @tipo_usuario NVARCHAR(20),
    @area_ensino NVARCHAR(255) = NULL,
    @formacao NVARCHAR(255) = NULL,
    @experiencia NVARCHAR(100) = NULL
AS
BEGIN
    INSERT INTO usuarios (nome, email, senha, tipo_usuario, area_ensino, formacao, experiencia)
    VALUES (@nome, @email, @senha, @tipo_usuario, @area_ensino, @formacao, @experiencia);
    SELECT SCOPE_IDENTITY() AS id;
END;
GO

INSERT INTO usuarios (nome, email, senha, tipo_usuario) VALUES 
('Administrador', 'admin@learnwave.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

INSERT INTO configuracoes (chave, valor, descricao) VALUES 
('nome_site', 'LearnWave - Português', 'Nome do site'),
('descricao_site', 'Plataforma de ensino de Língua Portuguesa', 'Descrição do site'),
('permitir_cadastro_alunos', 'true', 'Permitir auto-cadastro de alunos'),
('permitir_cadastro_professores', 'true', 'Permitir auto-cadastro de professores');

INSERT INTO videoaulas (titulo, descricao, area, professor_id, url_video, duracao, status) VALUES 
('Classes de Palavras', 'Aula sobre substantivos, adjetivos, verbos...', 'gramatica', 1, 'https://youtube.com/exemplo1', '15 min', 'publicada'),
('Barroco no Brasil', 'Características do movimento barroco', 'literatura', 1, 'https://youtube.com/exemplo2', '25 min', 'publicada'),
('Estrutura da Dissertação', 'Como estruturar uma redação dissertativa', 'redacao', 1, 'https://youtube.com/exemplo3', '20 min', 'publicada');

INSERT INTO materiais (titulo, descricao, area, professor_id, arquivo_url, tipo_arquivo, status) VALUES 
('Guia de Classes de Palavras', 'Material completo sobre gramática', 'gramatica', 1, '/materiais/gramatica.pdf', 'PDF', 'publicado'),
('Linha do Tempo Literária', 'Principais movimentos literários', 'literatura', 1, '/materiais/literatura.pdf', 'PDF', 'publicado'),
('Modelo de Redação ENEM', 'Exemplos de redações nota 1000', 'redacao', 1, '/materiais/redacao.pdf', 'PDF', 'publicado');