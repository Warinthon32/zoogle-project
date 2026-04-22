USE ZoogleDB;
GO

-- ==========================================
-- สร้างตารางทั้งหมด (Tables)
-- ==========================================
CREATE TABLE Category (
    CID INT IDENTITY(1,1) PRIMARY KEY,
    CName VARCHAR(100) NOT NULL,
    Class VARCHAR(50),
    Description TEXT
);
GO

CREATE TABLE Diet (
    DID INT IDENTITY(1,1) PRIMARY KEY,
    DietType VARCHAR(100) NOT NULL,
    Description TEXT
);
GO

CREATE TABLE Zone (
    ZID INT IDENTITY(1,1) PRIMARY KEY,
    ZName VARCHAR(100) NOT NULL,
    Theme VARCHAR(100),
    Weather VARCHAR(50)
);
GO

CREATE TABLE Cage (
    CAID INT IDENTITY(1,1) PRIMARY KEY,
    DangerousLevel INT,
    ZID INT,
    FOREIGN KEY (ZID) REFERENCES Zone(ZID)
);
GO

CREATE TABLE Staff (
    SID INT IDENTITY(1,1) PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Surname VARCHAR(100) NOT NULL,
    Nickname VARCHAR(50),
    Role VARCHAR(50),
    Username VARCHAR(50) UNIQUE,
    Password VARCHAR(255),
    Phone VARCHAR(10),
    Sex CHAR(1),
    Salary FLOAT,
    BirthDate DATE,
    CAID INT,
    FOREIGN KEY (CAID) REFERENCES Cage(CAID)
);
GO

CREATE TABLE ContactPerson (
    CName VARCHAR(100) NOT NULL,
    CSurname VARCHAR(100) NOT NULL,
    SID INT,
    CPhone VARCHAR(10),
    Relation VARCHAR(50),
    PRIMARY KEY (CName, CSurname),
    FOREIGN KEY (SID) REFERENCES Staff(SID)
);
GO

CREATE TABLE Animal (
    AID INT IDENTITY(1,1) PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    SciName VARCHAR(100),
    BioCharacter TEXT,
    Sex CHAR(1),
    BirthDate DATE,
    Quantity INT,
    Class VARCHAR(100),
    Description TEXT,
    CID INT,
    ParentID INT,
    CAID INT,
    FOREIGN KEY (CID) REFERENCES Category(CID),
    FOREIGN KEY (ParentID) REFERENCES Animal(AID),
    FOREIGN KEY (CAID) REFERENCES Cage(CAID)
);
GO

CREATE TABLE Consumes (
    DID INT,
    AID INT,
    PRIMARY KEY (DID, AID),
    FOREIGN KEY (DID) REFERENCES Diet(DID),
    FOREIGN KEY (AID) REFERENCES Animal(AID)
);
GO

CREATE TABLE Gallery (
    MID INT IDENTITY(1,1) PRIMARY KEY,
    MediaType VARCHAR(100)
);
GO

CREATE TABLE MediaURL (
    MID INT,
    MediaURL TEXT,
    FOREIGN KEY (MID) REFERENCES Gallery(MID)
);
GO

CREATE TABLE Has_Media (
    MID INT,
    AID INT,
    UploadDate DATETIME,
    PRIMARY KEY (MID, AID),
    FOREIGN KEY (MID) REFERENCES Gallery(MID),
    FOREIGN KEY (AID) REFERENCES Animal(AID)
);
GO

CREATE TABLE HealthRecord (
    HID INT IDENTITY(1,1) PRIMARY KEY,
    CheckupDate DATE,
    Status VARCHAR(50),
    Notes TEXT,
    SID INT,
    FOREIGN KEY (SID) REFERENCES Staff(SID)
);
GO

CREATE TABLE Has_Record (
    HID INT,
    AID INT,
    PRIMARY KEY (HID, AID),
    FOREIGN KEY (HID) REFERENCES HealthRecord(HID),
    FOREIGN KEY (AID) REFERENCES Animal(AID)
);
GO

CREATE TABLE Event (
    EID INT IDENTITY(1,1) PRIMARY KEY,
    ShowName VARCHAR(150),
    ShowTime TIME,
    ShowDate DATE,
    ZID INT,
    FOREIGN KEY (ZID) REFERENCES Zone(ZID)
);
GO

