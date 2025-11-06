import fs from 'fs/promises';
const dbPath = './db/db.json';

// -- READ --
// Full DB
export const readDB = async () => {
  try {
    const data = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error getting JSON data: ', err);
  }
};

// Todos only
export const readTodo = async () => {
  const db = await readDB();
  return db.todo;
};
// Categories only
export const readCateg = async () => {
  const db = await readDB();
  return db.categories;
};

// -- WRITE --
// Full DB
export const writeDB = async (data) => {
  try {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFile(dbPath, jsonData, 'utf8');
  } catch (err) {
    console.error('Error writing JSON data: ', err);
  }
};

// Todos only
export const writeTodo = async (data) => {
  const currentCateg = await readCateg();
  const newDB = { categories: currentCateg, todo: data };
  await writeDB(newDB);
};
// Categories only
export const writeCateg = async (data) => {
  const currentTodo = await readTodo();
  const newDB = { categories: data, todo: currentTodo };
  await writeDB(newDB);
};
