package com.learnwave.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProgressoAtividade {
    private Integer id;
    private Integer alunoId;
    private Integer atividadeId;
    private String status;
    private BigDecimal nota;
    private Integer tentativas;
    private LocalDateTime dataInicio;
    private LocalDateTime dataConclusao;
    private LocalDateTime dataAtualizacao;
    
    // Relacionamentos
    private Usuario aluno;
    private Atividade atividade;
    
    public ProgressoAtividade() {}
    
    public ProgressoAtividade(Integer alunoId, Integer atividadeId) {
        this.alunoId = alunoId;
        this.atividadeId = atividadeId;
        this.status = "nao_iniciada";
        this.tentativas = 0;
        this.dataAtualizacao = LocalDateTime.now();
    }
    
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public Integer getAlunoId() { return alunoId; }
    public void setAlunoId(Integer alunoId) { this.alunoId = alunoId; }
    
    public Integer getAtividadeId() { return atividadeId; }
    public void setAtividadeId(Integer atividadeId) { this.atividadeId = atividadeId; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public BigDecimal getNota() { return nota; }
    public void setNota(BigDecimal nota) { this.nota = nota; }
    
    public Integer getTentativas() { return tentativas; }
    public void setTentativas(Integer tentativas) { this.tentativas = tentativas; }
    
    public LocalDateTime getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDateTime dataInicio) { this.dataInicio = dataInicio; }
    
    public LocalDateTime getDataConclusao() { return dataConclusao; }
    public void setDataConclusao(LocalDateTime dataConclusao) { this.dataConclusao = dataConclusao; }
    
    public LocalDateTime getDataAtualizacao() { return dataAtualizacao; }
    public void setDataAtualizacao(LocalDateTime dataAtualizacao) { this.dataAtualizacao = dataAtualizacao; }
    
    public Usuario getAluno() { return aluno; }
    public void setAluno(Usuario aluno) { this.aluno = aluno; }
    
    public Atividade getAtividade() { return atividade; }
    public void setAtividade(Atividade atividade) { this.atividade = atividade; }
}