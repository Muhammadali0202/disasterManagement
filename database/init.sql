CREATE DATABASE IF NOT EXISTS drcs_db;
USE drcs_db;

-- 1. Admins Table
CREATE TABLE IF NOT EXISTS admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- 2. Locations Table
CREATE TABLE IF NOT EXISTS locations (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    district VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    risk_level ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL
);

-- 3. Disasters Table
CREATE TABLE IF NOT EXISTS disasters (
    disaster_id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(100) NOT NULL,
    date_occurred DATE NOT NULL,
    severity ENUM('Minor', 'Moderate', 'Severe', 'Catastrophic'),
    location_id INT,
    FOREIGN KEY (location_id) REFERENCES locations(location_id) ON DELETE CASCADE
);

-- 4. Relief Camps Table
CREATE TABLE IF NOT EXISTS relief_camps (
    camp_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    capacity INT CHECK (capacity > 0),
    location_id INT,
    FOREIGN KEY (location_id) REFERENCES locations(location_id) ON DELETE SET NULL
);

-- 5. Volunteers Table
CREATE TABLE IF NOT EXISTS volunteers (
    volunteer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    assigned_camp_id INT,
    assigned_disaster_id INT,
    FOREIGN KEY (assigned_camp_id) REFERENCES relief_camps(camp_id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_disaster_id) REFERENCES disasters(disaster_id) ON DELETE SET NULL
);

-- ==========================================
-- COMPLEX FEATURES (M:N & Triggers)
-- ==========================================

-- 6. Complex Inventory Module (M:N)
CREATE TABLE IF NOT EXISTS resources (
    resource_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    category VARCHAR(50),
    unit VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS camp_inventory (
    camp_id INT,
    resource_id INT,
    quantity INT,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (camp_id, resource_id),
    FOREIGN KEY (camp_id) REFERENCES relief_camps(camp_id) ON DELETE CASCADE,
    FOREIGN KEY (resource_id) REFERENCES resources(resource_id) ON DELETE CASCADE
);

-- 7. Audit Log Table & Trigger
CREATE TABLE IF NOT EXISTS system_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    action_type VARCHAR(20),
    table_affected VARCHAR(50),
    record_details TEXT,
    action_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DELIMITER //
CREATE TRIGGER after_camp_delete
AFTER DELETE ON relief_camps
FOR EACH ROW
BEGIN
    INSERT INTO system_logs (action_type, table_affected, record_details)
    VALUES ('DELETE', 'relief_camps', CONCAT('Camp Deleted: ', OLD.name, ' (Capacity: ', OLD.capacity, ')'));
END; //
DELIMITER ;

-- ==========================================
-- DUMMY DATA FOR TESTING
-- ==========================================

INSERT INTO locations (district, city, risk_level) VALUES
('Peshawar', 'Peshawar City', 'High'),
('Nowshera', 'Nowshera Cantt', 'Critical'),
('Charsadda', 'Charsadda City', 'High'),
('Swat', 'Mingora', 'Medium'), 
('Mardan', 'Mardan City', 'Medium');

INSERT INTO disasters (type, date_occurred, severity, location_id) VALUES
('Flash Flood', '2026-03-20', 'Severe', 2),    
('Earthquake', '2026-03-22', 'Moderate', 4),  
('Urban Flooding', '2026-03-24', 'Severe', 1); 

INSERT INTO relief_camps (name, capacity, location_id) VALUES
('Nowshera Main Rescue Tent', 1500, 2),
('Peshawar University Relief Center', 800, 1),
('Charsadda Medical Point', 300, 3),
('Mingora High School Camp', 500, 4);

INSERT INTO volunteers (name, phone, assigned_camp_id, assigned_disaster_id) VALUES
('Ahmad Hassan', '0300-1112233', 1, 1), 
('Fatima Bibi', '0333-4445566', 2, 3),  
('Zain Khan', '0311-9998877', 1, 1),    
('Omar Tariq', '0345-6667788', 4, 2),   
('Ayesha Gul', '0301-2223344', 3, NULL),
('Bilal Safi', '0312-5556677', NULL, 3);

INSERT INTO resources (name, category, unit) VALUES
('Bottled Water', 'Food/Water', 'Liters'),
('First Aid Kits', 'Medical', 'Boxes'),
('Thermal Blankets', 'Shelter', 'Units');