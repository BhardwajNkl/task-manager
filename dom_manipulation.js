import { deleteTask, taskExistsByTitle } from "./task.js";
import { cut } from "./cut_paste.js";

export function toggleTaskFormVisibility() {
    // first of all, let's remove form-message if it is present
    const formMessageElement = document.getElementById("form-message");
    formMessageElement.querySelector("span").textContent = "";
    formMessageElement.classList.remove("error"); // in case error class is added
    formMessageElement.classList.add("inactive");

    // now remove the form container
    const createTaskFormContainer = document.getElementById("create-task-form-container");
    if (createTaskFormContainer.classList.contains("inactive")) {
        createTaskFormContainer.classList.remove("inactive");
    } else {
        createTaskFormContainer.classList.add("inactive");
    }
}

export function pushTaskInContainer(taskCardElement, containerElement) {
    switch (containerElement.getAttribute("id")) {
        case "todo-container": {
            // push as 2nd child. because create-task button is the first child
            if (containerElement.children.length > 1) {
                containerElement.insertBefore(taskCardElement, containerElement.children[1]);
            } else {
                containerElement.appendChild(taskCardElement);
            }
            break;
        }
        case "doing-container": {
            // push as first child
            if (containerElement.firstChild) {
                containerElement.insertBefore(taskCardElement, containerElement.firstChild);
            } else {
                containerElement.appendChild(taskCardElement);
            }
            break;
        }
        case "done-container": {
            // push as first child
            if (containerElement.firstChild) {
                containerElement.insertBefore(taskCardElement, containerElement.firstChild);
            } else {
                containerElement.appendChild(taskCardElement);
            }
            break;
        }

        default: {

        }
    }
}

function pushTaskHelper(taskCardElement, taskStatus) {
    let containerElement = null;
    switch (taskStatus) {
        case "todo": {
            containerElement = document.querySelector("#todo-container");
            break;
        }
        case "doing": {
            containerElement = document.querySelector("#doing-container");
            break;
        }
        case "done": {
            containerElement = document.querySelector("#done-container");
            break;
        }

        default: {
            containerElement = document.querySelector("#todo-container");
        }
    }

    pushTaskInContainer(taskCardElement, containerElement);

}

function removeTask(taskCardElementId) {
    const element = document.getElementById(taskCardElementId);
    if (element) {
        element.remove();
    }
}


export function showFormMessage(message, isError) {
    const formMessageElement = document.getElementById("form-message");

    // remove error class if it is already present
    if (formMessageElement.classList.contains("error")) {
        formMessageElement.classList.remove("error");
    }

    formMessageElement.querySelector("span").textContent = message;
    formMessageElement.classList.remove("inactive");
    if (isError) {
        formMessageElement.classList.add("error");

    }

    // also add listner on the remove message icon
    document.getElementById("remove-form-message").addEventListener("click", () => {
        formMessageElement.querySelector("span").textContent = "";
        formMessageElement.classList.remove("error");
        formMessageElement.classList.add("inactive");
    });
}


export function showAppMessage(message, isError) {
    const appMessage = document.getElementById("app-message");


    // remove error class if it is already present
    if (appMessage.classList.contains("error")) {
        appMessage.classList.remove("error");
    }

    appMessage.querySelector("span").textContent = message;
    appMessage.classList.remove("inactive");

    if (isError) {
        appMessage.classList.add("error");
    }

    // also add listner on the remove message icon
    document.getElementById("remove-app-message").addEventListener("click", () => {
        appMessage.querySelector("span").textContent = "";
        appMessage.classList.remove("error");
        appMessage.classList.add("inactive");
    })
}


