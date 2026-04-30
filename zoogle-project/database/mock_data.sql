USE ZoogleDB;
GO

-- ==========================================
-- ข้อมูลหมวดหมู่
-- ==========================================
INSERT INTO Category (CName, Class, Description) VALUES 
('Mammals', 'general', 'Warm-blooded animals with hair or fur'),
('Birds', 'general', 'Animals with feathers and wings'),
('Reptiles', 'general', 'Cold-blooded animals with scales'),
('Amphibians', 'general', 'Animals that live both in water and on land'),
('Aquatic Animals', 'general', 'Animals that primarily live in water'),
('Insects', 'general', 'Small invertebrates with segmented bodies'),

-- สัตว์ในโลกจินตนาการไม่มีในตำนานจริง
('Fantasy Beasts', 'mythical', 'Magical creatures from fantasy worlds'),

-- สัตว์ที่มีในตำนานหรือวัฒนธรรม
('Legendary Creatures', 'mythical', 'Famous creatures from myths and legends');


-- ==========================================
-- ข้อมูลอาหาร
-- ==========================================
INSERT INTO Diet (DietType, Description) VALUES 
('Herbivore', 'Plant-based diet'),
('Carnivore', 'Meat-based diet'),
('Omnivore', 'Both plants and meat');


-- ==========================================
-- ข้อมูลโซน
-- ==========================================
INSERT INTO Zone (ZName, Theme, Weather) VALUES 
('Savanna Zone', 'Normal', 'Dry'),
('Arctic & Cold Zone', 'Normal', 'Cold'),
('Tropical Forest Zone', 'Normal', 'Humid'),
('Ocean Realm', 'Normal', 'Wet'),
('Rainforest Pavilion', 'Normal', 'Humid'),
('Bamboo Grove', 'Normal', 'Mild');


-- ==========================================
-- ข้อมูลกรง (มีการ Hashed Password เพื่อความปลอดภัย)
-- ==========================================
INSERT INTO Cage (DangerousLevel, ZID)
SELECT 3, ZID FROM Zone;


-- ==========================================
-- ข้อมูลพนักงาน
-- ==========================================
INSERT INTO Staff (Name, Surname, Nickname, Role, Username, Password, Phone, Sex, Salary, BirthDate, CAID)
SELECT 
    'Warinthorn', 'Milligan', 'Biome', 'Zookeeper','warinthorn', 'wxr1nth0npa22w0r4','0889886666', 'm', 59000.00, '2006-03-28',
    ca.CAID
FROM Cage ca WHERE ZID = 1;


-- ==========================================
-- ข้อมูลสัตว์ตัวอย่าง
-- ==========================================

-- Mammals (Savanna)
INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT 'African Lion','Panthera leo','Large social predator living in prides','m','2018-05-10',3,'Mammalia','Native to African savannas', c.CID, ca.CAID
FROM Category c, Cage ca, Zone z
WHERE c.CName='Mammals' AND z.ZName='Savanna Zone' AND ca.ZID=z.ZID;

INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT 'African Bush Elephant','Loxodonta africana','Largest land mammal with trunk','f','2015-03-12',2,'Mammalia','Found in sub-Saharan Africa', c.CID, ca.CAID
FROM Category c, Cage ca, Zone z
WHERE c.CName='Mammals' AND z.ZName='Savanna Zone' AND ca.ZID=z.ZID;

INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT 'Pygmy Hippopotamus','Choeropsis liberiensis','Small semi-aquatic hippo','f','2024-07-10',1,'Mammalia','West African forests', c.CID, ca.CAID
FROM Category c, Cage ca, Zone z
WHERE c.CName='Mammals' AND z.ZName='Savanna Zone' AND ca.ZID=z.ZID;

INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT 'Chimpanzee','Pan troglodytes','Highly intelligent primate','m','2020-05-12',2,'Mammalia','African forests', c.CID, ca.CAID
FROM Category c, Cage ca, Zone z
WHERE c.CName='Mammals' AND z.ZName='Savanna Zone' AND ca.ZID=z.ZID;


