
-- Update Database Users to Match Application
-- Run this script in MySQL to sync users

-- 1. Update schema to support 'owner' role
ALTER TABLE users 
MODIFY COLUMN role ENUM('owner', 'admin', 'manager', 'mechanic', 'staff', 'customer') DEFAULT 'customer';

-- 2. Clear existing users
DELETE FROM users;
ALTER TABLE users AUTO_INCREMENT = 1;

-- 3. Insert users (passwords are base64 encoded for simplicity)
INSERT INTO users (username, email, password, full_name, role) VALUES
-- Owner
('owner', 'owner@mitragarage.com', 'b3duZXIxMjM=', 'Bengkel Owner', 'owner'),

-- Admin level
('admin', 'admin@mitragarage.com', 'YWRtaW4xMjM=', 'Administrator', 'admin'),
('manager', 'manager@mitragarage.com', 'bWFuYWdlcjEyMw==', 'Manager Bengkel', 'admin'),
('supervisor', 'supervisor@mitragarage.com', 'c3VwZXJ2aXNvcjEyMw==', 'Supervisor Bengkel', 'admin'),

-- Mechanics
('mechanic1', 'mechanic1@mitragarage.com', 'bWVjaGFuaWMxMjM=', 'Joko Susilo', 'mechanic'),
('mechanic2', 'mechanic2@mitragarage.com', 'bWVjaGFuaWMxMjM=', 'Ahmad Fauzi', 'mechanic'),
('joko', 'joko@mitragarage.com', 'am9rbzEyMw==', 'Joko Susilo', 'mechanic'),
('ahmad', 'ahmad@mitragarage.com', 'YWhtYWQxMjM=', 'Ahmad Fauzi', 'mechanic'),

-- Staff
('staff1', 'staff1@mitragarage.com', 'c3RhZmYxMjM=', 'Bambang Sutopo', 'staff'),
('staff2', 'staff2@mitragarage.com', 'c3RhZmYxMjM=', 'Siti Nurhaliza', 'staff'),
('staff', 'staff@mitragarage.com', 'c3RhZmYxMjM=', 'Staff Bengkel', 'staff'),

-- Customers
('customer1', 'customer1@gmail.com', 'Y3VzdG9tZXIxMjM=', 'John Doe', 'customer'),
('customer2', 'customer2@gmail.com', 'Y3VzdG9tZXIxMjM=', 'Jane Smith', 'customer'),
('customer3', 'customer3@gmail.com', 'Y3VzdG9tZXIxMjM=', 'Robert Johnson', 'customer'),
('customer4', 'customer4@gmail.com', 'Y3VzdG9tZXIxMjM=', 'Maria Garcia', 'customer');

-- 4. Verify users
SELECT id, username, email, full_name, role FROM users ORDER BY role, username;

-- 5. Check user count by role
SELECT role, COUNT(*) as count FROM users GROUP BY role ORDER BY role;
