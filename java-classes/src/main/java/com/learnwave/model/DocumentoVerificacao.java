package com.learnwave.model;

import java.time.LocalDateTime;

public class DocumentoVerificacao {
    private Integer id;
    private Integer usuarioId;
    private String nomeArquivo;
    private String caminhoArquivo;
    private String tipoDocumento;
    private LocalDateTime dataUpload;
    
    // Relacionamento
    private Usuario usuario;
    
    public DocumentoVerificacao() {}
    
    public DocumentoVerificacao(Integer usuarioId, String nomeArquivo, String caminhoArquivo, String tipoDocumento) {
        this.usuarioId = usuarioId;
        this.nomeArquivo = nomeArquivo;
        this.caminhoArquivo = caminhoArquivo;
        this.tipoDocumento = tipoDocumento;
        this.dataUpload = LocalDateTime.now();
    }
    
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public Integer getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Integer usuarioId) { this.usuarioId = usuarioId; }
    
    public String getNomeArquivo() { return nomeArquivo; }
    public void setNomeArquivo(String nomeArquivo) { this.nomeArquivo = nomeArquivo; }
    
    public String getCaminhoArquivo() { return caminhoArquivo; }
    public void setCaminhoArquivo(String caminhoArquivo) { this.caminhoArquivo = caminhoArquivo; }
    
    public String getTipoDocumento() { return tipoDocumento; }
    public void setTipoDocumento(String tipoDocumento) { this.tipoDocumento = tipoDocumento; }
    
    public LocalDateTime getDataUpload() { return dataUpload; }
    public void setDataUpload(LocalDateTime dataUpload) { this.dataUpload = dataUpload; }
    
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
}