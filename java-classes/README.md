# Classes Java - LearnWave

## Estrutura das Classes

### Enums
- **TipoUsuario**: ALUNO, PROFESSOR, ADMINISTRADOR
- **StatusVerificacao**: PENDENTE, APROVADO, REJEITADO  
- **StatusConteudo**: RASCUNHO, PUBLICADA/PUBLICADO, ARQUIVADA/ARQUIVADO

### Classes Principais
1. **Usuario** - Classe principal para alunos, professores e administradores
2. **DocumentoVerificacao** - Documentos enviados pelos professores
3. **Atividade** - Atividades criadas pelos professores
4. **Videoaula** - Videoaulas criadas pelos professores
5. **Material** - Materiais para download
6. **ProgressoAtividade** - Progresso dos alunos nas atividades
7. **ProgressoVideoaula** - Progresso dos alunos nas videoaulas
8. **DownloadMaterial** - Registro de downloads de materiais
9. **Configuracao** - Configurações do sistema

## Relacionamentos
- Usuario 1:N DocumentoVerificacao
- Usuario 1:N Atividade (professor)
- Usuario 1:N Videoaula (professor)
- Usuario 1:N Material (professor)
- Usuario 1:N ProgressoAtividade (aluno)
- Usuario 1:N ProgressoVideoaula (aluno)
- Usuario 1:N DownloadMaterial (aluno)
- Atividade 1:N ProgressoAtividade
- Videoaula 1:N ProgressoVideoaula
- Material 1:N DownloadMaterial

## Para usar no IntelliJ
1. Importe a pasta `java-classes` como projeto Maven/Gradle
2. As classes estão no package `com.learnwave.model` e `com.learnwave.enums`
3. Use o diagrama de classes do IntelliJ: View → Tool Windows → Diagrams