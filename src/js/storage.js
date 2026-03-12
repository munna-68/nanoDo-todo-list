import editIcon from "../assets/images/edit-icon.png";
import deleteIcon from "../assets/images/dlt-icon.png";
// localStorage key where projects array is stored

const PROJECTS_STORAGE_KEY = "projects";
const MAX_PROJECT_NAME_LENGTH = 20;

const ALLOWED_PRIORITIES = ["high", "medium", "low"];

/* ----------------------------------
   Rendering helpers (inline DOM lookups)
   ---------------------------------- */
function renderProject(projectName) {
  // if a list item for this project already exists, return it
  const projectItems = document.querySelectorAll(".project-item");
  const existing = Array.from(projectItems).find((item) => {
    const currentProjectName = item.dataset.projectName;
    return currentProjectName === projectName;
  });

  if (existing) {
    return existing;
  }

  //if it doesnt make it and render it
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

// build a single task card element from a todo object
function renderTodoItem(todo) {
  const taskList = document.querySelector(".task-list");
  if (!taskList) return;

  // creating dom node as per the original html design
  const article = document.createElement("article");
  article.className = "task-card";
  if (todo.id) article.dataset.todoId = todo.id;

  const left = document.createElement("div");
  left.className = "task-content-left";

  const checkbox = document.createElement("div");
  checkbox.className = "checkbox-circle";

  const details = document.createElement("div");
  details.className = "task-details";

  const titleEl = document.createElement("h3");
  titleEl.className = "task-title";
  titleEl.textContent = todo.taskName || "";

  const dueEl = document.createElement("span");
  dueEl.className = "task-due-date";
  dueEl.textContent = todo.dueDate ? `Due: ${todo.dueDate}` : "Due: Unknown";

  details.appendChild(titleEl);
  details.appendChild(dueEl);

  left.appendChild(checkbox);
  left.appendChild(details);

  const right = document.createElement("div");
  right.className = "task-content-right";

  const badge = document.createElement("span");
  badge.className = "badge";
  // first char to uppercase
  badge.textContent =
    (todo.priority
      ? todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)
      : "") + " Priority";

  // color based on priority
  switch (todo.priority) {
    case "high":
      badge.classList.add("badge--red");
      break;
    case "medium":
      badge.classList.add("badge--yellow");
      break;
    case "low":
      badge.classList.add("badge--green");
      break;
    default:
      badge.classList.add("badge--grey");
  }

  const controls = document.createElement("div");
  controls.className = "task-controls";

  const editBtn = document.createElement("button");
  editBtn.className = "btn-edit";
  const editImg = document.createElement("img");
  editImg.src = editIcon;
  editImg.alt = "edit task icon";
  editBtn.appendChild(editImg);

  const delBtn = document.createElement("button");
  delBtn.className = "btn-delete";
  const delImg = document.createElement("img");
  delImg.src = deleteIcon;
  delImg.alt = "delete task icon";
  delBtn.appendChild(delImg);

  controls.appendChild(editBtn);
  controls.appendChild(delBtn);

  right.appendChild(badge);
  right.appendChild(controls);

  article.appendChild(left);
  article.appendChild(right);

  taskList.appendChild(article);
}

// clear and render all todos for a given project
function renderTodosForProject(projectName) {
  const taskList = document.querySelector(".task-list");
  if (!taskList) return;
  taskList.innerHTML = "";

  const todos = getProjectTodos(projectName);
  //render each of the to do
  todos.forEach(renderTodoItem);
}

function saveAllProjects(projects) {
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
}

function getAllProjects() {
  const raw = JSON.parse(localStorage.getItem(PROJECTS_STORAGE_KEY));
  // stored value should always be an array; fall back to empty list
  return Array.isArray(raw) ? raw : [];
}

/* ----------------------------------
   CRUD Operations
   ---------------------------------- */
