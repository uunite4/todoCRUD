import express from 'express';
import todos from './routes/todos.js';

const app = express();
const port = 8000;

// _DIRNAME
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// HOMEPAGE
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'homepage', 'index.html'));
});

// TODO APP PAGE
app.get('/todo', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'todo', 'todo.html'));
});

// API
app.use('/api/todos', todos);

app.listen(port, () => {
  console.log(`Todo app is running on port ${port}`);
});
