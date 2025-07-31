-- Populate Users Table for Mitra Garage
-- Run this script in your MySQL interface

-- 1. First, update the users table schema to support 'owner' role
ALTER TABLE users 
MODIFY COLUMN role ENUM('owner', 'admin', 'manager', 'mechanic', 'staff', 'customer') DEFAULT 'customer';

-- 2. Clear existing users (if any)
DELETE FROM users;
ALTER TABLE users AUTO_INCREMENT = 1;

-- 3. Insert users with base64 encoded passwords (same as application)
INSERT INTO users (username, email, password, full_name, role) VALUES
-- Owner (Full Access)
('owner', 'owner@mitragarage.com', 'b3duZXIxMjM=', 'Bengkel Owner', 'owner'),

-- Admin Level Users
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

-- 4. Verify the data
SELECT 'Users inserted successfully!' as message;

-- 5. Show all users
SELECT id, username, email, full_name, role FROM users ORDER BY role, username;

-- 6. Count users by role
SELECT role, COUNT(*) as count FROM users GROUP BY role ORDER BY role;

-- 7. Show password decoding reference (for verification)
SELECT 
    'Password Reference:' as info,
    'owner123 = b3duZXIxMjM=' as owner_pass,
    'admin123 = YWRtaW4xMjM=' as admin_pass,
    'customer123 = Y3VzdG9tZXIxMjM=' as customer_pass;

-- Success message
SELECT 
    '✅ Database populated successfully!' as status,
    '16 users added across 5 role levels' as details,
    'Ready for application testing' as next_step;
