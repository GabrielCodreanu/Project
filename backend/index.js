const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

app.use(cors());
app.use(express.json());

// simple SQLite database for demo purposes
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    instructor_id INTEGER,
    content TEXT
  )`);

  // create a default admin user if none exists
  db.get('SELECT * FROM users WHERE role = ? LIMIT 1', ['admin'], (err, row) => {
    if (!row) {
      const hash = bcrypt.hashSync('admin', 10);
      db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Administrator', 'admin@example.com', hash, 'admin']);
    }
  });
});

function generateToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
}

function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  next();
}

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// user registration
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const hash = bcrypt.hashSync(password, 10);
  db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, hash, 'student'], function(err) {
      if (err) {
        return res.status(400).json({ error: 'User already exists' });
      }
      const user = { id: this.lastID, role: 'student' };
      const token = generateToken(user);
      res.json({ token });
    });
});

// login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err || !user) return res.status(400).json({ error: 'Invalid credentials' });
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = generateToken(user);
    res.json({ token, role: user.role });
  });
});

// list courses (authenticated)
app.get('/api/courses', authenticateToken, (req, res) => {
  db.all('SELECT id, title, description FROM courses', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'db error' });
    res.json({ courses: rows });
  });
});

// add new course (admin only)
app.post('/api/courses', authenticateToken, requireAdmin, (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ error: 'Missing title' });
  db.run('INSERT INTO courses (title, description) VALUES (?, ?)',
    [title, description || ''], function(err) {
      if (err) return res.status(500).json({ error: 'db error' });
      res.json({ id: this.lastID });
    });
});

// Return a list of mock recommendations
app.get('/api/recommendations', (req, res) => {
  const data = [
    { id: 1, title: 'Introduction to Algebra', type: 'course' },
    { id: 2, title: 'Practice Test: Geometry Basics', type: 'quiz' },
  ];
  res.json({ recommendations: data });
});

// Very basic grading endpoint that returns a random score
app.post('/api/grade', (req, res) => {
  const score = Math.floor(Math.random() * 101);
  res.json({ score });
});

// Simple chatbot echo implementation
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  res.json({ response: `Echo: ${message || ''}` });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
