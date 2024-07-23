import { deleteTask } from "./task.js";

export function toggleTaskFormVisibility() {
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
                                    <span>assignee:${task.assignee}</span>
                                    <span>due date: ${shortDueDate}</span>
                                    <span>priority:${task.priority}</span>
                                </div>
                            <div> 
                        </div>`;

    // CREATE EDIT BUTTON
    const editButton = document.createElement("button");
    editButton.className = "task-action-button";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", function () {
        console.log("edit on[currently operation not coded]: ", task.title);
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
    buttonContainer.appendChild(editButton);
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

