function getAllProjects() {
  return JSON.parse(localStorage.getItem("projects")) || {};
}

function saveAllProjects(projects) {
  localStorage.setItem("projects", JSON.stringify(projects));
}

function saveProjectToStorage(projectName) {
  const projects = getAllProjects();

  if (projects[projectName]) {
    alert("Project already exists!");
    return false;
  }

  projects[projectName] = {
    name: projectName,
    todos: [],
  };

  saveAllProjects(projects);
  return true;
}

function deleteProjectFromStorage(projectName) {
  const projects = getAllProjects();

  delete projects[projectName];

  saveAllProjects(projects);
}

function addTodoToProject(projectName, todoData) {
  const projects = getAllProjects();

  if (!projects[projectName]) {
    console.error("Project not found:", projectName);
    return false;
  }

  const newTodo = {
    id: `todo-${Date.now()}`,
    title: todoData.title,
    description: todoData.description || "",
    dueDate: todoData.dueDate || null,
    priority: todoData.priority || "low",
  };

  projects[projectName].todos.push(newTodo);
  saveAllProjects(projects);

  return newTodo;
}

function deleteTodoFromProject(projectName, todoId) {
  const projects = getAllProjects();

  if (!projects[projectName]) return false;

  // only the todo that matches the id are kept
  projects[projectName].todos = projects[projectName].todos.filter(
    (todo) => todo.id !== todoId,
  );

  saveAllProjects(projects);
  return true;
}

function updateTodoInProject(projectName, todoId, updatedData) {
  const projects = getAllProjects();

  if (!projects[projectName]) return false;

  const todoIndex = projects[projectName].todos.findIndex(
    (todo) => todo.id === todoId,
  );

  if (todoIndex === -1) return false;

  // Merge existing todo with updated fields
  const oldTodo = projects[projectName].todos[todoIndex];

  const newTodo = {
    ...oldTodo,
    ...updatedData,
  };

  projects[projectName].todos[todoIndex] = newTodo;

  saveAllProjects(projects);
  return true;
}

function getTodosForProject(projectName) {
  const projects = getAllProjects();
  return projects[projectName]?.todos || [];
}

// Render a new project in the UI

function renderNewProject(projectName) {
  const li = document.createElement("li");
  const span = document.createElement("span");

  li.className = "project-item";
  li.dataset.projectName = projectName; // Store name for reference
  span.className = "project-name";
  span.textContent = projectName;

  li.appendChild(span);
  document.querySelector("ul").appendChild(li);
  return li;
}

// Load all projects on page load
function loadProjectsFromStorage() {
  const projects = getAllProjects();

  Object.keys(projects).forEach((projectName) => {
    renderNewProject(projectName);
  });
}

export function addNewProject() {
  const formGroup = document.querySelector(".add-project-form");
  const inputElement = formGroup.querySelector(".input-text");

  formGroup.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;

    const inputValue = inputElement.value.trim();

    if (inputValue === "") return;

    if (inputValue.length > 20) {
      alert("Project name must be 20 characters or less.");
      return;
    }

    if (saveProjectToStorage(inputValue)) {
      formGroup.classList.add("hidden");
      const li = renderNewProject(inputValue);
      li.classList.add(inputValue);
      inputElement.value = "";
    }
  });
}

export {
  getAllProjects,
  deleteProjectFromStorage,
  addTodoToProject,
  deleteTodoFromProject,
  updateTodoInProject,
  getTodosForProject,
  loadProjectsFromStorage,
};
