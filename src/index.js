/* ----------------------------------
   Entry point: import side‑effect styles and modules
   ---------------------------------- */
import "./styles/style.css";
import { UI } from "./js/ui";
import { Storage } from "./js/storage";
import { DeleteProject } from "./js/deleteProject";

/* ----------------------------------
   Preloader
   ---------------------------------- */
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    setTimeout(() => {
      preloader.style.opacity = "0";
      preloader.style.visibility = "hidden";
      setTimeout(() => {
        preloader.remove();
      }, 500);
    }, 1500);
  }
});

/* ----------------------------------
   Initialization
   ---------------------------------- */

// restore persisted projects and render sidebar
Storage.loadProjects();

// UI event bindings
UI.bindNewProjectButton();
UI.bindAddTaskButton();
UI.bindPanelCloseButtons();
UI.bindEditTaskButtons();
UI.bindTaskCardClicks();
UI.bindCompleteTaskButtons();
UI.bindProjectSwitching();
UI.bindLogoClick();
UI.CancelBtn();

// storage-related bindings
Storage.bindNewProjectForm();

// project deletion handler
DeleteProject.bindDeleteProjectButton();
