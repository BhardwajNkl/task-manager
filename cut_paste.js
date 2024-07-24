
import { updateTaskStatus } from "./task.js";
import { showAppMessage, pushTaskInContainer } from "./dom_manipulation.js";
let selectedElementId = null;

export const cut = (elementId) => {
    selectedElementId = elementId;
}

export const paste = (targetContainerId) => {
    if (selectedElementId) {
        // remove from the actual position and append into the target position
        const cutElement = document.getElementById(selectedElementId);
        const targetContainer = document.getElementById(targetContainerId);

        let titleElement = cutElement.querySelector("div h5");
        const title = titleElement.innerHTML;

        // UPDATE THE TASK STATUS ACCORDINGLY
        switch (targetContainerId) {
            case "todo-container": {
                updateTaskStatus(title, "todo");
                break;
            }

            case "doing-container": {
                updateTaskStatus(title, "doing");
                break;
            }

            case "done-container": {
                updateTaskStatus(title, "done");
                break;
            }

            default: {
                alert("Something went wrong!")
            }
        }

        pushTaskInContainer(cutElement, targetContainer);
        showAppMessage("Task moved successfully!", false);
        selectedElementId = null;
    } else {
        showAppMessage("Please cut a task first!", true);
    }
}