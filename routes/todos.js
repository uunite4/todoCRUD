import express from 'express';
import { getTodos, getTodo } from '../controllers/todoController.js';

const router = express.Router();

// GET ALL TODOS
router.get('/', getTodos);

// GET TODO BY ID
router.get('/:id', getTodo);

// CREATE NEW TODO
// router.post('/');

// UPDATE TODO (INCLUDING COMPLETION)
// router.put('/:id');

// // GET TODO BY ID
// router.get('/:id');

// // CREATE NEW TODO
// router.post('/');

// // UPDATE TODO (INCLUDING COMPLETION)
// router.put('/:id');

// // DELETE TODO
// router.delete('/:id');

export default router;
