package com.learnwave.enums;

public enum StatusVerificacao {
    PENDENTE("pendente"),
    APROVADO("aprovado"),
    REJEITADO("rejeitado");
    
    private final String valor;
    
    StatusVerificacao(String valor) {
        this.valor = valor;
    }
    
    public String getValor() {
        return valor;
    }
}