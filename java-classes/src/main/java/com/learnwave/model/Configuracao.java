package com.learnwave.model;

import java.time.LocalDateTime;

public class Configuracao {
    private Integer id;
    private String chave;
    private String valor;
    private String descricao;
    private LocalDateTime dataAtualizacao;
    
    public Configuracao() {}
    
    public Configuracao(String chave, String valor, String descricao) {
        this.chave = chave;
        this.valor = valor;
        this.descricao = descricao;
        this.dataAtualizacao = LocalDateTime.now();
    }
    
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public String getChave() { return chave; }
    public void setChave(String chave) { this.chave = chave; }
    
    public String getValor() { return valor; }
    public void setValor(String valor) { this.valor = valor; }
    
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    
    public LocalDateTime getDataAtualizacao() { return dataAtualizacao; }
    public void setDataAtualizacao(LocalDateTime dataAtualizacao) { this.dataAtualizacao = dataAtualizacao; }
}