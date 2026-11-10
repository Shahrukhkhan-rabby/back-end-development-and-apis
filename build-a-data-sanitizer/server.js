const express = require('express');
const path = require('path');
const { inputCleaner, inputValidator } = require('./middleware');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 1. GET / should redirect to /form (Place this before static middleware if static is serving index.html at root)
app.get('/', (req, res) => {
    res.redirect('/form');
});

// 2. GET /form serves the static HTML form
app.get('/form', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// POST /submit route with middleware
app.post('/submit', inputCleaner, inputValidator, (req, res) => {
    res.json({
        username: req.body.username,
        comment: req.body.comment
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});