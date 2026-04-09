const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/school');

// Models
const Student = mongoose.model('Student', {
  name: String,
  class: String,
});

const Task = mongoose.model('Task', {
  title: String,
  studentId: String,
  completed: Boolean,
});

// Auth middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send('No token');

  try {
    jwt.verify(token, 'secret');
    next();
  } catch {
    res.status(401).send('Invalid token');
  }
};

// Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email === 'admin@gmail.com' && password === '123456') {
    const token = jwt.sign({ email }, 'secret');
    return res.json({ token });
  }

  res.status(401).send('Invalid credentials');
});

// ---------------- STUDENTS ----------------

// Get all students
app.get('/students', auth, async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// Add student
app.post('/students', auth, async (req, res) => {
  const student = await Student.create(req.body);
  res.json(student);
});

// ✅ Edit student (NEW)
app.put('/students/:id', auth, async (req, res) => {
  const updatedStudent = await Student.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updatedStudent);
});

// Delete student
app.delete('/students/:id', auth, async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.send('Deleted');
});

// ---------------- TASKS ----------------

// Get all tasks
app.get('/tasks', auth, async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Add task
app.post('/tasks', auth, async (req, res) => {
  const task = await Task.create({
    ...req.body,
    completed: false,
  });
  res.json(task);
});

// Update task (toggle)
app.put('/tasks/:id', auth, async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updatedTask);
});

// Server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});