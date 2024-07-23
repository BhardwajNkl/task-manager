let tasks = [];

export function loadTasks() {
    let tasksFromStorage = localStorage.getItem("task_list");
    if (tasksFromStorage) {
        tasks = JSON.parse(tasksFromStorage);
    }
    return tasks;
}

export function createTask(task) {
    tasks.push(task);
    localStorage.setItem("task_list", JSON.stringify(tasks));
}

export function updateTaskStatus(taskTitle, newStatus) {
    tasks = tasks.map(task => {
        if (task.title === taskTitle) {
            task.status = newStatus;
            return task;
        } else {
            return task;
        }
    });
    localStorage.setItem("task_list", JSON.stringify(tasks));
}

export function deleteTask(taskTitle) {
    tasks = tasks.filter(task => task.title !== taskTitle);
    localStorage.setItem("task_list", JSON.stringify(tasks));
}

