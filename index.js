
// dummy data to get started
// let tasks = [
//     {
//         title: "Complete Project Report",
//         description: "Compile and finalize the quarterly project report for the management meeting.",
//         dueDate: new Date(),
//         priority: "high",
//         assignee: "Alice",
//         status: "todo"
//     },
//     {
//         title: "Client Meeting",
//         description: "Schedule and prepare for the client meeting to discuss project requirements and expectations.",
//         dueDate: new Date(),
//         priority: "medium",
//         assignee: "Bob",
//         status: "done"
//     },
//     {
//         title: "Code Review",
//         description: "Review the latest code commits and provide feedback to the development team.",
//         dueDate: new Date(),
//         priority: "low",
//         assignee: "Charlie",
//         status: "todo"
//     },
//     {
//         title: "Team Building Activity",
//         description: "Organize a team building activity to enhance team cohesion and morale.",
//         dueDate: new Date(),
//         priority: "medium",
//         assignee: "David",
//         status: "doing"
//     }
// ]
let selected=null; // global variable to keep track of selected drag element
let tasks = [];
let tasksFromStorage = localStorage.getItem("task_list");
if(tasksFromStorage){
    tasks = JSON.parse(tasksFromStorage);
}

console.log("Localstorage task list: ", tasks);



/**
 * 
 * @param {*} date date of task creation
 * @param {*} estimatedTime estimated number of days for the task completion
 * @returns effective task due date
 * IT WAS USED INITIALLY, BU NOT IN USE IN THIS SCRIPT RIGHT NOW
 */
function getDueDate(date, estimatedTime) {
    let dueDate = new Date(date);
    dueDate.setDate(dueDate.getDate() + estimatedTime);
    return dueDate;
}

/**
 * 
 * @param {*} taskCardElement HTML element reprsenting the task as a card
 * @param {*} taskContainerElementId Id of the element in which this task is to be appended
 */
function appendTaskInContainer(taskCardElement, taskContainerElementId) {
    const taskContainerElement = document.querySelector("#" + taskContainerElementId);
    taskContainerElement.appendChild(taskCardElement);
}

function removeTaskFromContainer(taskCardElement, taskContainerElementId){
    const taskContainerElement = document.querySelector("#" + taskContainerElementId);
    taskContainerElement.removeChild(taskCardElement);
}

function toggleTaskFormVisibility(){
    const createTaskFormContainer = document.getElementById("create-task-form-container");
    if(createTaskFormContainer.classList.contains("inactive")){
        createTaskFormContainer.classList.remove("inactive");
    } else{
        createTaskFormContainer.classList.add("inactive");
    }
}

function updateTaskStatus(taskTitle, newStatus){
    tasks = tasks.map(task=>{
        if(task.title===taskTitle){
            task.status = newStatus;
            return task;
        } else{
            return task;
        }
    });
    localStorage.setItem("task_list",JSON.stringify(tasks));
}

function deleteTask(taskCardElement, taskTitle){
    // remove from dom: task status may have changed, so lets first get the task
    const task = tasks.find(task=>task.title===taskTitle);
    switch (task.status) {
        case "todo": {
            removeTaskFromContainer(taskCardElement, "todo-container");
            break;
        }
        case "doing": {
            removeTaskFromContainer(taskCardElement, "doing-container");
            break;
        }
        case "done": {
            removeTaskFromContainer(taskCardElement, "done-container");
            break;
        }

        default: {
            removeTaskFromContainer(taskCardElement, "todo-container");
        }
    }



    // remove from tasks array
    tasks = tasks.filter(task=>task.title!==taskTitle);
    localStorage.setItem("task_list",JSON.stringify(tasks));
}

