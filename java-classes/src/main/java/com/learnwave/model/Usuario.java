package com.learnwave.model;

import com.learnwave.enums.TipoUsuario;
import com.learnwave.enums.StatusVerificacao;
import java.time.LocalDateTime;
import java.util.List;

public class Usuario {
    private Integer id;
    private String nome;
    private String email;
    private String senha;
    private TipoUsuario tipoUsuario;
    private String cpf;
    private String telefone;
    private String areaEnsino;
    private String formacao;
    private String experiencia;
    private String disciplina;
    private String escola;
    private String documentoUrl;
    private StatusVerificacao statusVerificacao;
    private String status;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataAtualizacao;
    
    // Relacionamentos
    private List<DocumentoVerificacao> documentos;
    private List<Atividade> atividades;
    private List<Videoaula> videoaulas;
    private List<Material> materiais;
    private List<ProgressoAtividade> progressoAtividades;
    private List<ProgressoVideoaula> progressoVideoaulas;
    private List<DownloadMaterial> downloads;
    
    // Construtores
    public Usuario() {}
    
    public Usuario(String nome, String email, String senha, TipoUsuario tipoUsuario) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.tipoUsuario = tipoUsuario;
        this.statusVerificacao = StatusVerificacao.PENDENTE;
        this.status = "ativo";
        this.dataCriacao = LocalDateTime.now();
        this.dataAtualizacao = LocalDateTime.now();
    }
    
    // Getters e Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
    
    public TipoUsuario getTipoUsuario() { return tipoUsuario; }
    public void setTipoUsuario(TipoUsuario tipoUsuario) { this.tipoUsuario = tipoUsuario; }
    
    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }
    
    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
    
    public String getAreaEnsino() { return areaEnsino; }
    public void setAreaEnsino(String areaEnsino) { this.areaEnsino = areaEnsino; }
    
    public String getFormacao() { return formacao; }
    public void setFormacao(String formacao) { this.formacao = formacao; }
    
    public String getExperiencia() { return experiencia; }
    public void setExperiencia(String experiencia) { this.experiencia = experiencia; }
    
    public String getDisciplina() { return disciplina; }
    public void setDisciplina(String disciplina) { this.disciplina = disciplina; }
    
    public String getEscola() { return escola; }
    public void setEscola(String escola) { this.escola = escola; }
    
    public String getDocumentoUrl() { return documentoUrl; }
    public void setDocumentoUrl(String documentoUrl) { this.documentoUrl = documentoUrl; }
    
    public StatusVerificacao getStatusVerificacao() { return statusVerificacao; }
    public void setStatusVerificacao(StatusVerificacao statusVerificacao) { this.statusVerificacao = statusVerificacao; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }
    
    public LocalDateTime getDataAtualizacao() { return dataAtualizacao; }
    public void setDataAtualizacao(LocalDateTime dataAtualizacao) { this.dataAtualizacao = dataAtualizacao; }
    
    public List<DocumentoVerificacao> getDocumentos() { return documentos; }
    public void setDocumentos(List<DocumentoVerificacao> documentos) { this.documentos = documentos; }
    
    public List<Atividade> getAtividades() { return atividades; }
    public void setAtividades(List<Atividade> atividades) { this.atividades = atividades; }
    
    public List<Videoaula> getVideoaulas() { return videoaulas; }
    public void setVideoaulas(List<Videoaula> videoaulas) { this.videoaulas = videoaulas; }
    
    public List<Material> getMateriais() { return materiais; }
    public void setMateriais(List<Material> materiais) { this.materiais = materiais; }
    
    public List<ProgressoAtividade> getProgressoAtividades() { return progressoAtividades; }
    public void setProgressoAtividades(List<ProgressoAtividade> progressoAtividades) { this.progressoAtividades = progressoAtividades; }
    
    public List<ProgressoVideoaula> getProgressoVideoaulas() { return progressoVideoaulas; }
    public void setProgressoVideoaulas(List<ProgressoVideoaula> progressoVideoaulas) { this.progressoVideoaulas = progressoVideoaulas; }
    
    public List<DownloadMaterial> getDownloads() { return downloads; }
    public void setDownloads(List<DownloadMaterial> downloads) { this.downloads = downloads; }
}