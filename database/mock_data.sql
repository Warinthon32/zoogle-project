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
-- Admin
INSERT INTO Staff (Name, Surname, Nickname, Role, Username, Password, Phone, Sex, Salary, BirthDate, CAID)
SELECT 
    'Natthaphon', 'Srisuk', 'Ton', 'Admin', 'natthaphon', 'n4tthap0n@dm1n', '0812345678', 'm', 75000.00, '1990-07-15',
    ca.CAID
FROM Cage ca WHERE ZID = 1 LIMIT 1;

-- Veterinary Staff
INSERT INTO Staff (Name, Surname, Nickname, Role, Username, Password, Phone, Sex, Salary, BirthDate, CAID)
SELECT 
    'Siriporn', 'Chaiyarat', 'Porn', 'Veterinary Staff', 'siriporn', 's1r1p0rn_v3t', '0823456789', 'f', 68000.00, '1995-11-02',
    ca.CAID
FROM Cage ca WHERE ZID = 1 LIMIT 1;

-- Zookeeper
INSERT INTO Staff (Name, Surname, Nickname, Role, Username, Password, Phone, Sex, Salary, BirthDate, CAID)
SELECT 
    'Kittiphat', 'Wongsri', 'Kit', 'Zookeeper', 'kittiphat', 'k1tt1ph4t_z00', '0834567890', 'm', 52000.00, '1998-04-20',
    ca.CAID
FROM Cage ca WHERE ZID = 1 LIMIT 1;

-- Zookeeper (คนที่ 2 ตามโจทย์เดิม)
INSERT INTO Staff (Name, Surname, Nickname, Role, Username, Password, Phone, Sex, Salary, BirthDate, CAID)
SELECT 
    'Warinthorn', 'Milligan', 'Biome', 'Zookeeper', 'warinthorn', 'wxr1nth0npa22w0r4', '0889886666', 'm', 59000.00, '2006-03-28',
    ca.CAID
FROM Cage ca WHERE ZID = 1 LIMIT 1;


-- ==========================================
-- ข้อมูลสัตว์ตัวอย่าง
-- ==========================================

-- ------------------------------------------
-- Mammalia
-- ------------------------------------------

-- 1. Snow Leopard
INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT 'Snow Leopard','Panthera uncia','Elusive mountain predator with thick spotted fur','f','2019-03-22',1,'Mammalia','Found in mountain ranges of Central and South Asia', c.CID, ca.CAID
FROM Category c, Cage ca, Zone z
WHERE c.CName='Mammals' AND z.ZName='Mountain Zone' AND ca.ZID=z.ZID;

-- 2. Bengal Tiger
INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT 'Bengal Tiger','Panthera tigris tigris','Largest wild cat species, powerful solitary hunter with striped coat','m','2019-11-25',2,'Mammalia','Native to the Indian subcontinent, endangered apex predator', c.CID, ca.CAID
FROM Category c, Cage ca, Zone z
WHERE c.CName='Mammals' AND z.ZName='Tropical Zone' AND ca.ZID=z.ZID;

-- 3. Jaguar
INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT 'Jaguar','Panthera onca','Strongest big cat in the Americas, apex predator with rosette-patterned coat','m','2018-12-09',2,'Mammalia','Found across Central and South America, near threatened species', c.CID, ca.CAID
FROM Category c, Cage ca, Zone z
WHERE c.CName='Mammals' AND z.ZName='Tropical Zone' AND ca.ZID=z.ZID;

-- 4. Cheetah
INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT 'Cheetah','Acinonyx jubatus','Fastest land animal, capable of reaching 112 km/h in short bursts','f','2021-05-20',3,'Mammalia','Native to Africa and parts of Iran, vulnerable species', c.CID, ca.CAID
FROM Category c, Cage ca, Zone z
WHERE c.CName='Mammals' AND z.ZName='Savanna Zone' AND ca.ZID=z.ZID;

-- 5. Capybara
INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT 'Capybara','Hydrochoerus hydrochaeris','World largest rodent, highly social and semi-aquatic','f','2021-09-03',5,'Mammalia','Native to South America, lives in groups near water bodies', c.CID, ca.CAID
FROM Category c, Cage ca, Zone z
WHERE c.CName='Mammals' AND z.ZName='Savanna Zone' AND ca.ZID=z.ZID;

-- 6. Wolverine
INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT 'Wolverine','Gulo gulo','Fierce solitary land predator with immense strength for its size','m','2020-04-17',1,'Mammalia','Inhabits boreal forests and Arctic tundra of the Northern Hemisphere', c.CID, ca.CAID
FROM Category c, Cage ca, Zone z
WHERE c.CName='Mammals' AND z.ZName='Arctic Zone' AND ca.ZID=z.ZID;