-- Birds (Arctic)
INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT 'Emperor Penguin','Aptenodytes forsteri','Largest penguin species','f','2020-03-15',10,'Aves','Antarctica', c.CID, ca.CAID
FROM Category c, Cage ca, Zone z
WHERE c.CName='Birds' AND z.ZName='Arctic & Cold Zone' AND ca.ZID=z.ZID;

INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT 'Golden Eagle','Aquila chrysaetos','Powerful bird of prey','m','2019-07-21',2,'Aves','Northern Hemisphere', c.CID, ca.CAID
FROM Category c, Cage ca, Zone z
WHERE c.CName='Birds' AND z.ZName='Arctic & Cold Zone' AND ca.ZID=z.ZID;


-- Reptiles (Tropical)
INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT 'Burmese Python','Python bivittatus','Large constrictor snake','m','2019-07-21',2,'Reptilia','Southeast Asia', c.CID, ca.CAID
FROM Category c, Cage ca, Zone z
WHERE c.CName='Reptiles' AND z.ZName='Tropical Forest Zone' AND ca.ZID=z.ZID;


-- Amphibians (Tropical)
INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT 'Frog','Rana temporaria','Amphibian with jumping ability','f','2021-06-01',5,'Amphibia','Near water habitats', c.CID, ca.CAID
FROM Category c, Cage ca, Zone z
WHERE c.CName='Amphibians' AND z.ZName='Tropical Forest Zone' AND ca.ZID=z.ZID;


-- Aquatic (Ocean)
INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT 'Great White Shark','Carcharodon carcharias','Ocean predator','m','2017-09-09',1,'Fish','Apex predator', c.CID, ca.CAID
FROM Category c, Cage ca, Zone z
WHERE c.CName='Aquatic Animals' AND z.ZName='Ocean Realm' AND ca.ZID=z.ZID;

INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT 'Southern Stingray','Dasyatis americana','Flat-bodied ray','f','2018-11-11',3,'Fish','Shallow waters', c.CID, ca.CAID
FROM Category c, Cage ca, Zone z
WHERE c.CName='Aquatic Animals' AND z.ZName='Ocean Realm' AND ca.ZID=z.ZID;


-- Insects (Rainforest)
INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT 'Monarch Butterfly','Danaus plexippus','Migratory butterfly','f','2022-04-01',20,'Insecta','Pollinator species', c.CID, ca.CAID
FROM Category c, Cage ca, Zone z
WHERE c.CName='Insects' AND z.ZName='Rainforest Pavilion' AND ca.ZID=z.ZID;


-- Fantasy Beasts (Bamboo)
INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT 'Celestial Unicorn','Equus unicornis','Magical horse','f','2022-01-01',1,'Mythical','Symbol of purity', c.CID, ca.CAID
FROM Category c, Cage ca, Zone z
WHERE c.CName='Fantasy Beasts' AND z.ZName='Bamboo Grove' AND ca.ZID=z.ZID;


-- Legendary Creatures (Bamboo)
INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT 'Eastern Dragon','Draco orientalis','Serpentine dragon','m','2020-10-10',1,'Mythical','Asian mythology', c.CID, ca.CAID
FROM Category c, Cage ca, Zone z
WHERE c.CName='Legendary Creatures' AND z.ZName='Bamboo Grove' AND ca.ZID=z.ZID;


-- ==========================================
-- ความสัมพันธ์อาหาร
-- ==========================================
-- Mammals
INSERT INTO Consumes (DID, AID)
SELECT d.DID, a.AID FROM Animal a, Diet d
WHERE a.Name = 'African Lion' AND d.DietType = 'Carnivore';

INSERT INTO Consumes (DID, AID)
SELECT d.DID, a.AID FROM Animal a, Diet d
WHERE a.Name = 'African Bush Elephant' AND d.DietType = 'Herbivore';

