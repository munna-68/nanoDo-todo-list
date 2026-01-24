import "./styles/style.css";
import {
  newProjectClickEvent,
  addProject,
  addTaskEvent,
  closePanelEvent,
  editTaskEvent,
  taskCardClickEvent,
  completeTaskEvent,
} from "./js/ui";
import { addTodoToProject } from "./js/storage";

// UI
newProjectClickEvent();
addProject();
addTaskEvent();
closePanelEvent();
editTaskEvent();
taskCardClickEvent();
completeTaskEvent();

// Handle Todo
addTodoToProject();
