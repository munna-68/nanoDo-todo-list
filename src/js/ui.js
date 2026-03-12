import { Storage } from "./storage.js";

export const projectForm = document.querySelector(".add-project-form");
export const inputPanel = document.querySelector(".input-panel");
export const editorPanel = document.querySelector(".editor-panel");
export const taskDetailsPanel = document.querySelector(".task-details-panel");
export const panels = [inputPanel, editorPanel, taskDetailsPanel].filter(
  Boolean,
);

function showPanel(activePanel) {
  panels.forEach((panel) => {
    panel.classList.toggle("hidden", panel !== activePanel);
  });
}

function hidePanel(panel) {
  panel?.classList.add("hidden");
}

function toggleActiveProject(projectItem) {
  const allProjectItems = document.querySelectorAll(".project-item");
  allProjectItems.forEach((item) => {
    item.classList.remove("active");
  });
  projectItem.classList.add("active");
}

function bindNewProjectButton() {
  const newProjectButton = document.querySelector(".btn-new-project");

  // check if both element are present
  if (!newProjectButton || !projectForm) return;

  newProjectButton.addEventListener("click", () => {
    projectForm.classList.remove("hidden");
  });
}

function bindAddTaskButton() {
  const taskInputPlaceholder = document.querySelector(
    ".task-input-placeholder",
  );

  if (!taskInputPlaceholder || !inputPanel) return;

  taskInputPlaceholder.addEventListener("click", () => {
    showPanel(inputPanel);
  });

  // handle save action inside the input-panel
  const saveBtn = inputPanel.querySelector(".btn-save");
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const activeProjectItem = document.querySelector(".project-item.active");
      if (!activeProjectItem) {
        alert("Please select or create a project first.");
        return;
      }
      const projectName = activeProjectItem.dataset.projectName;
      const nameInput = inputPanel.querySelector(".input-text");
      const descInput = inputPanel.querySelector(".input-textarea");

      const title = nameInput?.value.trim();
      if (!title) {
        alert("Task name cannot be empty.");
        return;
      }

      const todoData = {
        taskName: title,
        description: descInput?.value.trim() || "",
        // priority and dueDate UI not wired; will default in Storage
      };

      Storage.addTodoToProject(projectName, todoData);
      Storage.renderTodosForProject(projectName);

      // clear form and hide
      nameInput.value = "";
      if (descInput) descInput.value = "";
      hidePanel(inputPanel);
    });
  }
}

function bindPanelCloseButtons() {
  const closeButtons = document.querySelectorAll(".btn-close-panel");

  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      hidePanel(button.closest(".pannel"));
    });
  });
}

function bindEditTaskButtons() {
  const taskList = document.querySelector(".task-list");

  // helper to populate editor form with todo info
  function populateEditor(todo) {
    if (!editorPanel) return;
    const nameInput = editorPanel.querySelector(".input-field");
    const descInput = editorPanel.querySelector(".textarea-field");

    if (nameInput) nameInput.value = todo.taskName || "";
    if (descInput) descInput.value = todo.description || "";

    // stash id on panel for later
    editorPanel.dataset.editingTodoId = todo.id;
  }

  if (taskList && editorPanel) {
    taskList.addEventListener("click", (event) => {
      const editButton = event.target.closest(".btn-edit");
      if (!editButton) return;

      event.stopPropagation();
      const taskCard = editButton.closest(".task-card");
      const todoId = taskCard?.dataset.todoId;
      const activeProjectItem = document.querySelector(".project-item.active");
      if (todoId && activeProjectItem) {
        const projectName = activeProjectItem.dataset.projectName;
        const todo = Storage.getProjectTodos(projectName).find(
          (t) => t.id === todoId,
        );
        if (todo) {
          populateEditor(todo);
        }
      }
      showPanel(editorPanel);
    });
  }

  if (!taskDetailsPanel || !editorPanel) return;

  taskDetailsPanel.addEventListener("click", (event) => {
    const editButton = event.target.closest(".btn-edit");
    if (!editButton) return;

    event.stopPropagation();
    showPanel(editorPanel);
  });

  // handle save inside editor panel
  if (editorPanel) {
    const saveBtn = editorPanel.querySelector(".btn-save");
    if (saveBtn) {
      saveBtn.addEventListener("click", () => {
        const activeProjectItem = document.querySelector(
          ".project-item.active",
        );
        if (!activeProjectItem) return;
        const projectName = activeProjectItem.dataset.projectName;
        const nameInput = editorPanel.querySelector(".input-field");
        const descInput = editorPanel.querySelector(".textarea-field");
        const todoId = editorPanel.dataset.editingTodoId;
        if (!todoId) return;

        const updated = {
          taskName: nameInput?.value.trim() || "",
          description: descInput?.value.trim() || "",
        };
        Storage.updateTodoInProject(projectName, todoId, updated);
        Storage.renderTodosForProject(projectName);
        hidePanel(editorPanel);
      });
    }
  }
}

