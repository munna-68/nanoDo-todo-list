const newProjectBtn = document.querySelector(".btn-new-project");
const formGroup = document.querySelector(".form-group");
const taskInput = document.querySelector(".task-input-placeholder");
const inputPanel = document.querySelector(".input-panel");
const panel = document.querySelector(".pannel");
const editBtn = document.querySelector(".btn-edit");
const deleteBtn = document.querySelector(".btn-delete");
const editorPanel = document.querySelector(".editor-panel");
const taskCard = document.querySelectorAll(".task-card");
const taskDetailsPanel = document.querySelector(".task-details-panel");
const checkboxCircle = document.querySelectorAll(".checkbox-circle");

export function newProjectClickEvent() {
  newProjectBtn.addEventListener("click", () => {
    formGroup.classList.remove("hidden");
  });
}

export function addProject() {
  formGroup.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    if (e.key === "Enter") {
      formGroup.classList.add("hidden");
    }
  });
}

export function addTaskEvent() {
  taskInput.addEventListener("click", () => {
    inputPanel.classList.remove("hidden");
    editorPanel.classList.add("hidden");
    taskDetailsPanel.classList.add("hidden");
  });
}

export function closePanelEvent() {
  const btnClosePanel = document.querySelectorAll(".btn-close-panel");
  btnClosePanel.forEach((btn) => {
    btn.addEventListener("click", () => {
      const panel = btn.closest(".pannel");
      panel.classList.add("hidden");
    });
  });
}

export function editTaskEvent() {
  editBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    editorPanel.classList.remove("hidden");
    inputPanel.classList.add("hidden");
    taskDetailsPanel.classList.add("hidden");
  });
}

export function taskCardClickEvent() {
  taskCard.forEach((card) =>
    card.addEventListener("click", () => {
      taskDetailsPanel.classList.remove("hidden");
      editorPanel.classList.add("hidden");
      inputPanel.classList.add("hidden");
    }),
  );
}

export function completeTaskEvent() {
  checkboxCircle.forEach((checkBox) =>
    checkBox.addEventListener("click", (e) => {
      e.stopPropagation();

      const card = checkBox.closest(".task-card");
      const badge = card.querySelector(".badge");

      card.classList.toggle("task-card--completed");
      checkBox.classList.toggle("completed");
      badge.classList.toggle("badge--grey");
    }),
  );
}
