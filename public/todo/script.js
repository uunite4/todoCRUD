// VARS
const todoContainer = document.querySelector('.todo-cont');

// FUNCTIONS
function addTodo(obj, cat) {
  const todo = document.createElement('div');
  todo.classList.add('todo');
  todo.innerHTML = `
            <div class="checkbox" style="border: 3px solid ${cat.color}"></div>
            <p>${obj.name}</p>
    `;
  return todo;
}

async function showAllTodos() {
  try {
    const res1 = await fetch('/api/todo');
    const todos = await res1.json();

    todos.forEach(async (todo) => {
      try {
        const res2 = await fetch('/api/categories/' + todo.categoryId);
        const category = await res2.json();
        todoContainer.appendChild(addTodo(todo, category));
      } catch (error) {}
    });
  } catch (error) {
    console.error('Error fetching todos:', error);
  }
}

// EVENT LISTENERS
window.addEventListener('load', async () => {
  await showAllTodos();
});
