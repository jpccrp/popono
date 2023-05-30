const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const prisma = new PrismaClient();
const app = express();

require('dotenv').config({ path: './prisma/.env' });
const JWT_SECRET = process.env.JWT_SECRET;


app.use(bodyParser.json());
app.use(cors());

//login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Fetch the user by email
    const user = await prisma.employee.findUnique({ where: { email } });

    if (!user) {
        res.status(401).json({ error: "User does not exist" });
        return;
    }

    // Compare password with the hashed password in the database
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
        res.status(401).json({ error: "Incorrect password" });
        return;
    }

    // Create JWT token
    const token = jwt.sign(
        { id: user.id, email: user.email, isAdmin: user.isAdmin }, 
        JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.status(200).json({ token });
});

const { authenticateToken } = require('./middleware');

// Your routes and server setup...

app.get('/protected', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'Protected content' });
});


app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