INSERT INTO Consumes (DID, AID)
SELECT d.DID, a.AID FROM Animal a, Diet d
WHERE a.Name = 'Pygmy Hippopotamus' AND d.DietType = 'Herbivore';

INSERT INTO Consumes (DID, AID)
SELECT d.DID, a.AID FROM Animal a, Diet d
WHERE a.Name = 'Chimpanzee' AND d.DietType = 'Omnivore';


-- Birds
INSERT INTO Consumes (DID, AID)
SELECT d.DID, a.AID FROM Animal a, Diet d
WHERE a.Name = 'Emperor Penguin' AND d.DietType = 'Carnivore';

INSERT INTO Consumes (DID, AID)
SELECT d.DID, a.AID FROM Animal a, Diet d
WHERE a.Name = 'Golden Eagle' AND d.DietType = 'Carnivore';


-- Reptiles
INSERT INTO Consumes (DID, AID)
SELECT d.DID, a.AID FROM Animal a, Diet d
WHERE a.Name = 'Burmese Python' AND d.DietType = 'Carnivore';


-- Amphibians
INSERT INTO Consumes (DID, AID)
SELECT d.DID, a.AID FROM Animal a, Diet d
WHERE a.Name = 'Frog' AND d.DietType = 'Carnivore';


-- Aquatic Animals
INSERT INTO Consumes (DID, AID)
SELECT d.DID, a.AID FROM Animal a, Diet d
WHERE a.Name = 'Great White Shark' AND d.DietType = 'Carnivore';

INSERT INTO Consumes (DID, AID)
SELECT d.DID, a.AID FROM Animal a, Diet d
WHERE a.Name = 'Southern Stingray' AND d.DietType = 'Carnivore';


-- Insects
INSERT INTO Consumes (DID, AID)
SELECT d.DID, a.AID FROM Animal a, Diet d
WHERE a.Name = 'Monarch Butterfly' AND d.DietType = 'Herbivore';


-- Fantasy Beasts
INSERT INTO Consumes (DID, AID)
SELECT d.DID, a.AID FROM Animal a, Diet d
WHERE a.Name = 'Celestial Unicorn' AND d.DietType = 'Herbivore';


-- Legendary Creatures
INSERT INTO Consumes (DID, AID)
SELECT d.DID, a.AID FROM Animal a, Diet d
WHERE a.Name = 'Eastern Dragon' AND d.DietType = 'Carnivore';


-- ==========================================
-- ข้อมูลโชว์สัตว์
-- ==========================================
INSERT INTO Event (ShowName, ShowTime, ShowDate, ZID)
SELECT 'Penguin Parade','13:30:00','2026-10-04', ZID
FROM Zone WHERE ZName='Arctic & Cold Zone';

INSERT INTO Event (ShowName, ShowTime, ShowDate, ZID)
SELECT 'Elephant Bath Time','14:00:00','2026-10-04', ZID
FROM Zone WHERE ZName='Savanna Zone';

INSERT INTO Event (ShowName, ShowTime, ShowDate, ZID)
SELECT 'Reptile Encounter','14:30:00','2026-10-04', ZID
FROM Zone WHERE ZName='Tropical Forest Zone';

-- ==========================================
-- ความสัมพันธ์โชว์
-- ==========================================

INSERT INTO Participates (EID, AID)
SELECT e.EID, a.AID
FROM Event e, Animal a
WHERE e.ShowName = 'Penguin Parade'
AND a.Name = 'Emperor Penguin';

INSERT INTO Participates (EID, AID)
SELECT e.EID, a.AID
FROM Event e, Animal a
WHERE e.ShowName = 'Elephant Bath Time'
AND a.Name = 'African Bush Elephant';

INSERT INTO Participates (EID, AID)
SELECT e.EID, a.AID
FROM Event e, Animal a
WHERE e.ShowName = 'Reptile Encounter'
AND a.Name = 'Burmese Python';