import express from 'express';
import {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
} from '../controllers/todoController.js';

const router = express.Router();

// GET ALL TODOS (query: categoryId)
router.get('/', getTodos);

// GET TODO BY ID
router.get('/:id', getTodo);

// CREATE NEW TODO
router.post('/', createTodo);

// UPDATE TODO (INCLUDING COMPLETION)
router.put('/:id', updateTodo);

// DELETE TODO
router.delete('/:id', deleteTodo);

export default router;
