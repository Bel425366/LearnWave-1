package com.learnwave.model;

import java.time.LocalDateTime;

public class DownloadMaterial {
    private Integer id;
    private Integer alunoId;
    private Integer materialId;
    private LocalDateTime dataDownload;
    
    // Relacionamentos
    private Usuario aluno;
    private Material material;
    
    public DownloadMaterial() {}
    
    public DownloadMaterial(Integer alunoId, Integer materialId) {
        this.alunoId = alunoId;
        this.materialId = materialId;
        this.dataDownload = LocalDateTime.now();
    }
    
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public Integer getAlunoId() { return alunoId; }
    public void setAlunoId(Integer alunoId) { this.alunoId = alunoId; }
    
    public Integer getMaterialId() { return materialId; }
    public void setMaterialId(Integer materialId) { this.materialId = materialId; }
    
    public LocalDateTime getDataDownload() { return dataDownload; }
    public void setDataDownload(LocalDateTime dataDownload) { this.dataDownload = dataDownload; }
    
    public Usuario getAluno() { return aluno; }
    public void setAluno(Usuario aluno) { this.aluno = aluno; }
    
    public Material getMaterial() { return material; }
    public void setMaterial(Material material) { this.material = material; }
}