function createProject(projectName) {
  const projects = getAllProjects();

  if (projects.find((p) => p.name === projectName)) {
    alert("Project already exists!");
    return false;
  }

  projects.push({ name: projectName, todos: [] });
  saveAllProjects(projects);
  return true;
}

function deleteProject(projectName) {
  let projects = getAllProjects();

  // creates a new array that doesnt contain the passed argument
  projects = projects.filter((p) => p.name !== projectName);

  saveAllProjects(projects);
}

function addTodoToProject(projectName, todoData) {
  const projects = getAllProjects();
  const project = projects.find((p) => p.name === projectName);

  if (!project) {
    console.error("Project not found:", projectName);
    return false;
  }

  const newTodo = {
    id: `todo-${Date.now()}`,
    taskName: todoData.taskName || "",
    description: todoData.description || "",
    dueDate: todoData.dueDate || null,
    priority: ALLOWED_PRIORITIES.includes(todoData.priority)
      ? todoData.priority
      : "low",
  };

  project.todos.push(newTodo);
  // save to local storage
  saveAllProjects(projects);

  return newTodo;
}

function deleteTodoFromProject(projectName, todoId) {
  const projects = getAllProjects();
  const project = projects.find((p) => p.name === projectName);
  if (!project) return false;

  project.todos = project.todos.filter((todo) => todo.id !== todoId);
  saveAllProjects(projects);
  return true;
}

function updateTodoInProject(projectName, todoId, updatedData) {
  const projects = getAllProjects();
  const project = projects.find((p) => p.name === projectName);
  if (!project) return false;

  const todoIndex = project.todos.findIndex((todo) => todo.id === todoId);
  if (todoIndex === -1) return false;

  // map incoming fields to the new schema
  const sanitized = {};
  if (updatedData.taskName !== undefined)
    sanitized.taskName = updatedData.taskName;
  if (updatedData.description !== undefined)
    sanitized.description = updatedData.description;
  if (updatedData.dueDate !== undefined)
    sanitized.dueDate = updatedData.dueDate;
  if (updatedData.priority !== undefined) {
    sanitized.priority = ALLOWED_PRIORITIES.includes(updatedData.priority)
      ? updatedData.priority
      : "low";
  }

  const existingTodo = project.todos[todoIndex];
  const nextTodo = {
    ...existingTodo,
    ...sanitized,
  };

  project.todos[todoIndex] = nextTodo;
  saveAllProjects(projects);
  return true;
}

function getProjectTodos(projectName) {
  const projects = getAllProjects();
  const project = projects.find((p) => p.name === projectName);
  return project ? project.todos : [];
}

function loadProjects() {
  let projects = getAllProjects();

  // if we have no projects at all, create a sensible default so the UI
  // isn't completely empty
  if (projects.length === 0) {
    createProject("Default Project");
    projects = getAllProjects();
  }

  // clear the sidebar before rendering (template may contain dummy items)
  const projectList = document.querySelector(".project-list");
  if (projectList) {
    projectList.innerHTML = "";
  }

  projects.forEach((proj) => {
    renderProject(proj.name);
  });

  // mark the first project active, update header and render its tasks
  if (projects.length > 0) {
    const first = document.querySelector(".project-item");
    if (first) {
      first.classList.add("active");
      const headerTitle = document.querySelector(".current-project-title");
      if (headerTitle) headerTitle.textContent = `# ${projects[0].name}`;
      renderTodosForProject(projects[0].name);
    }
  }
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
      projectForm.classList.add("hidden");
      const newItem = renderProject(inputValue);
      inputElement.value = "";

      // emulate a click and make the newly created project active
      if (newItem) {
        newItem.click();
      }
    }
  });
}

export const Storage = {
  bindNewProjectForm,
  getAllProjects,
  deleteProject,
  addTodoToProject,
  deleteTodoFromProject,
  updateTodoInProject,
  getProjectTodos,
  loadProjects,
  renderTodosForProject,
};