function bindTaskCardClicks() {
  const taskList = document.querySelector(".task-list");

  if (!taskList || !taskDetailsPanel) return;

  taskList.addEventListener("click", (event) => {
    // deletion is handled here so don't early-return for delete buttons
    const deleteButton = event.target.closest(".btn-delete");
    if (deleteButton) {
      event.stopPropagation();
      const card = deleteButton.closest(".task-card");
      const todoId = card?.dataset.todoId;
      const activeProjectItem = document.querySelector(".project-item.active");
      if (todoId && activeProjectItem) {
        const projectName = activeProjectItem.dataset.projectName;
        Storage.deleteTodoFromProject(projectName, todoId);
        Storage.renderTodosForProject(projectName);
      }
      return;
    }

    if (event.target.closest(".btn-edit, .checkbox-circle")) {
      return;
    }

    const taskCard = event.target.closest(".task-card");
    if (!taskCard) return;

    showPanel(taskDetailsPanel);
  });
}

function bindCompleteTaskButtons() {
  const taskList = document.querySelector(".task-list");

  if (!taskList) return;

  taskList.addEventListener("click", (event) => {
    const checkboxCircle = event.target.closest(".checkbox-circle");
    if (!checkboxCircle) return;

    event.stopPropagation();

    const taskCard = checkboxCircle.closest(".task-card");
    const badge = taskCard?.querySelector(".badge");

    taskCard?.classList.toggle("task-card--completed");
    checkboxCircle.classList.toggle("completed");
    badge?.classList.toggle("badge--grey");
  });
}

function updateCurrentProjectHeader(projectName) {
  const headerTitle = document.querySelector(".current-project-title");
  if (!headerTitle) return;

  headerTitle.innerHTML = "";

  const iconHash = document.createElement("span");
  iconHash.className = "icon-hash";
  iconHash.textContent = "#";
  headerTitle.appendChild(iconHash);

  // project name can be simple text node so it doesn't wrap in extra
  // paragraph elements that could stack up.
  const textNode = document.createTextNode(projectName);
  headerTitle.appendChild(textNode);
}

function bindProjectSwitching() {
  const projectList = document.querySelector(".project-list");

  if (!projectList) return;

  projectList.addEventListener("click", (event) => {
    const projectItem = event.target.closest(".project-item");
    if (!projectItem) return;

    toggleActiveProject(projectItem);

    // update header and task list for selected project
    const projectName = projectItem.dataset.projectName;
    if (projectName) {
      updateCurrentProjectHeader(projectName);
      Storage.renderTodosForProject(projectName);
    }
  });
}

export const UI = {
  bindNewProjectButton,
  bindAddTaskButton,
  bindPanelCloseButtons,
  bindEditTaskButtons,
  bindTaskCardClicks,
  bindCompleteTaskButtons,
  bindProjectSwitching,
  updateCurrentProjectHeader,
};
