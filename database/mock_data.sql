USE ZoogleDB;
GO

-- 0. ล้างข้อมูลเก่า (เผื่อกรณีคนรันซ้ำโดยไม่ลบ DB)
DELETE FROM Participates; DELETE FROM Event; DELETE FROM Consumes;
DELETE FROM Animal; DELETE FROM Staff; DELETE FROM Cage;
DELETE FROM Zone; DELETE FROM Diet; DELETE FROM Category;
GO

-- 1. ข้อมูลหมวดหมู่ (เพิ่มบ้านให้ครบ)
INSERT INTO Category (CName, Class, Description) VALUES 
('Mammals', 'general', 'Warm-blooded animals'),
('Birds', 'general', 'Animals with feathers'),
('Reptiles', 'general', 'Cold-blooded animals with scales'),
('Amphibians', 'general', 'Live both in water and on land'),
('Aquatic Animals', 'general', 'Live in water'),
('Fish', 'general', 'Aquatic animals with gills'),
('Marine Invertebrates', 'general', 'No backbone aquatic animals'),
('Fantasy Beasts', 'mythical', 'Magical creatures'),
('Legendary Creatures', 'mythical', 'Famous from myths'),
('Mythical Creatures', 'mythical', 'Creatures from legends');

-- 2. ข้อมูลอาหาร
INSERT INTO Diet (DietType, Description) VALUES 
('Herbivore', 'Plant-based'), ('Carnivore', 'Meat-based'), ('Omnivore', 'Both');

-- 3. ข้อมูลโซน (เพิ่มโซนรองรับสัตว์ 16 ตัว)
INSERT INTO Zone (ZName, Theme, Weather) VALUES 
('Savanna Zone', 'Normal', 'Dry'), ('Arctic Zone', 'Normal', 'Cold'),
('Tropical Zone', 'Normal', 'Humid'), ('Aquatic Zone', 'Normal', 'Wet'),
('Bamboo Grove', 'Normal', 'Mild'), ('Mountain Zone', 'Normal', 'Cold'),
('Mythical Zone', 'Fantasy', 'Magic'), ('Ocean Realm', 'Normal', 'Wet');

-- 4. ข้อมูลกรง
INSERT INTO Cage (DangerousLevel, ZID) SELECT 3, ZID FROM Zone;

-- 5. ข้อมูลพนักงาน
INSERT INTO Staff (Name, Surname, Nickname, Role, Username, Password, Phone, Sex, Salary, BirthDate, CAID)
SELECT TOP(1) 'Natthaphon', 'Srisuk', 'Ton', 'Admin', 'natthaphon', 'pass123', '0812345678', 'm', 75000.00, '1990-07-15', CAID FROM Cage;

