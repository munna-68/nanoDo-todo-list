/* ----------------------------------
   Imports
   ---------------------------------- */
import { Storage } from "./storage.js";

/* ----------------------------------
   Event binding
   ---------------------------------- */
function bindDeleteProjectButton() {
  const deleteProjectButton = document.querySelector(".btn-icon-delete");

  if (!deleteProjectButton) return;

  deleteProjectButton.addEventListener("click", () => {
    const activeProjectItem = document.querySelector(".project-item.active");
    if (!activeProjectItem) return;

    // project name is stored on the list item dataset now
    const projectName = activeProjectItem.dataset.projectName;

    if (!projectName) return;

    const confirmDelete = confirm(
      `Are you sure you want to delete the project "${projectName}"? This action cannot be undone.`,
    );
    if (!confirmDelete) return;

    Storage.deleteProject(projectName);
    activeProjectItem.remove();

    const taskList = document.querySelector(".task-list");
    if (taskList) {
      taskList.innerHTML = "";
    }
  });
}

/* ----------------------------------
   Public API
   ---------------------------------- */
export const DeleteProject = {
  bindDeleteProjectButton,
};
