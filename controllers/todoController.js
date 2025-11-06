import { readDB, readTodo } from '../db/dbController.js';

// @dec     Get all todos
// @route   GET /api/todo
export const getTodos = async (req, res, next) => {
  const allTodos = await readTodo();
  console.log(allTodos);
  res.status(200).json(allTodos);
};

export const getTodo = async (req, res, next) => {
  const allTodos = await readTodo();
  const todoId = req.params.id;
  const todoItem = allTodos.find((item) => item.id == todoId);
  if (!todoItem) {
    return res.status(404).json({ msg: '[ ERROR ]: Todo not found' });
  }
  res.status(200).json(todoItem);
};
