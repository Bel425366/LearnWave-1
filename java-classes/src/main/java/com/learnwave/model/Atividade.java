package com.learnwave.model;

import com.learnwave.enums.StatusConteudo;
import java.time.LocalDateTime;
import java.util.List;

public class Atividade {
    private Integer id;
    private String titulo;
    private String descricao;
    private String area;
    private Integer professorId;
    private String conteudo;
    private StatusConteudo status;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataAtualizacao;
    
    // Relacionamentos
    private Usuario professor;
    private List<ProgressoAtividade> progressos;
    
    public Atividade() {}
    
    public Atividade(String titulo, String descricao, String area, Integer professorId, String conteudo) {
        this.titulo = titulo;
        this.descricao = descricao;
        this.area = area;
        this.professorId = professorId;
        this.conteudo = conteudo;
        this.status = StatusConteudo.RASCUNHO;
        this.dataCriacao = LocalDateTime.now();
        this.dataAtualizacao = LocalDateTime.now();
    }
    
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    
    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }
    
    public Integer getProfessorId() { return professorId; }
    public void setProfessorId(Integer professorId) { this.professorId = professorId; }
    
    public String getConteudo() { return conteudo; }
    public void setConteudo(String conteudo) { this.conteudo = conteudo; }
    
    public StatusConteudo getStatus() { return status; }
    public void setStatus(StatusConteudo status) { this.status = status; }
    
    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }
    
    public LocalDateTime getDataAtualizacao() { return dataAtualizacao; }
    public void setDataAtualizacao(LocalDateTime dataAtualizacao) { this.dataAtualizacao = dataAtualizacao; }
    
    public Usuario getProfessor() { return professor; }
    public void setProfessor(Usuario professor) { this.professor = professor; }
    
    public List<ProgressoAtividade> getProgressos() { return progressos; }
    public void setProgressos(List<ProgressoAtividade> progressos) { this.progressos = progressos; }
}