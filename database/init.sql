CREATE DATABASE drcs_db;
USE drcs_db;

CREATE TABLE admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);
-- 1. Locations Table (1NF, 2NF, 3NF applied)
CREATE TABLE locations (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    district VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    risk_level ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL
);

-- 2. Disasters Table (Foreign Key linking to Locations)
CREATE TABLE disasters (
    disaster_id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(100) NOT NULL,
    date_occurred DATE NOT NULL,
    severity ENUM('Minor', 'Moderate', 'Severe', 'Catastrophic'),
    location_id INT,
    FOREIGN KEY (location_id) REFERENCES locations(location_id) ON DELETE CASCADE
);

-- 3. Relief Camps Table
CREATE TABLE relief_camps (
    camp_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    capacity INT CHECK (capacity > 0),
    location_id INT,
    FOREIGN KEY (location_id) REFERENCES locations(location_id) ON DELETE SET NULL
);

-- 4. Inventory Table (Resource Management)
CREATE TABLE inventory (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    quantity INT DEFAULT 0 CHECK (quantity >= 0),
    camp_id INT,
    FOREIGN KEY (camp_id) REFERENCES relief_camps(camp_id) ON DELETE CASCADE
);

-- 5. Volunteers Table
CREATE TABLE volunteers (
    volunteer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    assigned_camp_id INT,
    FOREIGN KEY (assigned_camp_id) REFERENCES relief_camps(camp_id) ON DELETE SET NULL
);

INSERT INTO locations (district, city, risk_level) VALUES 
('Peshawar', 'Peshawar City', 'High'),
('Nowshera', 'Nowshera Cantt', 'Critical'),
('Charsadda', 'Charsadda City', 'Medium');

INSERT INTO relief_camps (name, capacity, location_id) VALUES 
('UET Main Relief Camp', 500, 1),
('Nowshera Flood Center', 1000, 2),
('Charsadda Medical Point', 250, 3);

INSERT INTO disasters (type, date_occurred, severity, location_id) VALUES 
('Flash Flood', '2026-03-15', 'Severe', 2);

-- Add the new column to hold the disaster ID
ALTER TABLE volunteers ADD COLUMN assigned_disaster_id INT;
describe volunteers;
-- Make it a Foreign Key linking to the disasters table
ALTER TABLE volunteers ADD FOREIGN KEY (assigned_disaster_id) REFERENCES disasters(disaster_id) ON DELETE SET NULL;



-- DUMMY DATA FOR TESTING

-- Part A: Safely clear out old test data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE volunteers;
TRUNCATE TABLE relief_camps;
TRUNCATE TABLE disasters;
TRUNCATE TABLE locations;
SET FOREIGN_KEY_CHECKS = 1;

-- Part B: Insert Locations (Fixed Risk Levels!)
INSERT INTO locations (district, city, risk_level) VALUES
('Peshawar', 'Peshawar City', 'High'),
('Nowshera', 'Nowshera Cantt', 'Critical'),
('Charsadda', 'Charsadda City', 'High'),
('Swat', 'Mingora', 'Medium'), 
('Mardan', 'Mardan City', 'Medium');

-- Part C: Insert Active Disasters
INSERT INTO disasters (type, date_occurred, severity, location_id) VALUES
('Flash Flood', '2026-03-20', 'Severe', 2),    
('Earthquake', '2026-03-22', 'Moderate', 4),  
('Urban Flooding', '2026-03-24', 'Severe', 1); 

-- Part D: Insert Relief Camps
INSERT INTO relief_camps (name, capacity, location_id) VALUES
('Nowshera Main Rescue Tent', 1500, 2),
('Peshawar University Relief Center', 800, 1),
('Charsadda Medical Point', 300, 3),
('Mingora High School Camp', 500, 4);

-- Part E: Insert Volunteers 
INSERT INTO volunteers (name, phone, assigned_camp_id, assigned_disaster_id) VALUES
('Ahmad Hassan', '0300-1112233', 1, 1), 
('Fatima Bibi', '0333-4445566', 2, 3),  
('Zain Khan', '0311-9998877', 1, 1),    
('Omar Tariq', '0345-6667788', 4, 2),   
('Ayesha Gul', '0301-2223344', 3, NULL),
('Bilal Safi', '0312-5556677', NULL, 3);