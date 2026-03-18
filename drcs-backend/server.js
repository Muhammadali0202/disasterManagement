const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

// 1. Initialize the App
const app = express();
app.use(cors());
app.use(express.json()); // Allows the server to understand form data

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

// --- GET: Dropdown List of Camps ---
app.get('/api/camps', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT camp_id, name FROM relief_camps');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch camps' });
    }
});

// --- POST: Add a new Volunteer ---
app.post('/api/volunteers', async (req, res) => {
    const { name, phone, assigned_camp_id } = req.body;
    try {
        const query = 'INSERT INTO volunteers (name, phone, assigned_camp_id) VALUES (?, ?, ?)';
        await pool.query(query, [name, phone, assigned_camp_id]);
        res.status(201).json({ message: 'Volunteer added successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add volunteer. Phone might already exist.' });
    }
});

// ==========================================
//               START SERVER
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`DRCS Server running on port ${PORT}`);
});