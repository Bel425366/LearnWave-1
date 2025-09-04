package com.learnwave.model;

import java.time.LocalDateTime;

public class ProgressoVideoaula {
    private Integer id;
    private Integer alunoId;
    private Integer videoaulaId;
    private String status;
    private Integer tempoAssistido;
    private LocalDateTime dataInicio;
    private LocalDateTime dataConclusao;
    private LocalDateTime dataAtualizacao;
    
    // Relacionamentos
    private Usuario aluno;
    private Videoaula videoaula;
    
    public ProgressoVideoaula() {}
    
    public ProgressoVideoaula(Integer alunoId, Integer videoaulaId) {
        this.alunoId = alunoId;
        this.videoaulaId = videoaulaId;
        this.status = "nao_assistida";
        this.tempoAssistido = 0;
        this.dataAtualizacao = LocalDateTime.now();
    }
    
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public Integer getAlunoId() { return alunoId; }
    public void setAlunoId(Integer alunoId) { this.alunoId = alunoId; }
    
    public Integer getVideoaulaId() { return videoaulaId; }
    public void setVideoaulaId(Integer videoaulaId) { this.videoaulaId = videoaulaId; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public Integer getTempoAssistido() { return tempoAssistido; }
    public void setTempoAssistido(Integer tempoAssistido) { this.tempoAssistido = tempoAssistido; }
    
    public LocalDateTime getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDateTime dataInicio) { this.dataInicio = dataInicio; }
    
    public LocalDateTime getDataConclusao() { return dataConclusao; }
    public void setDataConclusao(LocalDateTime dataConclusao) { this.dataConclusao = dataConclusao; }
    
    public LocalDateTime getDataAtualizacao() { return dataAtualizacao; }
    public void setDataAtualizacao(LocalDateTime dataAtualizacao) { this.dataAtualizacao = dataAtualizacao; }
    
    public Usuario getAluno() { return aluno; }
    public void setAluno(Usuario aluno) { this.aluno = aluno; }
    
    public Videoaula getVideoaula() { return videoaula; }
    public void setVideoaula(Videoaula videoaula) { this.videoaula = videoaula; }
}