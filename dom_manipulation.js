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

function appendTaskInContainer(taskCardElement, taskStatus) {
    switch (taskStatus) {
        case "todo": {
            document.querySelector("#todo-container").appendChild(taskCardElement);
            break;
        }
        case "doing": {
            document.querySelector("#doing-container").appendChild(taskCardElement);
            break;
        }
        case "done": {
            document.querySelector("#done-container").appendChild(taskCardElement);
            break;
        }

        default: {
            document.querySelector("#todo-container").appendChild(taskCardElement);
        }
    }
}

function removeTask(taskCardElementId) {
    const element = document.getElementById(taskCardElementId);
    if (element) {
        element.remove();
    }
}


export function showTaskOnPage(task) {
    task.dueDate = new Date(task.dueDate);
    let day = task.dueDate.getDate();
    let month = task.dueDate.getMonth() + 1; // Months are zero-based, so add 1
    let year = task.dueDate.getFullYear();
    day = day < 10 ? '0' + day : day; // ensure 2 digit format for date and month
    month = month < 10 ? '0' + month : month;

    let shortDueDate = `${day}-${month}-${year}`;

    /**
     * LET'S CREATE A DIV FOR THIS TASK.
     * WE ALSO PROVIDE ADD EDIT/DELETE BUTTONS TO THIS DIV.
     * THEN, WE WILL ADD THE EVENT LISTENERS FOR TOGGLING BUTTON VISIBILITY AND ALSO FOR EDIT/DELETE OPERATIONS HERE ITSELF.
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
                                    <span>Assigned To:${task.assignee}</span><br>
                                    <span>${shortDueDate}</span>
                                    <span>${task.priority}</span>
                                </div>
                            <div> 
                        </div>`;

    // CREATE CUT BUTTON
    const cutButton = document.createElement("button");
    cutButton.className = "task-action-button";
    cutButton.textContent = "Cut";
    cutButton.addEventListener("click", function () {
        // console.log("cut on[currently operation not coded]: ", task.title);
        cut(task.title);
    });

    // CREATE DELETE BUTTON
    const deleteButton = document.createElement("button");
    deleteButton.className = "task-action-button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function () {
        deleteTask(task.title);
        removeTask(task.title);
        alert("deleted!")
    });

    // APPEND THE BUTTONS TO THE BUTTON CONTAINER
    const buttonContainer = newCard.querySelector(".task-action-button-container");
    buttonContainer.appendChild(cutButton);
    buttonContainer.appendChild(deleteButton);

    // EVENT LISTENER FOR SHOWING/HIDING THE EDIT/DELETE BUTTONS
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

    // APPEND THIS TASK TO DOM
    appendTaskInContainer(newCard, task.status);
}


export function highlightMatchingTask(searchText) {
    // searching based on title
    const taskCardElements = document.querySelectorAll(".task-card");
    taskCardElements.forEach(taskCardElement => {
        // get title element
        const titleElement = taskCardElement.querySelector(".card-title");
        const title = titleElement.textContent.toLocaleLowerCase();
        if (searchText.length > 0 && title.includes(searchText)) {
            taskCardElement.classList.add("highlight");
        } else if (searchText.length > 0 && !title.includes(searchText)) {
            taskCardElement.classList.remove("highlight");
        } else {
            taskCardElement.classList.remove("highlight");
        }
    })
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
    // validate the title: should be non-empty and unique
    const formMessageElement = document.getElementById("form-message");
    if (title.length === 0) {
        formMessageElement.querySelector("span").textContent = "Title cannot be empty!"
        formMessageElement.classList.remove("inactive");
        formMessageElement.classList.add("error");

        // also add listner on the remove error icon
        // EVENT BINDING ON REMOVE-ERROR BUTTON
        document.getElementById("remove-message").addEventListener("click", () => {
            formMessageElement.querySelector("span").textContent = "";
            formMessageElement.classList.add("inactive");
        })

        return false;
    }

    if (taskExistsByTitle(title)) {
        // console.log("task with given title already exists");
        formMessageElement.querySelector("span").textContent = "Task with given title already exists!"
        formMessageElement.classList.remove("inactive");
        formMessageElement.classList.add("error");

        // also add listner on the remove error icon
        // EVENT BINDING ON REMOVE-ERROR BUTTON
        document.getElementById("remove-message").addEventListener("click", () => {
            formMessageElement.querySelector("span").textContent = "";
            formMessageElement.classList.add("inactive");
        })


        return false;
    }

    formMessageElement.classList.add("inactive");
    formMessageElement.classList.remove("error");

    formMessageElement.querySelector("span").textContent = "";
    return true;
}