function showTaskOnPage(task){
    // GETTING ERROR ON THE FOLLOWING LINE BECAUSE DUE DATE IS A STRING AND NOT A DATE OBJECT. CHECK WHY?
    // FOR NOW, LET'S JUST CONSTRUCT THE DATE OBJECT
    task.dueDate = new Date(task.dueDate);
    let day = task.dueDate.getDate();
    let month = task.dueDate.getMonth() + 1; // Months are zero-based, so add 1
    let year = task.dueDate.getFullYear();
    day = day < 10 ? '0' + day : day; // ensure 2 digit format for date and month
    month = month < 10 ? '0' + month : month;

    let shortDueDate = `${day}-${month}-${year}`;

    // create a card for this todo
    let newCard = document.createElement("div");
    newCard.setAttribute("draggable","true")
    newCard.classList.add("card", "task-card");

    newCard.innerHTML = `<div class="card-body">
                        <div id="task-card-header">
                            <h5 class="card-title">${task.title}</h5>
                            <div id="task-action-div">
                            <div id="task-action-button-container" class="inactive">
                            </div>
                                <div>
                                    <i id="task-action-toggle-button" class="fa-solid fa-ellipsis"></i>
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

    // Create the edit button
const editButton = document.createElement("button");
editButton.className = "task-action-button";
// editButton.dataset.taskId = task.title;
editButton.textContent = "Edit";
editButton.addEventListener("click", function() {
    console.log("Edit button clicked for task:", task.title);
    // Add your edit logic here
});

// Create the delete button
const deleteButton = document.createElement("button");
deleteButton.className = "task-action-button";
deleteButton.textContent = "Delete";
deleteButton.addEventListener("click", function() {
    console.log("Delete button clicked for task:", task.title);
    // Add your delete logic here
    deleteTask(newCard, task.title);
    alert("deleted!")
});

// Append the buttons to the button container
const buttonContainer = newCard.querySelector("#task-action-button-container");
buttonContainer.appendChild(editButton);
buttonContainer.appendChild(deleteButton);

// event listener on task-action toggle
const taskActionToggleButton = newCard.querySelector("#task-action-toggle-button");
taskActionToggleButton.addEventListener("click",()=>{
    console.log("inside toggle");
    const taskActionButtonContainer = newCard.querySelector("#task-action-button-container");
    if(taskActionButtonContainer.classList.contains("inactive")){
        console.log("inside if")
        taskActionButtonContainer.classList.remove("inactive");
    } else{
        console.log("inside else")
        taskActionButtonContainer.classList.add("inactive");
    }
})

    /**
     * add event listener for drag
     */
    newCard.addEventListener("dragstart", (event)=>{
        selected = event.target;
    });

    // append this task to respective container
    switch (task.status) {
        case "todo": {
            appendTaskInContainer(newCard, "todo-container");
            break;
        }
        case "doing": {
            appendTaskInContainer(newCard, "doing-container");
            break;
        }
        case "done": {
            appendTaskInContainer(newCard, "done-container");
            break;
        }

        default: {
            appendTaskInContainer(newCard, "todo-container");
        }
    }
}

// drag drop
// we need to dragover and drop on all three: todo-container, doing-container or done-container. so add listeners on both.

const todoContainer = document.getElementById("todo-container");
todoContainer.addEventListener("dragover",(event)=>{
    event.preventDefault();    
});

todoContainer.addEventListener("drop",(event)=>{
    // NOTE: UPDATE THE TASK STATUS ACCORDINGLY
    // get title. using this we will update the object in the tasks array.
    let titleElement = selected.querySelector("div h5");
    const title = titleElement.innerHTML; // WHEN WE DRAG-DROP FOR 2ND TIME, WHY AT THIS LINE selected = null?
    updateTaskStatus(title,"todo");
    todoContainer.appendChild(selected);
    selected = null;
});

const doingContainer = document.getElementById("doing-container");
doingContainer.addEventListener("dragover",(event)=>{
    event.preventDefault();    
});

doingContainer.addEventListener("drop",(event)=>{
    // NOTE: UPDATE THE TASK STATUS ACCORDINGLY
    // get title. using this we will update the object in the tasks array.
    let titleElement = selected.querySelector("div h5");
    const title = titleElement.innerHTML;
    updateTaskStatus(title,"doing");
    doingContainer.appendChild(selected);
    selected = null;
});


const doneContainer = document.getElementById("done-container");
doneContainer.addEventListener("dragover",(event)=>{
    event.preventDefault();
});

doneContainer.addEventListener("drop",(event)=>{
    // NOTE: UPDATE THE TASK STATUS ACCORDINGLY
    // get title. using this we will update the object in the tasks array.
    let titleElement = selected.querySelector("div h5");
    const title = titleElement.innerHTML;
    updateTaskStatus(title, "done");
    doneContainer.appendChild(selected);
    selected = null;
});

function createTask(task){
    tasks.push(task);

    // modify local storage data
    localStorage.setItem("task_list",JSON.stringify(tasks));

    // show task
    showTaskOnPage(task);

}


// get create task button
const createTaskButton = document.getElementById("create-task-button");
createTaskButton.addEventListener("click",()=>{
    toggleTaskFormVisibility();
})

// remove form
document.getElementById("remove-form-button").addEventListener("click",()=>{
    toggleTaskFormVisibility();
})

// new task submit
document.getElementById("create-task-submit-button").addEventListener("click",()=>{
    // get form data
    const form = document.getElementById("new-task-form");
    const title = form["task-title"].value;
    const description = form["task-description"].value;
    const assignee = form["task-assignee"].value;
    const dueDate = form["task-due-date"].value;
    const priority = form["task-priority"].value;
    // console.log(title, description, assignee,dueDate,priority);

    // create task object: with status as todo and date constructed using given date string
    let newTask = {title, description, assignee, dueDate: new Date(dueDate), priority, status:"todo"};

    // call createTask function
    createTask(newTask);
})

for (let task of tasks) {
    showTaskOnPage(task);
}
