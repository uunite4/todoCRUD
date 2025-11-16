// VARS
const todoContainer = document.querySelector('.todo-cont');

// FUNCTIONS

// HELPER: Fetch a single todo
async function getSingleTodo(id) {
  try {
    const res = await fetch('/api/todo/' + id);
    return res.json();
  } catch (error) {
    console.error('Error checking toggle status:', error);
  }
}

// HELPER: Fetch a single category
async function getSingleCategory(id) {
  try {
    const res = await fetch('/api/categories/' + id);
    return res.json();
  } catch (error) {
    console.error('Error checking toggle status:', error);
  }
}

// Create an actual dom element for a todo
function addTodo(obj, cat) {
  const todo = document.createElement('div');
  todo.classList.add('todo');
  todo.dataset.id = obj.id; // SO WE CAN IDENTIFY IT
  todo.style.setProperty('--categ-color', cat.color); //color for css
  todo.innerHTML = `
            <div class="checkbox ${obj.complete ? 'checked' : ''}"
            onclick="toggleComplete(${obj.id})"></div>
            <p>${obj.name}</p>
    `;
  return todo;
}

// Show all todos in the DOM
async function showAllTodos() {
  try {
    const res1 = await fetch('/api/todo');
    const todos = await res1.json();

    const elements = await Promise.all(
      todos.map(async (todo) => {
        const res2 = await fetch('/api/categories/' + todo.categoryId);
        const category = await res2.json();
        return addTodo(todo, category);
      })
    );
    elements.forEach((el) => todoContainer.appendChild(el));
  } catch (error) {
    console.error('Error fetching todos:', error);
  }
}

// Update a single todo in the DOM (add it if it doesn't exist)
async function updateTodoInDOM(id, updatedTodo) {
  const category = await getSingleCategory(updatedTodo.categoryId);
  const existing = todoContainer.querySelector(`.todo[data-id="${id}"]`);
  const newEl = addTodo(updatedTodo, category);
  if (existing) {
    todoContainer.replaceChild(newEl, existing);
  } else {
    todoContainer.appendChild(newEl);
  }
}

// Toggle the complete status of a todo (and show it in the DOM)
async function toggleComplete(id) {
  const currentTodo = await getSingleTodo(id);
  try {
    // PUT requests return the updated object (see todoController.js)
    const updatedTodoJSON = await fetch('/api/todo/' + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: currentTodo.name,
        categoryId: currentTodo.categoryId,
        complete: !currentTodo.complete, //opposite of what we had until now
      }),
    });
    const updatedTodo = await updatedTodoJSON.json();
    await updateTodoInDOM(id, updatedTodo); // update the single todo in the DOM
  } catch (error) {
    console.error('Error toggling todo complete status:', error);
  }
}

// EVENT LISTENERS
window.addEventListener('load', async () => {
  await showAllTodos();
});