CREATE TABLE Participates (
    EID INT,
    AID INT,
    PRIMARY KEY (EID, AID),
    FOREIGN KEY (EID) REFERENCES Event(EID),
    FOREIGN KEY (AID) REFERENCES Animal(AID)
);
GO

-- ==========================================
-- สร้าง Stored Procedures (Functions)
-- ==========================================
CREATE PROCEDURE sp_get_animal_detail @p_aid INT AS
BEGIN
    SELECT a.*, c.CName AS CategoryName, z.ZName AS ZoneName, ca.DangerousLevel
    FROM Animal a
    LEFT JOIN Category c ON a.CID = c.CID
    LEFT JOIN Cage ca ON a.CAID = ca.CAID
    LEFT JOIN Zone z ON ca.ZID = z.ZID
    WHERE a.AID = @p_aid;
END;
GO

CREATE PROCEDURE sp_search_animals @p_keyword VARCHAR(255) AS
BEGIN
    SELECT a.AID, a.Name, a.SciName, a.Class, a.Description, c.CName AS CategoryName, z.ZName AS ZoneName
    FROM Animal a
    LEFT JOIN Category c ON a.CID = c.CID
    LEFT JOIN Cage ca ON a.CAID = ca.CAID
    LEFT JOIN Zone z ON ca.ZID = z.ZID
    WHERE a.Name LIKE CONCAT('%', @p_keyword, '%')
       OR a.SciName LIKE CONCAT('%', @p_keyword, '%')
       OR a.BioCharacter LIKE CONCAT('%', @p_keyword, '%')
       OR c.CName LIKE CONCAT('%', @p_keyword, '%');
END;
GO

-- เพิ่มสัตว์
CREATE PROCEDURE sp_add_animal
    @name VARCHAR(100),
    @cid INT,
    @quantity INT
AS
BEGIN
    INSERT INTO Animal(Name, CID, Quantity)
    VALUES (@name, @cid, @quantity);
END;
GO

-- ลบสัตว์
CREATE PROCEDURE sp_delete_animal
    @aid INT
AS
BEGIN
    DELETE FROM Animal WHERE AID = @aid;
END;
GO


-- ==========================================
-- Additional Database Features
-- ==========================================


-- ==========================================
-- VIEW
-- ==========================================
-- รวมข้อมูลสัตว์ทำให้เรียกใช้งานง่าย 
-- ใช้กับหน้า Animal List, Animal Detail, Zoo Map ได้
-- ลดการเขียน JOIN ซ้ำและทำให้ query สั้นลง

CREATE VIEW vw_animal_full_info AS
SELECT 
    a.AID,
    a.Name,
    a.SciName,
    a.Quantity,
    c.CName AS Category,
    z.ZName AS Zone,
    ca.DangerousLevel
FROM Animal a
LEFT JOIN Category c ON a.CID = c.CID
LEFT JOIN Cage ca ON a.CAID = ca.CAID
LEFT JOIN Zone z ON ca.ZID = z.ZID;



-- ==========================================
-- TRIGGER
-- ==========================================
-- ป้องกันไม่ให้จำนวนสัตว์เป็นค่าติดลบ
-- ใช้ในหน้า Admin (Add, Edit Animal)

CREATE TRIGGER trg_check_animal_quantity
ON Animal
AFTER INSERT, UPDATE
AS
BEGIN
    IF EXISTS (SELECT * FROM inserted WHERE Quantity < 0)
    BEGIN
        RAISERROR ('Quantity cannot be negative', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;



-- ==========================================
-- CONSTRAINT
-- ==========================================
-- ควบคุมความถูกต้องของข้อมูล

ALTER TABLE Staff
ADD CONSTRAINT chk_salary_positive
CHECK (Salary >= 0);

ALTER TABLE Animal
ADD CONSTRAINT chk_animal_sex
CHECK (Sex IN ('m','f','o'));



-- ==========================================
-- INDEX
-- ==========================================
-- ทำให้ค้นหาได้ดีขึ้น (Search, Login)

CREATE INDEX idx_animal_name ON Animal(Name);
CREATE INDEX idx_staff_username ON Staff(Username);
