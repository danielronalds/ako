import {invoke} from "@tauri-apps/api/tauri";

import {List, Task} from "./list.ts";

import {getAgendaTaskHtml, getCompletedAgendaTaskHtml, getListHtml} from "./components.ts";

import {
    setupAddListForm,
    setupMoveToAgendaButtons,
    setupAddTaskFormListeners,
    setupTabButtons,
    setupTaskBlockOnClick
} from "./setup.ts";

let appLists: Array<List>, agendaTasks: Array<Task>;

window.addEventListener("DOMContentLoaded", () => {
    refreshDOM().then();

    document.querySelector("#cleanup-agenda")?.addEventListener("click", () => {
        invoke("cleanup_agenda").then(() => {
            refreshDOM().then();
        });
    });

    setupTabButtons();
});

/**
 * Refreshes the application's state and writes it to the DOM
 */
export async function refreshDOM() {
    // Fetching the user's agenda and lists
    appLists = await invoke("get_lists");
    agendaTasks = await invoke("get_agenda_tasks");

    // Setting up listeners
    writeListsToDOM(appLists);
    writeAgendaToDOM(agendaTasks);
    setupTaskBlockOnClick();
    setupMoveToAgendaButtons();
    setupAddTaskFormListeners(appLists.length);
    setupAddListForm();

    // Saving the application state
    await invoke("save_state");
}

/**
 * Writes the user's lists to the DOM
 *
 * @param lists The user's lists
 */
function writeListsToDOM(lists: Array<List>) {
    let listWindowsContainer = document.getElementById("list-windows-container");
    if (listWindowsContainer == null) return;

    let innerHtml = "";

    for (let i = 0; i < lists.length; i++) {
        innerHtml += getListHtml(lists[i], i);
    }

    listWindowsContainer.innerHTML = innerHtml;
}

/**
 * Writes the user's agenda tasks to the agenda side panel
 *
 * @param tasks The tasks on the user's agenda
 */
function writeAgendaToDOM(tasks: Array<Task>) {
    let tasksAgendaContainer = document.getElementById("agenda-tasks-container");

    if (tasksAgendaContainer == null) return;

    let innerHtml = "";

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].completed) {
            innerHtml += getCompletedAgendaTaskHtml(tasks[i], i);
        } else {
            innerHtml += getAgendaTaskHtml(tasks[i], i);
        }
    }

    tasksAgendaContainer.innerHTML = innerHtml;
}