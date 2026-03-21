import { Storage } from "./storage.js";

export const projectForm = document.querySelector(".add-project-form");
export const inputPanel = document.querySelector(".input-panel");
export const editorPanel = document.querySelector(".editor-panel");
export const taskDetailsPanel = document.querySelector(".task-details-panel");
export const panels = [inputPanel, editorPanel, taskDetailsPanel].filter(
  Boolean,
);

const PRIORITY_CONFIG = {
  high: {
    label: "High Priority",
    dotClass: "color-dot--red",
  },
  medium: {
    label: "Medium Priority",
    dotClass: "color-dot--yellow",
  },
  low: {
    label: "Low Priority",
    dotClass: "color-dot--green",
  },
};

const DEFAULT_PRIORITY = "low";
const PRIORITY_DOT_CLASSES = [
  "color-dot--red",
  "color-dot--yellow",
  "color-dot--green",
];

let priorityDropdownsBound = false;

function showPanel(activePanel) {
  panels.forEach((panel) => {
    panel.classList.toggle("hidden", panel !== activePanel);
  });
}

function hidePanel(panel) {
  panel?.classList.add("hidden");
}

function getPriorityConfig(priority) {
  return PRIORITY_CONFIG[priority] || PRIORITY_CONFIG[DEFAULT_PRIORITY];
}

function getPrioritySelect(panel) {
  return panel?.querySelector("[data-priority-select]") || null;
}

function getPriorityTrigger(panel) {
  return panel?.querySelector("[data-priority-trigger]") || null;
}

function getPriorityMenu(panel) {
  return panel?.querySelector("[data-priority-menu]") || null;
}

function getPriorityLabel(panel) {
  return panel?.querySelector("[data-priority-label]") || null;
}

function getPriorityDot(panel) {
  return panel?.querySelector("[data-priority-dot]") || null;
}

function closePriorityMenu(panel) {
  const trigger = getPriorityTrigger(panel);
  const menu = getPriorityMenu(panel);

  if (trigger) {
    trigger.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
  }

  if (menu) {
    menu.classList.add("hidden");
    menu.setAttribute("aria-hidden", "true");
  }
}

function openPriorityMenu(panel) {
  const trigger = getPriorityTrigger(panel);
  const menu = getPriorityMenu(panel);

  if (trigger) {
    trigger.classList.add("is-open");
    trigger.setAttribute("aria-expanded", "true");
  }

  if (menu) {
    menu.classList.remove("hidden");
    menu.setAttribute("aria-hidden", "false");
  }
}

function setPrioritySelection(panel, priority) {
  const select = getPrioritySelect(panel);
  if (!select) return;

  const nextPriority = Object.prototype.hasOwnProperty.call(
    PRIORITY_CONFIG,
    priority,
  )
    ? priority
    : DEFAULT_PRIORITY;
  const config = getPriorityConfig(nextPriority);

  select.dataset.selectedPriority = nextPriority;

  const label = getPriorityLabel(panel);
  if (label) {
    label.textContent = config.label;
  }

  const dot = getPriorityDot(panel);
  if (dot) {
    dot.classList.remove(...PRIORITY_DOT_CLASSES);
    dot.classList.add(config.dotClass);
  }

  const options = panel?.querySelectorAll("[data-priority-option]");
  options?.forEach((option) => {
    const isSelected = option.dataset.priorityOption === nextPriority;
    option.classList.toggle("is-selected", isSelected);
    option.setAttribute("aria-pressed", String(isSelected));
  });
}

function getPrioritySelection(panel) {
  return getPrioritySelect(panel)?.dataset.selectedPriority || DEFAULT_PRIORITY;
}

function bindPriorityDropdowns() {
  if (priorityDropdownsBound) return;
  priorityDropdownsBound = true;

  const priorityPanels = [inputPanel, editorPanel].filter(Boolean);

  priorityPanels.forEach((panel) => {
    panel.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-priority-trigger]");
      if (trigger && panel.contains(trigger)) {
        event.preventDefault();
        event.stopPropagation();

        const menu = getPriorityMenu(panel);
        if (menu?.classList.contains("hidden")) {
          priorityPanels.forEach((otherPanel) => {
            if (otherPanel !== panel) closePriorityMenu(otherPanel);
          });
          openPriorityMenu(panel);
        } else {
          closePriorityMenu(panel);
        }
        return;
      }

      const option = event.target.closest("[data-priority-option]");
      if (option && panel.contains(option)) {
        event.preventDefault();
        event.stopPropagation();

        setPrioritySelection(panel, option.dataset.priorityOption);
        closePriorityMenu(panel);
      }
    });
  });

  document.addEventListener("click", (event) => {
    priorityPanels.forEach((panel) => {
      const select = getPrioritySelect(panel);
      if (!select || select.contains(event.target)) return;
      closePriorityMenu(panel);
    });
  });

  setPrioritySelection(inputPanel, DEFAULT_PRIORITY);
  setPrioritySelection(editorPanel, DEFAULT_PRIORITY);
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

function bindLogoClick() {
  const logo = document.querySelector(".logo");
  if (!logo) return;
  logo.addEventListener("click", () => {
    window.location.reload();
  });
}

function bindAddTaskButton() {
  const taskInputPlaceholder = document.querySelector(
    ".task-input-placeholder",
  );

  if (!taskInputPlaceholder || !inputPanel) return;

  bindPriorityDropdowns();

  taskInputPlaceholder.addEventListener("click", () => {
    setPrioritySelection(inputPanel, DEFAULT_PRIORITY);
    closePriorityMenu(inputPanel);
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
        priority: getPrioritySelection(inputPanel),
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
    setPrioritySelection(editorPanel, todo.priority || DEFAULT_PRIORITY);

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

  bindPriorityDropdowns();

  taskDetailsPanel.addEventListener("click", (event) => {
    const editButton = event.target.closest(".btn-edit");
    if (!editButton) return;

    event.stopPropagation();

    const activeProjectItem = document.querySelector(".project-item.active");
    const todoId = taskDetailsPanel.dataset.todoId;

    if (todoId && activeProjectItem) {
      const projectName = activeProjectItem.dataset.projectName;
      const todo = Storage.getProjectTodos(projectName).find(
        (item) => item.id === todoId,
      );
      if (todo) {
        populateEditor(todo);
      }
    }

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
          priority: getPrioritySelection(editorPanel),
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

    taskDetailsPanel.dataset.todoId = taskCard.dataset.todoId || "";
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

function CancelBtn() {
  const cancelBtn = document.querySelector("#cancelBtn");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      inputPanel.classList.add("hidden");
      const inputs = inputPanel.querySelectorAll("input, textarea");

      inputs.forEach((input) => {
        input.value = "";
      });
    });
  }
}

export const UI = {
  bindNewProjectButton,
  bindAddTaskButton,
  bindPanelCloseButtons,
  bindEditTaskButtons,
  bindTaskCardClicks,
  bindCompleteTaskButtons,
  bindProjectSwitching,
  bindLogoClick,
  updateCurrentProjectHeader,
  CancelBtn,
};
