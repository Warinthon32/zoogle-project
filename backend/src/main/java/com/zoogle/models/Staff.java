package com.zoogle.models;

import java.time.LocalDate;
import java.math.BigDecimal;

public class Staff {
    private Integer StaffId;
    private String FirstName;
    private String LastName;
    private String NickName;
    private String StaffRole;
    private String UserName;
    private String PassWord;
    private String PhoneNumber;
    private String StaffSex;
    private BigDecimal SalaryAmount;
    private LocalDate BirthDate;
    private Integer CageId;

    public Staff() {
    }

    public Integer getStaffId() { return StaffId; }
    public void setStaffId(Integer StaffId) { this.StaffId = StaffId; }

    public String getFirstName() { return FirstName; }
    public void setFirstName(String FirstName) { this.FirstName = FirstName; }

    public String getLastName() { return LastName; }
    public void setLastName(String LastName) { this.LastName = LastName; }

    public String getNickName() { return NickName; }
    public void setNickName(String NickName) { this.NickName = NickName; }

    public String getStaffRole() { return StaffRole; }
    public void setStaffRole(String StaffRole) { this.StaffRole = StaffRole; }

    public String getUserName() { return UserName; }
    public void setUserName(String UserName) { this.UserName = UserName; }

    public String getPassWord() { return PassWord; }
    public void setPassWord(String PassWord) { this.PassWord = PassWord; }

    public String getPhoneNumber() { return PhoneNumber; }
    public void setPhoneNumber(String PhoneNumber) { this.PhoneNumber = PhoneNumber; }

    public String getStaffSex() { return StaffSex; }
    public void setStaffSex(String StaffSex) { this.StaffSex = StaffSex; }

    public BigDecimal getSalaryAmount() { return SalaryAmount; }
    public void setSalaryAmount(BigDecimal SalaryAmount) { this.SalaryAmount = SalaryAmount; }

    public LocalDate getBirthDate() { return BirthDate; }
    public void setBirthDate(LocalDate BirthDate) { this.BirthDate = BirthDate; }

    public Integer getCageId() { return CageId; }
    public void setCageId(Integer CageId) { this.CageId = CageId; }
}
