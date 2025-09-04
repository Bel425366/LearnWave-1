-- =============================================
-- Script de Criação do Banco de Dados LearnWave
-- SQL Server
-- =============================================

-- Criar banco de dados
CREATE DATABASE LearnWave;
GO

USE LearnWave;
GO

-- =============================================
-- TABELAS PRINCIPAIS
-- =============================================

-- Tabela de usuários
CREATE TABLE usuarios (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nome NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) UNIQUE NOT NULL,
    senha NVARCHAR(255) NOT NULL,
    tipo_usuario NVARCHAR(20) NOT NULL CHECK (tipo_usuario IN ('aluno', 'professor', 'administrador')),
    cpf NVARCHAR(14),
    telefone NVARCHAR(20),
    area_ensino NVARCHAR(255),
    formacao NVARCHAR(255),
    experiencia NVARCHAR(100),
    disciplina NVARCHAR(100),
    escola NVARCHAR(255),
    documento_url NVARCHAR(500),
    status_verificacao NVARCHAR(20) DEFAULT 'pendente' CHECK (status_verificacao IN ('pendente', 'aprovado', 'rejeitado')),
    status NVARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
    data_criacao DATETIME2 DEFAULT GETDATE(),
    data_atualizacao DATETIME2 DEFAULT GETDATE()
);

