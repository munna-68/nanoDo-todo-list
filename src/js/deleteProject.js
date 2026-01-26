import { deleteProjectFromStorage } from "./storage.js";

const deleteProjectBtn = document.querySelector("btn-icon-delete");

function deleteProjectEvent() {
  deleteProjectBtn.addEventListener("click", () => {
    const activeProjectItem = document.querySelector(".project-item.active");
    if (!activeProjectItem) return;

    const projectName =
      activeProjectItem.querySelector(".project-name").textContent;

    // Confirm deletion
    const confirmDelete = confirm(
      `Are you sure you want to delete the project "${projectName}"? This action cannot be undone.`,
    );
    if (!confirmDelete) return;

    // Delete from storage
    deleteProjectFromStorage(projectName);

    // Remove from UI
    activeProjectItem.remove();

    // Optionally, you might want to clear the task list or switch to a default project
    const taskList = document.querySelector(".task-list");
    taskList.innerHTML = "";
  });
}

export { deleteProjectEvent };
