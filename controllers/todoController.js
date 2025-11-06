import { readTodo, writeTodo } from '../db/dbController.js';

// @desc     Get all todos
// @route   GET /api/todo
// @query   categoryId
export const getTodos = async (req, res, next) => {
  const allTodos = await readTodo();

  // Check if we wanna filter by category
  const categoryId = req.query.category;
  if (categoryId) {
    const filteredTodos = allTodos.filter(
      (item) => item.categoryId == categoryId
    );
    return res.status(200).json(filteredTodos);
  }

  res.status(200).json(allTodos);
};

// @desc     Get todo by id
// @route   GET /api/todo/:id
export const getTodo = async (req, res, next) => {
  const allTodos = await readTodo();
  const todoId = req.params.id;
  const todoItem = allTodos.find((item) => item.id == todoId);
  if (!todoItem) {
    return res.status(404).json({ msg: '[ ERROR ]: Todo not found' });
  }
  res.status(200).json(todoItem);
};

// @desc     Create new todo
// @route   POST /api/todo
export const createTodo = async (req, res, next) => {
  const { name, categoryId } = req.body;
  const allTodos = await readTodo();

  // Simple validation
  if (!name || !categoryId) {
    return res
      .status(400)
      .json({ msg: '[ ERROR ]: Please provide name and categoryId' });
  }
  //create new ID
  const maxId = allTodos.length ? Math.max(...allTodos.map((t) => t.id)) : 0; // get the highest id
  const newTodoId = maxId + 1;
  // put it all together
  const newTodo = {
    id: newTodoId,
    name: name,
    categoryId: parseInt(categoryId),
    complete: false,
  };
  allTodos.push(newTodo);
  await writeTodo(allTodos);
  res.status(201).json(newTodo);
};

// @desc     Update todo by id
// @route   PUT /api/todo/:id
export const updateTodo = async (req, res, next) => {
  const allTodos = await readTodo();
  const todoId = req.params.id;
  let todoItem = allTodos.find((item) => item.id == todoId);
  if (!todoItem) {
    return res.status(404).json({ msg: '[ ERROR ]: Todo not found' });
  }

  const { name, categoryId, complete } = req.body;
  if (!name || !categoryId || complete == undefined) {
    return res.status(400).json({
      msg: '[ ERROR ]: Please provide name, categoryId and complete',
    });
  }

  // Update the item
  todoItem.name = name;
  todoItem.categoryId = parseInt(categoryId);
  todoItem.complete = Boolean(parseInt(complete));
  // Update the item in the array
  const newTodos = allTodos.map((item) =>
    item.id == todoId ? todoItem : item
  );
  await writeTodo(newTodos);

  res.status(200).json(todoItem);
};

// @desc     Delete todo by id
// @route   DELETE /api/todo/:id
export const deleteTodo = async (req, res, next) => {
  const allTodos = await readTodo();
  const todoId = req.params.id;
  const todoItem = allTodos.find((item) => item.id == todoId);
  if (!todoItem) {
    return res.status(404).json({ msg: '[ ERROR ]: Todo not found' });
  }

  const newTodos = allTodos.filter((item) => item.id != todoId);
  await writeTodo(newTodos);

  res.status(204).send();
};
