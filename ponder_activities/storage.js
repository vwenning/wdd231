let tasks = [];

// HTML template for a task item
function taskTemplate(task) {
  return `
    <li ${task.completed ? 'class="strike"' : ""}>
      <p>${task.detail}</p>
      <div>
        <span data-action="delete">❎</span>
        <span data-action="complete">✅</span>
      </div>
    </li>`;
}

// Render tasks to the DOM
function renderTasks(tasks) {
  const listElement = document.querySelector("#todoList");
  listElement.innerHTML = tasks.map(taskTemplate).join("");
}

// Add a new task
function newTask() {
  const taskInput = document.querySelector("#todo");
  const taskDetail = taskInput.value.trim();

  if (taskDetail === "") return; // Ignore empty input

  tasks.push({ detail: taskDetail, completed: false });
  setLocalStorage("todos", tasks);
  renderTasks(tasks);
  taskInput.value = ""; // Clear input
}

// Remove a task
function removeTask(taskElement) {
  const taskText = taskElement.querySelector("p").innerText;
  tasks = tasks.filter(task => task.detail !== taskText);
  setLocalStorage("todos", tasks);
  renderTasks(tasks);
}

// Toggle task completion
function completeTask(taskElement) {
  const taskText = taskElement.querySelector("p").innerText;
  const index = tasks.findIndex(task => task.detail === taskText);

  if (index !== -1) {
    tasks[index].completed = !tasks[index].completed;
    setLocalStorage("todos", tasks);
    renderTasks(tasks);
  }
}

// Handle task actions (delete or complete)
function manageTasks(e) {
  const parent = e.target.closest("li");
  if (!parent) return;

  if (e.target.dataset.action === "delete") {
    removeTask(parent);
  } else if (e.target.dataset.action === "complete") {
    completeTask(parent);
  }
}

// Set the user's name in the UI
function setUserName() {
  const name = localStorage.getItem("todo-user");
  if (name) {
    document.querySelector(".user").innerText = name;
  }
}

// Save new user name
function userNameHandler() {
  const name = document.querySelector("#user").value.trim();
  if (name) {
    localStorage.setItem("todo-user", name);
    setUserName();
  }
}

// LocalStorage helper functions
function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getLocalStorage(key) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : [];
}

// Initialization function
function init() {
  tasks = getLocalStorage("todos");
  renderTasks(tasks);
  setUserName();
  addEventListeners();
}

// Add event listeners
function addEventListeners() {
  document.querySelector("#submitTask").addEventListener("click", newTask);
  document.querySelector("#todoList").addEventListener("click", manageTasks);
  document.querySelector("#userNameButton").addEventListener("click", userNameHandler);
}

// Run init on page load
init();
