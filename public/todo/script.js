// VARS
const todoContainer = document.querySelector('.todo-cont');

// FUNCTIONS

// HELPER: Fetch a single todo
async function getSingleTodo(id) {
  try {
    const res = await fetch('/api/todo/' + id);
    return res.json();
  } catch (error) {
    console.error('Error Fetching single todo:', error);
  }
}

// HELPER: Fetch a single category
async function getSingleCategory(id) {
  try {
    const res = await fetch('/api/categories/' + id);
    return res.json();
  } catch (error) {
    console.error('Error Fetching single category:', error);
  }
}

// HELPER: Fetch all categories
async function getAllCategories() {
  try {
    const res1 = await fetch('/api/categories');
    const categs = await res1.json();
    return categs;
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

// ----- MODAL JS -----
// CREATION VARS
let newTodoData = {
  name: '',
  categoryId: null,
};
const blackScreen = document.querySelector('.blackscreen');
// MODAL VARS
const createTodoM = document.querySelector('.todomodal');
const categorySelectorM = document.querySelector('.category-modal');
const selectCategoryM = document.querySelector('.category-modal');
// XBTN VARS
const createTodoX = document.querySelector('.xbtn.create-todo');
// OPEN VARS
const createTodoO = document.querySelector('.add-btn');
const selectCategoryO = document.querySelector('.select-cat-btn');
// HELPER VARS
const categorySelectedShow = document.querySelector('.select-cat-btn-cont > p');
const createTodoBtn = document.querySelector('.create-todo-btn');

// HANDLER FUNCTIONS
const handleSelectCategory = async () => {
  // 1. Fetch all existing categories
  categs = await getAllCategories();
  console.log(categs);
  // 2. Show all categories
  categorySelectorM.innerHTML = ''; // clear previous

  categs.forEach((categ) => {
    const categEl = document.createElement('span');
    categEl.style.color = categ.color;
    categEl.innerText = categ.name;
    categorySelectorM.appendChild(categEl);
    categorySelectorM.appendChild(document.createElement('div')); //divider
    categEl.addEventListener('click', () => {
      newTodoData.categoryId = categ.id; // SELECT THIS CATEGORY
      categorySelectedShow.style.display = 'block';
      const showCategoryP = categorySelectedShow.querySelector('span');
      showCategoryP.innerText = categ.name;
      showCategoryP.style.color = categ.color;
      selectCategoryO.innerText = 'Change Category';
      console.log('Selected category:', categ.name);
      closeModal(selectCategoryM);
      //
    });
  });
  // delete last divider
  categorySelectorM.removeChild(categorySelectorM.lastChild);
};

const createTodoHandler = async () => {
  // 1. Get the name from input
  const nameInput = document.querySelector('.todo-name-input');
  newTodoData.name = nameInput.value;
  // 2. Validate
  if (!newTodoData.name || !newTodoData.categoryId) {
    alert('Please provide both a name and a category for the todo.');
    return;
  }
  // 3. Send to server
  try {
    const res = await fetch('/api/todo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTodoData),
    });
    const createdTodo = await res.json();
    updateTodoInDOM(createdTodo.id, createdTodo);
    // 4. Close modal and reset
    closeAllModals();
  } catch (error) {
    console.error('Error creating todo:', error);
  }
};

// OPEN / CLOSE FUNCTIONS
const closeAllModals = () => {
  createTodoM.style.display = 'none';
  categorySelectorM.style.display = 'none';
  blackScreen.style.display = 'none';
  categorySelectedShow.style.display = 'none';
  newTodoData = {
    name: '',
    categoryId: null,
    complete: false,
  };
};

const openModal = (modal) => {
  blackScreen.style.display = 'block';
  modal.style.display = 'flex';
};

const closeModal = (modal) => {
  modal.style.display = 'none';
};

const showBlackScreen = () => (blackScreen.style.display = 'block');
const hideBlackScreen = () => (blackScreen.style.display = 'none');

createTodoX.addEventListener('click', () => closeAllModals());

createTodoO.addEventListener('click', () => {
  closeModal(categorySelectedShow);
  selectCategoryO.innerText = 'Select Category';
  document.querySelector('.todo-name-input').value = '';
  openModal(createTodoM);
});
selectCategoryO.addEventListener('click', () => {
  handleSelectCategory();
  openModal(selectCategoryM);
});
createTodoBtn.addEventListener('click', () => {
  createTodoHandler();
});

blackScreen.addEventListener('click', () => {
  closeAllModals();
});
// ----- END MODAL JS -----
