-- 🚀 QUICK DATABASE SETUP - COPY & PASTE THIS ENTIRE SCRIPT
-- Run this in your MySQL interface to populate users table

-- Step 1: Update schema to support 'owner' role
ALTER TABLE users 
MODIFY COLUMN role ENUM('owner', 'admin', 'manager', 'mechanic', 'staff', 'customer') DEFAULT 'customer';

-- Step 2: Clear existing data
DELETE FROM users;
ALTER TABLE users AUTO_INCREMENT = 1;

-- Step 3: Insert all 16 users
INSERT INTO users (username, email, password, full_name, role) VALUES
-- 👑 OWNER (1 user)
('owner', 'owner@mitragarage.com', 'b3duZXIxMjM=', 'Bengkel Owner', 'owner'),

-- 🔧 ADMIN LEVEL (3 users)
('admin', 'admin@mitragarage.com', 'YWRtaW4xMjM=', 'Administrator', 'admin'),
('manager', 'manager@mitragarage.com', 'bWFuYWdlcjEyMw==', 'Manager Bengkel', 'admin'),
('supervisor', 'supervisor@mitragarage.com', 'c3VwZXJ2aXNvcjEyMw==', 'Supervisor Bengkel', 'admin'),

-- 👨‍🔧 MECHANICS (4 users)
('mechanic1', 'mechanic1@mitragarage.com', 'bWVjaGFuaWMxMjM=', 'Joko Susilo', 'mechanic'),
('mechanic2', 'mechanic2@mitragarage.com', 'bWVjaGFuaWMxMjM=', 'Ahmad Fauzi', 'mechanic'),
('joko', 'joko@mitragarage.com', 'am9rbzEyMw==', 'Joko Susilo', 'mechanic'),
('ahmad', 'ahmad@mitragarage.com', 'YWhtYWQxMjM=', 'Ahmad Fauzi', 'mechanic'),

-- 👨‍💼 STAFF (3 users)
('staff1', 'staff1@mitragarage.com', 'c3RhZmYxMjM=', 'Bambang Sutopo', 'staff'),
('staff2', 'staff2@mitragarage.com', 'c3RhZmYxMjM=', 'Siti Nurhaliza', 'staff'),
('staff', 'staff@mitragarage.com', 'c3RhZmYxMjM=', 'Staff Bengkel', 'staff'),

-- 👤 CUSTOMERS (5 users)
('customer1', 'customer1@gmail.com', 'Y3VzdG9tZXIxMjM=', 'John Doe', 'customer'),
('customer2', 'customer2@gmail.com', 'Y3VzdG9tZXIxMjM=', 'Jane Smith', 'customer'),
('customer3', 'customer3@gmail.com', 'Y3VzdG9tZXIxMjM=', 'Robert Johnson', 'customer'),
('customer4', 'customer4@gmail.com', 'Y3VzdG9tZXIxMjM=', 'Maria Garcia', 'customer');

-- Step 4: Verify results
SELECT '✅ SUCCESS: Users inserted!' as status;
SELECT id, username, email, full_name, role FROM users ORDER BY role, username;
SELECT role, COUNT(*) as count FROM users GROUP BY role ORDER BY role;

-- 🔑 LOGIN CREDENTIALS:
-- 👑 owner / owner123 (8 menus + User Management + Reports)
-- 🔧 admin / admin123 (6 menus)
-- 📊 manager / manager123 (6 menus) 
-- 👨‍💼 supervisor / supervisor123 (6 menus)
-- 👨‍🔧 mechanic1 / mechanic123 (5 menus)
-- 👨‍💼 staff1 / staff123 (5 menus)
-- 👤 customer1 / customer123 (4 menus)
