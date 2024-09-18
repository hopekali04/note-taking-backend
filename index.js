const express = require('express');
const fs = require('fs');
const uuid = require('uuid');

const app = express();
app.use(express.json());

// Load tasks from database
let tasks = JSON.parse(fs.readFileSync('db.json', 'utf8')).tasks;

// Create a new task
app.post('/tasks', (req, res) => {
  const { title, isCompleted } = req.body;
  if (!title) {
    return res.status(400).send({ error: 'Title is required' });
  }

  const newTask = {
    id: uuid.v4(),
    title,
    isCompleted: isCompleted || false,
  };

  tasks.push(newTask);
  fs.writeFileSync('db.json', JSON.stringify({ tasks }, null, 2));

  res.status(201).send(newTask);
});

// Get all tasks
app.get('/tasks', (req, res) => {
  res.send(tasks);
});

// Get a task by ID
app.get('/tasks/:id', (req, res) => {
  const id = req.params.id;
  const task = tasks.find((task) => task.id === id);
  if (!task) {
    return res.status(404).send({ error: 'Task not found' });
  }

  res.send(task);
});

// Delete a task by ID
app.delete('/tasks/:id', (req, res) => {
  const id = req.params.id;
  tasks = tasks.filter((task) => task.id !== id);
  fs.writeFileSync('db.json', JSON.stringify({ tasks }, null, 2));

  res.status(204).send({ message: 'Task deleted successfully' });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});