export function showTaskOnPage(task) {
    task.dueDate = new Date(task.dueDate);
    let day = task.dueDate.getDate();
    let month = task.dueDate.getMonth() + 1;
    let year = task.dueDate.getFullYear();
    day = day < 10 ? '0' + day : day; // ensure 2 digit format for date and month
    month = month < 10 ? '0' + month : month;

    let shortDueDate = `${day}-${month}-${year}`;

    /**
     * LET'S CREATE A DIV FOR THIS TASK.
     * WE ALSO PROVIDE ADD CUT/DELETE BUTTONS TO THIS DIV.
     * THEN, WE WILL ADD THE EVENT LISTENERS FOR TOGGLING BUTTON VISIBILITY AND ALSO FOR CUT/DELETE OPERATIONS HERE ITSELF.
     * AND THEN FINALLY, WE APPEND THIS TASK DIV INTO A TASK CONTAINER.
     */
    let newCard = document.createElement("div");
    newCard.setAttribute("id", task.title);
    newCard.setAttribute("draggable", "true");
    newCard.classList.add("card", "task-card");

    newCard.innerHTML = `<div class="card-body">
                            <div class="task-card-header">
                                <h5 class="card-title">${task.title}</h5>
                                <div class="task-action-div">
                                    <div class="task-action-button-container inactive">
                                        </div>
                                            <div>
                                                <i class="task-action-toggle-button fa-solid fa-ellipsis"></i>
                                            </div>
                                        </div>
                                    </div>

                                    <p class="card-text">${task.description}</p>
                                    <span class="assignee">Assignee: ${task.assignee}</span><br>
                                    <span class="priority">Priority: ${task.priority}</span><br>
                                    <span class="due-date">Due Date: ${shortDueDate}</span>
                                </div>
                            <div> 
                        </div>`;

    // CREATE CUT BUTTON
    const cutButton = document.createElement("button");
    cutButton.className = "task-action-button";
    cutButton.textContent = "Cut";
    cutButton.addEventListener("click", function () {
        cut(task.title);
    });

    // CREATE DELETE BUTTON
    const deleteButton = document.createElement("button");
    deleteButton.className = "task-action-button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function () {
        deleteTask(task.title);
        removeTask(task.title);
        // show app message
        showAppMessage("Task deleted successfully!", false);

    });

    // APPEND THE BUTTONS TO THE BUTTON CONTAINER
    const buttonContainer = newCard.querySelector(".task-action-button-container");
    buttonContainer.appendChild(cutButton);
    buttonContainer.appendChild(deleteButton);

    // EVENT LISTENER FOR SHOWING/HIDING THE CUT/DELETE BUTTONS
    const taskActionToggleButton = newCard.querySelector(".task-action-toggle-button");
    taskActionToggleButton.addEventListener("click", () => {
        const taskActionButtonContainer = newCard.querySelector(".task-action-button-container");
        if (taskActionButtonContainer.classList.contains("inactive")) {
            taskActionButtonContainer.classList.remove("inactive");
        } else {
            taskActionButtonContainer.classList.add("inactive");
        }
    });

    // ADD EVEN LISTNER FOR DRAG START ON THIS TASK
    newCard.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("text/plain", task.title);
    });

    // APPEND THIS TASK TO DOM. The below function first finds the target container and then calls the actual pushTaskInContainer function.
    pushTaskHelper(newCard, task.status);
}


export function highlightMatchingTask(searchText) {
    searchText = searchText.toLocaleLowerCase();
    // searching based on title
    const taskCardElements = document.querySelectorAll(".task-card");
    let matchCount = 0; // for showing to user
    taskCardElements.forEach(taskCardElement => {
        // get title element
        const titleElement = taskCardElement.querySelector(".card-title");
        const title = titleElement.textContent.toLocaleLowerCase();
        if (searchText.length > 0 && title.includes(searchText)) {
            taskCardElement.classList.add("highlight");
            matchCount += 1;
        } else if (searchText.length > 0 && !title.includes(searchText)) {
            taskCardElement.classList.remove("highlight");
        } else {
            taskCardElement.classList.remove("highlight");
        }
    });

    // NEED WORK ON THIS PART: WHEN SEARCH TEXT LENGTH 0, REMOVE MATCH COUNT MESSAGE
    if (searchText.length > 0 && matchCount) {
        showAppMessage(matchCount.toString() + " Task(s) found!", false);
    } else if (searchText.length > 0) {
        showAppMessage("No match found!", true);
    }
}


export function clearCreateTaskForm() {
    const form = document.querySelector("#new-task-form");
    const formControls = form.querySelectorAll("[name]");
    formControls.forEach(formControl => {
        if (formControl.tagName === "SELECT") {
            formControl.value = "low";
        }
        else {
            formControl.value = "";
        }
    })
}

export function validateTaskTitle(title) {
    // the title should be non-empty and unique
    if (title.length === 0) {
        showFormMessage("Title cannot be empty!", true);
        return false;
    }

    if (taskExistsByTitle(title)) {
        showFormMessage("Task with given title already exists!", true);
        return false;
    }
    return true;
}