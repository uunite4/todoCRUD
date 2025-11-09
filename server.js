import express from 'express';
import todos from './routes/todos.js';
import categs from './routes/categs.js';
import logger from './middleware/logger.js';

const app = express();
const port = 8000;

// _DIRNAME
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Body parser middleware (So we can read the body)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware
app.use(logger);

app.use(express.static(path.join(__dirname, 'public')));

// HOMEPAGE
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'homepage', 'index.html'));
});

// TODO APP PAGE
app.get('/todo', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'todo', 'todo.html'));
});

// API
app.use('/api/todo', todos);
app.use('/api/categories', categs);

app.listen(port, () => {
  console.log(`Todo app is running on port ${port}`);
});
