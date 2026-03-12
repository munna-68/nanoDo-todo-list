/* ----------------------------------
   Constants & Selectors
   ---------------------------------- */
const HIDDEN_CLASS = "hidden";

export const projectForm = document.querySelector(".add-project-form");
export const inputPanel = document.querySelector(".input-panel");
export const editorPanel = document.querySelector(".editor-panel");
export const taskDetailsPanel = document.querySelector(".task-details-panel");
export const panels = [inputPanel, editorPanel, taskDetailsPanel].filter(
  Boolean,
);

/* ----------------------------------
   Panel Management Helpers
   ---------------------------------- */
function showPanel(activePanel) {
  panels.forEach((panel) => {
    panel.classList.toggle(HIDDEN_CLASS, panel !== activePanel);
  });
}

function hidePanel(panel) {
  panel?.classList.add(HIDDEN_CLASS);
}

/* ----------------------------------
   Project Sidebar Helpers
   ---------------------------------- */
function toggleActiveProject(projectItem) {
  const allProjectItems = document.querySelectorAll(".project-item");
  allProjectItems.forEach((item) => {
    item.classList.remove("active");
  });
  projectItem.classList.add("active");
}

/* ----------------------------------
   Event binding functions
   ---------------------------------- */

function bindNewProjectButton() {
  const newProjectButton = document.querySelector(".btn-new-project");

  if (!newProjectButton || !projectForm) return;

  newProjectButton.addEventListener("click", () => {
    projectForm.classList.remove(HIDDEN_CLASS);
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

  if (taskList && editorPanel) {
    taskList.addEventListener("click", (event) => {
      const editButton = event.target.closest(".btn-edit");
      if (!editButton) return;

      event.stopPropagation();
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
}

function bindTaskCardClicks() {
  const taskList = document.querySelector(".task-list");

  if (!taskList || !taskDetailsPanel) return;

  taskList.addEventListener("click", (event) => {
    if (event.target.closest(".btn-edit, .btn-delete, .checkbox-circle")) {
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

function bindProjectSwitching() {
  const projectList = document.querySelector(".project-list");

  if (!projectList) return;

  projectList.addEventListener("click", (event) => {
    const projectItem = event.target.closest(".project-item");
    if (!projectItem) return;

    toggleActiveProject(projectItem);
  });
}

/* ----------------------------------
   Public API
   ---------------------------------- */
export const UI = {
  bindNewProjectButton,
  bindAddTaskButton,
  bindPanelCloseButtons,
  bindEditTaskButtons,
  bindTaskCardClicks,
  bindCompleteTaskButtons,
  bindProjectSwitching,
};