-- Tabela de documentos de verificação
CREATE TABLE documentos_verificacao (
    id INT IDENTITY(1,1) PRIMARY KEY,
    usuario_id INT NOT NULL,
    nome_arquivo NVARCHAR(255) NOT NULL,
    caminho_arquivo NVARCHAR(500) NOT NULL,
    tipo_documento NVARCHAR(50) NOT NULL,
    data_upload DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabela de atividades
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
    FOREIGN KEY (professor_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabela de videoaulas
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
    FOREIGN KEY (professor_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabela de materiais
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
    FOREIGN KEY (professor_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabela de progresso dos alunos nas atividades
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
    FOREIGN KEY (aluno_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (atividade_id) REFERENCES atividades(id) ON DELETE CASCADE,
    CONSTRAINT unique_aluno_atividade UNIQUE (aluno_id, atividade_id)
);

-- Tabela de progresso dos alunos nas videoaulas
CREATE TABLE progresso_videoaulas (
    id INT IDENTITY(1,1) PRIMARY KEY,
    aluno_id INT NOT NULL,
    videoaula_id INT NOT NULL,
    status NVARCHAR(20) DEFAULT 'nao_assistida' CHECK (status IN ('nao_assistida', 'em_andamento', 'concluida')),
    tempo_assistido INT DEFAULT 0,
    data_inicio DATETIME2,
    data_conclusao DATETIME2,
    data_atualizacao DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (aluno_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (videoaula_id) REFERENCES videoaulas(id) ON DELETE CASCADE,
    CONSTRAINT unique_aluno_videoaula UNIQUE (aluno_id, videoaula_id)
);

-- Tabela de downloads de materiais
CREATE TABLE downloads_materiais (
    id INT IDENTITY(1,1) PRIMARY KEY,
    aluno_id INT NOT NULL,
    material_id INT NOT NULL,
    data_download DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (aluno_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (material_id) REFERENCES materiais(id) ON DELETE CASCADE
);

-- Tabela de configurações do sistema
CREATE TABLE configuracoes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    chave NVARCHAR(100) UNIQUE NOT NULL,
    valor NTEXT,
    descricao NTEXT,
    data_atualizacao DATETIME2 DEFAULT GETDATE()
);

-- =============================================
-- TRIGGERS PARA ATUALIZAÇÃO AUTOMÁTICA
-- =============================================

-- Trigger para atualizar data_atualizacao na tabela usuarios
CREATE TRIGGER tr_usuarios_update
ON usuarios
AFTER UPDATE
AS
BEGIN
    UPDATE usuarios 
    SET data_atualizacao = GETDATE()
    FROM usuarios u
    INNER JOIN inserted i ON u.id = i.id;
END;
GO

-- Trigger para atualizar data_atualizacao na tabela atividades
CREATE TRIGGER tr_atividades_update
ON atividades
AFTER UPDATE
AS
BEGIN
    UPDATE atividades 
    SET data_atualizacao = GETDATE()
    FROM atividades a
    INNER JOIN inserted i ON a.id = i.id;
END;
GO

-- Trigger para atualizar data_atualizacao na tabela videoaulas
CREATE TRIGGER tr_videoaulas_update
ON videoaulas
AFTER UPDATE
AS
BEGIN
    UPDATE videoaulas 
    SET data_atualizacao = GETDATE()
    FROM videoaulas v
    INNER JOIN inserted i ON v.id = i.id;
END;
GO

-- Trigger para atualizar data_atualizacao na tabela materiais
CREATE TRIGGER tr_materiais_update
ON materiais
AFTER UPDATE
AS
BEGIN
    UPDATE materiais 
    SET data_atualizacao = GETDATE()
    FROM materiais m
    INNER JOIN inserted i ON m.id = i.id;
END;
GO

-- =============================================
-- ÍNDICES PARA PERFORMANCE
-- =============================================

CREATE INDEX IX_usuarios_email ON usuarios(email);
CREATE INDEX IX_usuarios_tipo ON usuarios(tipo_usuario);
CREATE INDEX IX_usuarios_status ON usuarios(status_verificacao);
CREATE INDEX IX_atividades_professor ON atividades(professor_id);
CREATE INDEX IX_atividades_area ON atividades(area);
CREATE INDEX IX_videoaulas_professor ON videoaulas(professor_id);
CREATE INDEX IX_videoaulas_area ON videoaulas(area);
CREATE INDEX IX_materiais_professor ON materiais(professor_id);
CREATE INDEX IX_materiais_area ON materiais(area);

-- =============================================
-- DADOS INICIAIS
-- =============================================

-- Inserir administradores padrão
INSERT INTO usuarios (nome, email, senha, tipo_usuario, status_verificacao, status) VALUES 
('Isabelly Pereira', 'pereiraisabelly585@gmail.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'administrador', 'aprovado', 'ativo'),
('Administrador 2', 'jusf.2909@gmail.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'administrador', 'aprovado', 'ativo');

-- Inserir configurações padrão
INSERT INTO configuracoes (chave, valor, descricao) VALUES 
('nome_site', 'LearnWave - Português', 'Nome do site'),
('descricao_site', 'Plataforma de ensino de Língua Portuguesa', 'Descrição do site'),
('permitir_cadastro_alunos', 'true', 'Permitir auto-cadastro de alunos'),
('permitir_cadastro_professores', 'true', 'Permitir auto-cadastro de professores'),
('versao_sistema', '1.0.0', 'Versão atual do sistema');

-- =============================================
-- VIEWS ÚTEIS
-- =============================================

-- View para estatísticas gerais
CREATE VIEW vw_estatisticas_gerais AS
SELECT 
    (SELECT COUNT(*) FROM usuarios WHERE tipo_usuario = 'aluno' AND status = 'ativo') AS total_alunos,
    (SELECT COUNT(*) FROM usuarios WHERE tipo_usuario = 'professor' AND status_verificacao = 'aprovado') AS total_professores,
    (SELECT COUNT(*) FROM usuarios WHERE tipo_usuario = 'professor' AND status_verificacao = 'pendente') AS professores_pendentes,
    (SELECT COUNT(*) FROM atividades WHERE status = 'publicada') AS total_atividades,
    (SELECT COUNT(*) FROM videoaulas WHERE status = 'publicada') AS total_videoaulas,
    (SELECT COUNT(*) FROM materiais WHERE status = 'publicado') AS total_materiais;
GO

-- View para professores com conteúdo
CREATE VIEW vw_professores_conteudo AS
SELECT 
    u.id,
    u.nome,
    u.email,
    u.area_ensino,
    u.formacao,
    COUNT(DISTINCT a.id) AS total_atividades,
    COUNT(DISTINCT v.id) AS total_videoaulas,
    COUNT(DISTINCT m.id) AS total_materiais
FROM usuarios u
LEFT JOIN atividades a ON u.id = a.professor_id AND a.status = 'publicada'
LEFT JOIN videoaulas v ON u.id = v.professor_id AND v.status = 'publicada'
LEFT JOIN materiais m ON u.id = m.professor_id AND m.status = 'publicado'
WHERE u.tipo_usuario = 'professor' AND u.status_verificacao = 'aprovado'
GROUP BY u.id, u.nome, u.email, u.area_ensino, u.formacao;
GO

-- =============================================
-- PROCEDURES ÚTEIS
-- =============================================

-- Procedure para aprovar professor
CREATE PROCEDURE sp_aprovar_professor
    @professor_id INT
AS
BEGIN
    UPDATE usuarios 
    SET status_verificacao = 'aprovado', 
        status = 'ativo',
        data_atualizacao = GETDATE()
    WHERE id = @professor_id AND tipo_usuario = 'professor';
END;
GO

-- Procedure para rejeitar professor
CREATE PROCEDURE sp_rejeitar_professor
    @professor_id INT
AS
BEGIN
    UPDATE usuarios 
    SET status_verificacao = 'rejeitado',
        data_atualizacao = GETDATE()
    WHERE id = @professor_id AND tipo_usuario = 'professor';
END;
GO

-- =============================================
-- SCRIPT CONCLUÍDO
-- =============================================

PRINT 'Banco de dados LearnWave criado com sucesso!';
PRINT 'Administradores padrão criados:';
PRINT '- pereiraisabelly585@gmail.com (senha: admin123)';
PRINT '- jusf.2909@gmail.com (senha: admin123)';