-- 6. ข้อมูลสัตว์ 16 ตัว (จับคู่ CID/CAID อัตโนมัติ)
INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT TOP(1) 'Snow Leopard','Panthera uncia','Mountain predator','f','2019-03-22',1,'Mammalia','Central Asia', c.CID, ca.CAID FROM Category c, Cage ca, Zone z WHERE c.CName='Mammals' AND z.ZName='Mountain Zone' AND ca.ZID=z.ZID;
INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT TOP(1) 'Bengal Tiger','Panthera tigris','Striped coat','m','2019-11-25',2,'Mammalia','India', c.CID, ca.CAID FROM Category c, Cage ca, Zone z WHERE c.CName='Mammals' AND z.ZName='Tropical Zone' AND ca.ZID=z.ZID;
INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT TOP(1) 'Jaguar','Panthera onca','Rosette coat','m','2018-12-09',2,'Mammalia','South America', c.CID, ca.CAID FROM Category c, Cage ca, Zone z WHERE c.CName='Mammals' AND z.ZName='Tropical Zone' AND ca.ZID=z.ZID;
INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT TOP(1) 'Cheetah','Acinonyx jubatus','Fastest land animal','f','2021-05-20',3,'Mammalia','Africa', c.CID, ca.CAID FROM Category c, Cage ca, Zone z WHERE c.CName='Mammals' AND z.ZName='Savanna Zone' AND ca.ZID=z.ZID;
INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT TOP(1) 'Capybara','Hydrochoerus','Social rodent','f','2021-09-03',5,'Mammalia','South America', c.CID, ca.CAID FROM Category c, Cage ca, Zone z WHERE c.CName='Mammals' AND z.ZName='Savanna Zone' AND ca.ZID=z.ZID;
INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT TOP(1) 'Wolverine','Gulo gulo','Fierce predator','m','2020-04-17',1,'Mammalia','Boreal forests', c.CID, ca.CAID FROM Category c, Cage ca, Zone z WHERE c.CName='Mammals' AND z.ZName='Arctic Zone' AND ca.ZID=z.ZID;
INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT TOP(1) 'Komodo Dragon','Varanus','Toxic saliva','m','2017-08-05',2,'Reptilia','Indonesia', c.CID, ca.CAID FROM Category c, Cage ca, Zone z WHERE c.CName='Reptiles' AND z.ZName='Tropical Zone' AND ca.ZID=z.ZID;
INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT TOP(1) 'Axolotl','Ambystoma','Aquatic salamander','f','2022-11-18',4,'Amphibia','Mexico', c.CID, ca.CAID FROM Category c, Cage ca, Zone z WHERE c.CName='Amphibians' AND z.ZName='Aquatic Zone' AND ca.ZID=z.ZID;
INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT TOP(1) 'Harpy Eagle','Harpia harpyja','Rainforest predator','f','2020-02-14',1,'Aves','Amazon', c.CID, ca.CAID FROM Category c, Cage ca, Zone z WHERE c.CName='Birds' AND z.ZName='Tropical Zone' AND ca.ZID=z.ZID;
INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT TOP(1) 'Manta Ray','Mobula','Filter feeder','f','2018-07-30',1,'Fish','Ocean', c.CID, ca.CAID FROM Category c, Cage ca, Zone z WHERE c.CName='Fish' AND z.ZName='Aquatic Zone' AND ca.ZID=z.ZID;
INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT TOP(1) 'Blue-ringed Octopus','Hapalochlaena','Venomous','m','2023-06-10',2,'Cephalopoda','Pacific', c.CID, ca.CAID FROM Category c, Cage ca, Zone z WHERE c.CName='Marine Invertebrates' AND z.ZName='Aquatic Zone' AND ca.ZID=z.ZID;
INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT TOP(1) 'Phoenix','Avis immortalis','Firebird','m','0001-01-01',1,'Mythical','Greece/Egypt', c.CID, ca.CAID FROM Category c, Cage ca, Zone z WHERE c.CName='Mythical Creatures' AND z.ZName='Mythical Zone' AND ca.ZID=z.ZID;
INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT TOP(1) 'Kirin','Qilin','Chimeric beast','m','0001-01-01',1,'Mythical','Asia', c.CID, ca.CAID FROM Category c, Cage ca, Zone z WHERE c.CName='Mythical Creatures' AND z.ZName='Mythical Zone' AND ca.ZID=z.ZID;
INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT TOP(1) 'Kraken','Giganteus','Sea monster','m','0001-01-01',1,'Mythical','Scandinavian', c.CID, ca.CAID FROM Category c, Cage ca, Zone z WHERE c.CName='Mythical Creatures' AND z.ZName='Mythical Zone' AND ca.ZID=z.ZID;
INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT TOP(1) 'Pegasus','Equus alatus','Winged horse','m','0001-01-01',1,'Mythical','Greek', c.CID, ca.CAID FROM Category c, Cage ca, Zone z WHERE c.CName='Mythical Creatures' AND z.ZName='Mythical Zone' AND ca.ZID=z.ZID;
INSERT INTO Animal (Name, SciName, BioCharacter, Sex, BirthDate, Quantity, Class, Description, CID, CAID)
SELECT TOP(1) 'Unicorn','Monocerus','Single horn','f','0001-01-01',1,'Mythical','European', c.CID, ca.CAID FROM Category c, Cage ca, Zone z WHERE c.CName='Mythical Creatures' AND z.ZName='Mythical Zone' AND ca.ZID=z.ZID;

-- 7. ความสัมพันธ์อาหาร/โชว์
INSERT INTO Consumes (DID, AID) SELECT d.DID, a.AID FROM Animal a, Diet d WHERE a.Name = 'Bengal Tiger' AND d.DietType = 'Carnivore';
INSERT INTO Event (ShowName, ShowTime, ShowDate, ZID) SELECT 'Big Cat Show','13:30:00','2026-10-04', ZID FROM Zone WHERE ZName='Tropical Zone';
INSERT INTO Participates (EID, AID) SELECT e.EID, a.AID FROM Event e, Animal a WHERE e.ShowName = 'Big Cat Show' AND a.Name = 'Bengal Tiger';
GO