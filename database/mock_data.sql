USE ZoogleDB;
GO

-- ข้อมูลหมวดหมู่และโซน
INSERT INTO Category (CName, Class, Description) VALUES 
('Mammals', 'general', 'General mammals'),
('Mythical Creatures', 'mythical', 'Mythological creatures');

INSERT INTO Diet (DietType, Description) VALUES 
('Herbivore', 'Plants and fruits'),
('Omnivore', 'Both plants and meat');

INSERT INTO Zone (ZName, Theme, Weather) VALUES 
('Rainforest', 'Normal', 'Humid'),
('Savanna', 'Normal', 'Warm');

-- ข้อมูลกรงและพนักงาน (มีการ Hashed Password เพื่อความปลอดภัย)
INSERT INTO Cage (DangerousLevel, ZID) VALUES (1, 1), (4, 2);

INSERT INTO Staff (Name, Surname, Nickname, Role, Username, Password, Phone, Sex, Salary, BirthDate, CAID) VALUES 
('Warinthorn', 'Milligan', 'Biome', 'Zookeeper', 'warinthorn', 'wxr1nth0npa22w0r4', '0889886666', 'm', 59000.00, '2006-03-28', 1);

-- ข้อมูลสัตว์ตัวอย่าง
INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID) VALUES 
('Moodeng', 'Choeropsis liberiensis', 'Pygmy hippo, chubby and bouncy', 'f', '2024-07-10', 1, 'Mammalia', 'Zoo superstar', 1, 1),
('Koko', 'Pan troglodytes', 'Loves eating bananas and playing with toys', 'm', '2020-05-12', 2, 'Mammalia', 'Smart chimpanzee', 1, 2);

-- ข้อมูลความสัมพันธ์อื่นๆ
INSERT INTO Consumes (DID, AID) VALUES (1, 1), (2, 2);
