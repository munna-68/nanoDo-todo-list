import "./styles/style.css";
import {
  newProjectClickEvent,
  addProject,
  addTaskEvent,
  closePanelEvent,
  editTaskEvent,
  taskCardClickEvent,
  completeTaskEvent,
  switchProjectEvent,
} from "./js/ui";
import { addNewProject } from "./js/storage";

// UI
newProjectClickEvent();
addProject();
addTaskEvent();
closePanelEvent();
editTaskEvent();
taskCardClickEvent();
completeTaskEvent();
switchProjectEvent();

// Handle Todo
addNewProject();