-- ------------------------------------------
-- Reptilia
-- ------------------------------------------

-- 7. Komodo Dragon
INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT 'Komodo Dragon','Varanus komodoensis','Largest living lizard with toxic saliva','m','2017-08-05',2,'Reptilia','Endemic to Indonesian islands, powerful ambush predator', c.CID, ca.CAID
FROM Category c, Cage ca, Zone z
WHERE c.CName='Reptiles' AND z.ZName='Tropical Zone' AND ca.ZID=z.ZID;

-- ------------------------------------------
-- Amphibia
-- ------------------------------------------

-- 8. Axolotl
INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT 'Axolotl','Ambystoma mexicanum','Aquatic salamander with remarkable regeneration ability','f','2022-11-18',4,'Amphibia','Native to Lake Xochimilco in Mexico, critically endangered', c.CID, ca.CAID
FROM Category c, Cage ca, Zone z
WHERE c.CName='Amphibians' AND z.ZName='Aquatic Zone' AND ca.ZID=z.ZID;

-- ------------------------------------------
-- Aves
-- ------------------------------------------

-- 9. Harpy Eagle
INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT 'Harpy Eagle','Harpia harpyja','Apex aerial predator of the Amazon rainforest','f','2020-02-14',1,'Aves','One of the largest and most powerful eagles in the world', c.CID, ca.CAID
FROM Category c, Cage ca, Zone z
WHERE c.CName='Birds' AND z.ZName='Tropical Zone' AND ca.ZID=z.ZID;

-- ------------------------------------------
-- Fish
-- ------------------------------------------

-- 10. Manta Ray
INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT 'Manta Ray','Mobula birostris','Largest ray species, filter feeder in open ocean','f','2018-07-30',1,'Fish','Circumglobal in tropical and subtropical waters', c.CID, ca.CAID
FROM Category c, Cage ca, Zone z
WHERE c.CName='Fish' AND z.ZName='Aquatic Zone' AND ca.ZID=z.ZID;

-- ------------------------------------------
-- Cephalopoda
-- ------------------------------------------

-- 11. Blue-ringed Octopus
INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT 'Blue-ringed Octopus','Hapalochlaena lunulata','Small but highly venomous marine predator','m','2023-06-10',2,'Cephalopoda','Inhabits tide pools and coral reefs of the Pacific Ocean', c.CID, ca.CAID
FROM Category c, Cage ca, Zone z
WHERE c.CName='Marine Invertebrates' AND z.ZName='Aquatic Zone' AND ca.ZID=z.ZID;

-- ------------------------------------------
-- Mythical
-- ------------------------------------------

-- 12. Phoenix
INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT 'Phoenix','Avis immortalis','Immortal firebird reborn from its own ashes','m','0001-01-01',1,'Mythical','Sacred fire bird of ancient Greek and Egyptian mythology', c.CID, ca.CAID
FROM Category c, Cage ca, Zone z
WHERE c.CName='Mythical Creatures' AND z.ZName='Mythical Zone' AND ca.ZID=z.ZID;

-- 13. Kirin
INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT 'Kirin','Qilin benevolentus','Chimeric beast symbolizing prosperity and good omen','m','0001-01-01',1,'Mythical','Auspicious creature in Chinese, Japanese and Korean mythology', c.CID, ca.CAID
FROM Category c, Cage ca, Zone z
WHERE c.CName='Mythical Creatures' AND z.ZName='Mythical Zone' AND ca.ZID=z.ZID;

-- 14. Kraken
INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT 'Kraken','Cephalopodus giganteus','Colossal sea monster capable of sinking ships','m','0001-01-01',1,'Mythical','Legendary sea monster of Scandinavian folklore', c.CID, ca.CAID
FROM Category c, Cage ca, Zone z
WHERE c.CName='Mythical Creatures' AND z.ZName='Mythical Zone' AND ca.ZID=z.ZID;

-- 15. Pegasus
INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT 'Pegasus','Equus alatus','Winged divine horse born from sea foam','m','0001-01-01',1,'Mythical','Divine winged stallion of Greek mythology, symbol of wisdom', c.CID, ca.CAID
FROM Category c, Cage ca, Zone z
WHERE c.CName='Mythical Creatures' AND z.ZName='Mythical Zone' AND ca.ZID=z.ZID;

-- 16. Unicorn
INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT 'Unicorn','Equus monocerus','Graceful horse with a single spiraling horn, symbol of purity and magic','f','0001-01-01',1,'Mythical','Legendary creature of European folklore, symbol of grace and purity', c.CID, ca.CAID
FROM Category c, Cage ca, Zone z
WHERE c.CName='Mythical Creatures' AND z.ZName='Mythical Zone' AND ca.ZID=z.ZID;

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