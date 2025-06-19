const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
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
