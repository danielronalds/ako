/**
 * This module contains all the export functions to do with setting up listeners on the DOM
 *
 * @author Daniel R
 */
import {
    addList,
    addTask, cleanupAgendaTasks,
    completeAgendaTask,
    completeTask, deleteList, deleteTask,
    moveTaskToAgenda,
    restartAgendaTask,
    restartTask
} from "./operations.ts";

/**
 * Sets up the listeners for the tab buttons on the side panel, allowing them to change the content of the panel
 */
export function setupTabButtons() {
    let listPanel = document.getElementById("list-panel");
    let agendaPanel = document.getElementById("agenda-panel");
    if (listPanel == null || agendaPanel == null) return;
    listPanel.style.display = "none";

    document.querySelector("#agenda-tab")?.addEventListener("click", () => {
        if (listPanel == null || agendaPanel == null) return;
        listPanel.style.display = "none";
        agendaPanel.style.display = "block";
    });

    document.querySelector("#list-tab")?.addEventListener("click", () => {
        if (listPanel == null || agendaPanel == null) return;
        listPanel.style.display = "block";
        agendaPanel.style.display = "none";
    });
}

/**
 * Sets up the add task form listeners so that users can add tasks onto their lists
 *
 * @param numLists The number of lists the user has. Used for finding the id's of elements
 */
export function setupAddTaskFormListeners(numLists: number) {
    for (let i = 0; i < numLists; i++) {
        let buttonId = "#submit" + i;
        document.querySelector(buttonId)?.addEventListener("click", (e) => {
            e.preventDefault();
            let formId = "list" + i;
            let form: any | null = document.getElementById(formId);
            if (form == null) return;

            let taskTitle = form.elements["new-task-title"].value;
            let taskDesc = form.elements["new-task-description"].value;

            addTask(taskTitle, taskDesc, i);
        });
    }
}

/**
 * Sets up the add to agenda buttons next to every task on the page
 */
export function setupMoveToAgendaButtons() {
    document.querySelectorAll("agenda-button")?.forEach((task) => {
        task.addEventListener('click', () => {
            const index = task.getAttribute("index");
            const listIndex = task.getAttribute("list-index");

            if (index == null || listIndex == null) return;

            moveTaskToAgenda(Number(index), Number(listIndex));
        });
    })
}

/**
 * Sets up all the task blocks so that tasks can be completed and restarted with a click
 */
export function setupTaskBlockOnClick() {
    document.querySelectorAll("task-block")?.forEach((task) => {
        task.addEventListener('click', () => {
            const index = task.getAttribute("index");
            const listIndex = task.getAttribute("list-index");

            const isOnAgenda = task.getAttribute("agenda") != null;
            if (isOnAgenda) {
                if (index != null) {
                    completeAgendaTask(Number(index))
                    return;
                }
            }

            if (index != null && listIndex != null) completeTask(Number(index), Number(listIndex));
        });
    });

    document.querySelectorAll("completed-task-block")?.forEach((task) => {
        task.addEventListener('click', () => {
            const index = task.getAttribute("index");
            const listIndex = task.getAttribute("list-index");

            const isOnAgenda = task.getAttribute("agenda") != null;
            if (isOnAgenda) {
                if (index != null) {
                    restartAgendaTask(Number(index))
                    return;
                }
            }

            if (index != null && listIndex != null) restartTask(Number(index), Number(listIndex));
        });
    })
}

/**
 * Setups the add list form in the list panel, allowing users to add their own lists
 */
export function setupAddListForm() {
    document.getElementById("add-list")?.addEventListener("click", (e) => {
        e.preventDefault();

        let form: any | null = document.getElementById("add-list-form");

        if (form == null) return;

        addList(form.elements["new-list-name"].value);

        form.elements["new-list-name"].value = "";
    });
}

/**
 * Sets up the trash buttons next to the tasks in each list so that when the button is click the corresponding task is
 * deleted
 */
export function setupDeleteTaskButtons() {
    document.querySelectorAll("trash-button")?.forEach((task) => {
        task.addEventListener('click', () => {
            const index = task.getAttribute("index");
            const listIndex = task.getAttribute("list-index");

            if (index == null || listIndex == null) return;

            deleteTask(Number(index), Number(listIndex));
        });
    })
}

/**
 * Sets up the trash buttons next to the list names in the list side panel, so that when they are clicked the
 * corresponding list is deleted
 */
export function setupDeleteListButtons() {
    document.querySelectorAll("delete-list-button")?.forEach((list) => {
        list.addEventListener('click', () => {
            const index = list.getAttribute("index");

            if (index == null) return;

            deleteList(Number(index));
        })
    });
}

/**
 * Sets up the click event for the cleanup button on the side panel so that when it is clicked all completed tasks are
 * deleted
 */
export function setupCleanupAgendaButton() {
    document.querySelector("#cleanup-agenda")?.addEventListener("click", cleanupAgendaTasks);
}