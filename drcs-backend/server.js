require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const app = express();

app.use(express.json());

// 1. Initialize the App
app.use(cors({
    origin: [
        'https://disaster-management-hoo2.vercel.app',// Vercel Cloud Frontend
        'http://localhost:5173',                              // Local Docker Frontend
        'http://localhost:3000'                               // Fallback local port
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Connect to MySQL Database
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ==========================================
//                 API ROUTES
// ==========================================

// --- GET: Dashboard Statistics ---
app.get('/api/dashboard/stats', async (req, res) => {
    try {
        const [disasters] = await pool.query('SELECT COUNT(*) AS activeDisasters FROM disasters');
        const [camps] = await pool.query('SELECT COUNT(*) AS totalCamps FROM relief_camps');
        const [volunteers] = await pool.query('SELECT COUNT(*) AS activeVolunteers FROM volunteers');
        res.json({
            activeDisasters: disasters[0].activeDisasters,
            totalCamps: camps[0].totalCamps,
            volunteersActive: volunteers[0].activeVolunteers
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database query failed' });
    }
});

// --- GET: Fetch Data for Dropdowns & Lists ---

// 1. Fetch Locations
app.get('/api/locations', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT location_id, district, city FROM locations');
        res.json(rows);
    } catch (error) { 
        res.status(500).json({ error: 'Failed to fetch locations' }); 
    }
});

// 2. Fetch Disasters
app.get('/api/disasters', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT disaster_id, type, severity FROM disasters');
        res.json(rows);
    } catch (error) { 
        res.status(500).json({ error: 'Failed to fetch disasters' }); 
    }
});

// 3. Fetch Camps (Includes a JOIN to get the city name from the locations table)
app.get('/api/camps', async (req, res) => {
    try {
        const query = `
            SELECT c.camp_id, c.name, c.capacity, l.city 
            FROM relief_camps c
            LEFT JOIN locations l ON c.location_id = l.location_id
        `;
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch camps' });
    }
});

// --- POST: Add New Data ---

// 1. Add a new Disaster
app.post('/api/disasters', async (req, res) => {
    const { type, date_occurred, severity, location_id } = req.body;
    try {
        const query = 'INSERT INTO disasters (type, date_occurred, severity, location_id) VALUES (?, ?, ?, ?)';
        await pool.query(query, [type, date_occurred, severity, location_id]);
        res.status(201).json({ message: 'Disaster logged successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add disaster.' });
    }
});

// 2. Add a new Volunteer
app.post('/api/volunteers', async (req, res) => {
    const { name, phone, assigned_camp_id, assigned_disaster_id } = req.body;
    try {
        const query = 'INSERT INTO volunteers (name, phone, assigned_camp_id, assigned_disaster_id) VALUES (?, ?, ?, ?)';
        await pool.query(query, [name, phone, assigned_camp_id, assigned_disaster_id || null]);
        res.status(201).json({ message: 'Volunteer added successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add volunteer.' });
    }
});

// 3. Add a new Relief Camp
app.post('/api/camps', async (req, res) => {
    const { name, capacity, location_id } = req.body;
    try {
        const query = 'INSERT INTO relief_camps (name, capacity, location_id) VALUES (?, ?, ?)';
        await pool.query(query, [name, capacity, location_id]);
        res.status(201).json({ message: 'Camp added successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add camp.' });
    }
});

// --- POST: Admin Authentication ---

// 1. Admin Signup
app.post('/api/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const query = 'INSERT INTO admins (username, password) VALUES (?, ?)';
        await pool.query(query, [username, password]);
        res.status(201).json({ message: 'Admin account created successfully!' });
    } catch (error) {
        // Error 1062 is MySQL's code for a duplicate unique key (username already exists)
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'Username already exists. Please choose another.' });
        } else {
            res.status(500).json({ error: 'Failed to create account.' });
        }
    }
});

// 2. Admin Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM admins WHERE username = ? AND password = ?', [username, password]);
        
        if (rows.length > 0) {
            res.json({ message: 'Login successful', admin: { username: rows[0].username } });
        } else {
            res.status(401).json({ error: 'Invalid username or password.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error during login.' });
    }
});

// --- DELETE: Remove Data ---

// 1. Delete a Relief Camp
app.delete('/api/camps/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM relief_camps WHERE camp_id = ?', [id]);
        res.json({ message: 'Camp deleted successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete camp.' });
    }
});
// ==========================================
//        COMPLEX INVENTORY ROUTES (M:N)
// ==========================================

// 1. Fetch available resource types
app.get('/api/resources', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM resources');
        res.json(rows);
    } catch (error) { res.status(500).json({ error: 'Failed to fetch resources' }); }
});

// 2. Fetch inventory for a specific camp (Using SQL JOINs)
app.get('/api/inventory/:camp_id', async (req, res) => {
    try {
        const query = `
            SELECT r.name, r.category, r.unit, ci.quantity, ci.last_updated
            FROM camp_inventory ci
            JOIN resources r ON ci.resource_id = r.resource_id
            WHERE ci.camp_id = ?
        `;
        const [rows] = await pool.query(query, [req.params.camp_id]);
        res.json(rows);
    } catch (error) { res.status(500).json({ error: 'Failed to fetch inventory' }); }
});

// 3. Add or Update Inventory (Using "UPSERT" logic)
app.post('/api/inventory', async (req, res) => {
    const { camp_id, resource_id, quantity } = req.body;
    try {
        // This is complex SQL: If the item exists, add to the quantity. If not, insert it!
        const query = `
            INSERT INTO camp_inventory (camp_id, resource_id, quantity)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE quantity = quantity + ?
        `;
        await pool.query(query, [camp_id, resource_id, quantity, quantity]);
        res.status(200).json({ message: 'Inventory updated successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update inventory' });
    }
});

// --- GET: System Audit Logs ---
app.get('/api/logs', async (req, res) => {
    try {
        // Fetch the 50 most recent logs, sorted by newest first
        const [rows] = await pool.query('SELECT * FROM system_logs ORDER BY action_time DESC LIMIT 50');
        res.json(rows);
    } catch (error) { 
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch audit logs' }); 
    }
});

// ==========================================
//               START SERVER
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`DRCS Server running on port ${PORT}`);
});