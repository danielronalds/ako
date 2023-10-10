/**
 * This module contains all the export functions to do with setting up listeners on the DOM
 *
 * @author Daniel R
 */
import {invoke} from "@tauri-apps/api/tauri";
import {completeAgendaTask, completeTask, restartAgendaTask, restartTask} from "./operations.ts";
import {refreshDOM} from "./main.ts";

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

            let taskTitle = form.elements["new-task-title"];
            let taskDesc = form.elements["new-task-description"];

            if (taskTitle.value === "") return;

            invoke("add_task", {
                taskTitle: taskTitle.value,
                taskDesc: taskDesc.value,
                listI: i
            }).then(() => {
                refreshDOM().then();
            });
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

            invoke("move_task_to_agenda", {
                taskI: Number(index),
                listI: Number(listIndex)
            }).then(() => {
                refreshDOM().then();
            });
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

        invoke("add_list", {
            name: form.elements["new-list-name"].value,
        }).then(() => {
            form.elements["new-list-name"].value = "";
            refreshDOM().then();
        })
    });
}