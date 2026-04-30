package com.zoogle.models;

import java.time.LocalDate;

public class Animal {
    private Integer AnimalId;
    private String AnimalName;
    private String ScienceName;
    private String BiologyCharacter;
    private String AnimalSex;
    private LocalDate BirthDate;
    private Integer Quantity;
    private String AnimalClass;
    private String AnimalDescription;
    private Integer CategoryId;
    private Integer ParentId;
    private Integer CageId;

    public Animal() {
    }

    public Integer getAnimalId() { return AnimalId; }
    public void setAnimalId(Integer AnimalId) { this.AnimalId = AnimalId; }

    public String getAnimalName() { return AnimalName; }
    public void setAnimalName(String AnimalName) { this.AnimalName = AnimalName; }

    public String getScienceName() { return ScienceName; }
    public void setScienceName(String ScienceName) { this.ScienceName = ScienceName; }

    public String getBiologyCharacter() { return BiologyCharacter; }
    public void setBiologyCharacter(String BiologyCharacter) { this.BiologyCharacter = BiologyCharacter; }

    public String getAnimalSex() { return AnimalSex; }
    public void setAnimalSex(String AnimalSex) { this.AnimalSex = AnimalSex; }

    public LocalDate getBirthDate() { return BirthDate; }
    public void setBirthDate(LocalDate BirthDate) { this.BirthDate = BirthDate; }

    public Integer getQuantity() { return Quantity; }
    public void setQuantity(Integer Quantity) { this.Quantity = Quantity; }

    public String getAnimalClass() { return AnimalClass; }
    public void setAnimalClass(String AnimalClass) { this.AnimalClass = AnimalClass; }

    public String getAnimalDescription() { return AnimalDescription; }
    public void setAnimalDescription(String AnimalDescription) { this.AnimalDescription = AnimalDescription; }

    public Integer getCategoryId() { return CategoryId; }
    public void setCategoryId(Integer CategoryId) { this.CategoryId = CategoryId; }

    public Integer getParentId() { return ParentId; }
    public void setParentId(Integer ParentId) { this.ParentId = ParentId; }

    public Integer getCageId() { return CageId; }
    public void setCageId(Integer CageId) { this.CageId = CageId; }
}
