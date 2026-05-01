USE ZoogleDB;
GO

-- ==========================================
-- 1. ตรวจสอบข้อมูลพื้นฐาน (หมวดหมู่, อาหาร, โซน)
-- ==========================================
PRINT '--- Category Data ---';
SELECT * FROM Category;

PRINT '--- Diet Data ---';
SELECT * FROM Diet;

PRINT '--- Zone Data ---';
SELECT * FROM Zone;

-- ==========================================
-- 2. ตรวจสอบพนักงานและกรง
-- ==========================================
PRINT '--- Staff & Their Assigned Cages ---';
SELECT s.SID, s.Name, s.Nickname, s.Role, c.CAID, z.ZName
FROM Staff s
LEFT JOIN Cage c ON s.CAID = c.CAID
LEFT JOIN Zone z ON c.ZID = z.ZID;

-- ==========================================
-- 3. ตรวจสอบสัตว์ 16 ตัว และตำแหน่งที่อยู่ (เช็ค AID เรียง 1-16)
-- ==========================================
PRINT '--- All 16 Animals with Category and Zone ---';
SELECT 
    a.AID, 
    a.Name AS Animal_Name, 
    a.SciName, 
    c.CName AS Category, 
    z.ZName AS Zone_Location,
    a.Quantity
FROM Animal a
JOIN Category c ON a.CID = c.CID
JOIN Cage cg ON a.CAID = cg.CAID
JOIN Zone z ON cg.ZID = z.ZID
ORDER BY a.AID ASC;

-- ==========================================
-- 4. ตรวจสอบการกินอาหาร (Consumes)
-- ==========================================
PRINT '--- Animal Diets (Who eats what) ---';
SELECT a.Name AS Animal, d.DietType, d.Description
FROM Consumes cs
JOIN Animal a ON cs.AID = a.AID
JOIN Diet d ON cs.DID = d.DID;

-- ==========================================
-- 5. ตรวจสอบตารางกิจกรรมและโชว์สัตว์
-- ==========================================
PRINT '--- Zoo Events & Participating Animals ---';
SELECT e.ShowName, e.ShowTime, a.Name AS Performer, z.ZName AS Location
FROM Participates p
JOIN Event e ON p.EID = e.EID
JOIN Animal a ON p.AID = a.AID
JOIN Zone z ON e.ZID = z.ZID;

-- ==========================================
-- 6. สรุปภาพรวมจำนวนข้อมูล
-- ==========================================
PRINT '--- Summary Count ---';
SELECT 
    (SELECT COUNT(*) FROM Animal) AS Total_Animals,
    (SELECT COUNT(*) FROM Staff) AS Total_Staff,
    (SELECT COUNT(*) FROM Zone) AS Total_Zones,
    (SELECT COUNT(*) FROM Event) AS Total_Events;
GO