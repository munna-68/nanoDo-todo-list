const PROJECTS_STORAGE_KEY = "projects";
const MAX_PROJECT_NAME_LENGTH = 20;
const HIDDEN_CLASS = "hidden";

/* ----------------------------------
   Rendering helpers (inline DOM lookups)
   ---------------------------------- */
function renderProject(projectName) {
  // if a list item for this project already exists, return it
  const projectItems = document.querySelectorAll(".project-item");
  const existing = Array.from(projectItems).find((item) => {
    // prefer the data attribute instead of the text of the span
    const currentProjectName = item.dataset.projectName;
    return currentProjectName === projectName;
  });

  if (existing) {
    return existing;
  }

  const projectList = document.querySelector(".project-list");
  if (!projectList) return null;

  const listItem = document.createElement("li");
  const projectNameLabel = document.createElement("span");

  listItem.className = "project-item";
  listItem.dataset.projectName = projectName;
  projectNameLabel.className = "project-name";
  projectNameLabel.textContent = projectName;

  listItem.appendChild(projectNameLabel);
  projectList.appendChild(listItem);

  return listItem;
}

/* ----------------------------------
   Persistence Helpers
   ---------------------------------- */
function saveAllProjects(projects) {
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
}

function getAllProjects() {
  return JSON.parse(localStorage.getItem(PROJECTS_STORAGE_KEY)) || {};
}

/* ----------------------------------
   CRUD Operations
   ---------------------------------- */
function createProject(projectName) {
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

function deleteProject(projectName) {
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

  const existingTodo = projects[projectName].todos[todoIndex];
  const nextTodo = {
    ...existingTodo,
    ...updatedData,
  };

  projects[projectName].todos[todoIndex] = nextTodo;

  saveAllProjects(projects);
  return true;
}

function getProjectTodos(projectName) {
  const projects = getAllProjects();
  return projects[projectName]?.todos || [];
}

function loadProjects() {
  const projects = getAllProjects();

  Object.keys(projects).forEach((projectName) => {
    renderProject(projectName);
  });
}

/* ----------------------------------
   Binding & Initialization
   ---------------------------------- */
function bindNewProjectForm() {
  const projectForm = document.querySelector(".add-project-form");
  const inputElement = projectForm?.querySelector(".input-text");

  if (!projectForm || !inputElement) return;

  projectForm.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;

    const inputValue = inputElement.value.trim();

    if (inputValue === "") return;

    if (inputValue.length > MAX_PROJECT_NAME_LENGTH) {
      alert("Project name must be 20 characters or less.");
      return;
    }

    if (createProject(inputValue)) {
      projectForm.classList.add(HIDDEN_CLASS);
      renderProject(inputValue);
      inputElement.value = "";
    }
  });
}

/* ----------------------------------
   Public API
   ---------------------------------- */
export const Storage = {
  bindNewProjectForm,
  getAllProjects,
  deleteProject,
  addTodoToProject,
  deleteTodoFromProject,
  updateTodoInProject,
  getProjectTodos,
  loadProjects,
};
