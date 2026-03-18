const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// Create MySQL Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// --- API ROUTES ---

// GET: Dashboard Statistics
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

// GET: Inventory with Camp Names (Using INNER JOIN)
app.get('/api/inventory', async (req, res) => {
    try {
        const query = `
            SELECT i.item_id, i.category, i.quantity, c.name AS camp_name 
            FROM inventory i
            INNER JOIN relief_camps c ON i.camp_id = c.camp_id
        `;
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch inventory' });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`DRCS Server running on port ${PORT}`);
});