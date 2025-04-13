// server.js (Express.js)
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

// Auth Endpoints
app.post('/api/register', async (req, res) => {
    // Registration logic
});

app.post('/api/login', async (req, res) => {
    // Login logic
});

// Product Endpoints
app.post('/api/products', authenticateToken, async (req, res) => {
    if (req.user.role !== 'seller') return res.sendStatus(403);
    
    const { name, description, price, stock } = req.body;
    // Save product to database
    res.status(201).json({ id: newProductId, ...req.body });
});

function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.listen(3000, () => console.log('Server running on port 3000'));