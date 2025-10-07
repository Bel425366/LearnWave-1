package com.learnwave.enums;

public enum TipoUsuario {
    ALUNO("aluno"),
    PROFESSOR("professor"),
    ADMINISTRADOR("administrador"),
    ADMIN("admin");
    
    private final String valor;
    
    TipoUsuario(String valor) {
        this.valor = valor;
    }
    
    public String getValor() {
        return valor;
    }
}