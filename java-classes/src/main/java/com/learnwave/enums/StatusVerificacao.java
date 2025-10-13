package com.learnwave.enums;

public enum StatusVerificacao {
    PENDENTE("PENDENTE"),
    APROVADO("APROVADO"),
    REJEITADO("REJEITADO"),
    pendente("pendente"),
    aprovado("aprovado"),
    rejeitado("rejeitado");
    
    private final String valor;
    
    StatusVerificacao(String valor) {
        this.valor = valor;
    }
    
    public String getValor() {
        return valor;
    }
}