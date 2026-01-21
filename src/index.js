import "./styles/style.css";
import { newProjectClickEvent, addProject, addTaskEvent, closePanelEvent, editTaskEvent, taskCardClickEvent, completeTaskEvent } from "./js/ui";
import { addNewProject } from "./js/handleProject";

// UI
newProjectClickEvent();
addProject();
addTaskEvent();
closePanelEvent();
editTaskEvent();
taskCardClickEvent();
completeTaskEvent();

// Handle Project
addNewProject();