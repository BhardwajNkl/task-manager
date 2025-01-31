/**
 * when document is loaded:
 *  1. load and show all available tasks
 *  2. various event bindings
 *  3. enable each task container for dragover and drop events
 */

import { loadTasks, updateTaskStatus, createTask } from "./task.js";
import { showTaskOnPage, toggleTaskFormVisibility, highlightMatchingTask, clearCreateTaskForm, validateTaskTitle, showFormMessage, pushTaskInContainer } from "./dom_manipulation.js";
import { paste } from "./cut_paste.js";

document.addEventListener("DOMContentLoaded", () => {

    // 1. LOAD AND SHOW TASKS
    const tasks = loadTasks();
    for (let task of tasks) {
        showTaskOnPage(task);
    }

    // 2. EVENT BINDING ON CREATE-TASK FORM OPENER AND CLOSER BUTTONS
    document.getElementById("create-task-button").addEventListener("click", () => {
        toggleTaskFormVisibility();
    });

    document.getElementById("remove-form-button").addEventListener("click", () => {
        toggleTaskFormVisibility();
    });

    // 3. EVENT BINDING ON CREATE-TASK FORM SUBMIT BUTTON
    document.getElementById("create-task-submit-button").addEventListener("click", () => {
        const form = document.getElementById("new-task-form");
        const title = form["task-title"].value;

        // validate the title
        if (!validateTaskTitle(title)) {
            return;
        }

        const description = form["task-description"].value;
        const assignee = form["task-assignee"].value;
        const dueDate = form["task-due-date"].value;
        const priority = form["task-priority"].value;

        const newTask = { title, description, assignee, dueDate: new Date(dueDate), priority, status: "todo" };

        createTask(newTask);

        showFormMessage("Task created successfully!", false); // false indicates that it is not an error message

        showTaskOnPage(newTask);
    });

    // 4. EVENT BINDING ON CREATE-TASK FORM CLEAR BUTTON
    document.getElementById("create-task-clear-button").addEventListener("click", () => {
        clearCreateTaskForm();
    })

    // 5. EVENT BINDING ON SEARCH INPUT
    document.getElementById("search-task").addEventListener("input", (event) => {
        const searchText = event.target.value;
        highlightMatchingTask(searchText);
    });

    // 6. DRAGOVER AND DROP EVENT BINDING ON EACH TASK CONTAINER
    const todoContainer = document.getElementById("todo-container");
    todoContainer.addEventListener("dragover", (event) => {
        event.preventDefault();
    });

    todoContainer.addEventListener("drop", (event) => {
        event.preventDefault();
        const dragSourceElementId = event.dataTransfer.getData("text/plain");

        const selected = document.getElementById(dragSourceElementId);
        let titleElement = selected.querySelector("div h5");
        const title = titleElement.innerHTML;
        // UPDATE THE TASK STATUS ACCORDINGLY
        updateTaskStatus(title, "todo");
        pushTaskInContainer(selected, todoContainer);
    });

    const doingContainer = document.getElementById("doing-container");
    doingContainer.addEventListener("dragover", (event) => {
        event.preventDefault();
    });

    doingContainer.addEventListener("drop", (event) => {
        event.preventDefault();
        const dragSourceElementId = event.dataTransfer.getData("text/plain");

        const selected = document.getElementById(dragSourceElementId);
        let titleElement = selected.querySelector("div h5");
        const title = titleElement.innerHTML;
        // NOTE: UPDATE THE TASK STATUS ACCORDINGLY
        updateTaskStatus(title, "doing");
        pushTaskInContainer(selected, doingContainer);
    });

    const doneContainer = document.getElementById("done-container");
    doneContainer.addEventListener("dragover", (event) => {
        event.preventDefault();
    });

    doneContainer.addEventListener("drop", (event) => {
        event.preventDefault();
        const dragSourceElementId = event.dataTransfer.getData("text/plain");

        const selected = document.getElementById(dragSourceElementId);
        let titleElement = selected.querySelector("div h5");
        const title = titleElement.innerHTML;
        // NOTE: UPDATE THE TASK STATUS ACCORDINGLY
        updateTaskStatus(title, "done");
        pushTaskInContainer(selected, doneContainer);
    });

    // 7. PASTE BUTTONS EVENT BINDING
    const pasteButtons = document.querySelectorAll(".task-paste-button");
    for (const button of pasteButtons) {
        button.addEventListener("click", () => {
            // alert(button.getAttribute("id"));
            const targetContainerId = button.getAttribute("data-paste-container");
            paste(targetContainerId);
        });
    }
});