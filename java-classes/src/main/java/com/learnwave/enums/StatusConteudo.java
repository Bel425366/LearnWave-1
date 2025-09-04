package com.learnwave.enums;

public enum StatusConteudo {
    RASCUNHO("rascunho"),
    PUBLICADA("publicada"),
    PUBLICADO("publicado"),
    ARQUIVADA("arquivada"),
    ARQUIVADO("arquivado");
    
    private final String valor;
    
    StatusConteudo(String valor) {
        this.valor = valor;
    }
    
    public String getValor() {
        return valor;
    }
}