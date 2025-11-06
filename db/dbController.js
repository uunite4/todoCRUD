import fs from 'fs/promises';
const dbPath = './db/db.json';

export const readDB = async () => {
  try {
    const data = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error getting JSON data: ', err);
  }
};

export const readTodo = async () => {
  const db = await readDB();
  return db.todo;
};

export const writeDB = async (data) => {
  try {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFile(dbPath, jsonData, 'utf8');
  } catch (err) {
    console.error('Error writing JSON data: ', err);
  }
};
