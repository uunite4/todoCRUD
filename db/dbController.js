import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'db.json');

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
    await fs.writeFile(dbPath, jsonData, 'utf8');
  } catch (err) {
    console.error('Error writing JSON data: ', err);
  }
};

// Todos only
export const writeTodo = async (data) => {
  const currentCateg = await readCateg();
  const newDB = { todo: data, categories: currentCateg };
  await writeDB(newDB);
};
// Categories only
export const writeCateg = async (data) => {
  const currentTodo = await readTodo();
  const newDB = { todo: currentTodo, categories: data };
  await writeDB(newDB);
};
