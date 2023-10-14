import {invoke} from "@tauri-apps/api/tauri";

import {List, Task} from "./list.ts";

import {getAgendaTaskHtml, getCompletedAgendaTaskHtml, getListHtml, getSidePanelListHTML} from "./components.ts";

import {
    setupAddListForm,
    setupMoveToAgendaButtons,
    setupAddTaskFormListeners,
    setupTabButtons,
    setupTaskBlockOnClick,
    setupDeleteTaskButtons,
    setupDeleteListButtons,
    setupCleanupAgendaButton
} from "./setup.ts";

window.addEventListener("DOMContentLoaded", () => {
    refreshDOM().then();

    // Setting up events for elements that are not replaced each change
    setupCleanupAgendaButton();
    setupTabButtons();
    setupAddListForm();
});

/**
 * Refreshes the application's state and writes it to the DOM
 */
export async function refreshDOM() {
    // Fetching the user's agenda and lists
    let lists: Array<List> = await invoke("get_lists");
    let agenda: Array<Task> = await invoke("get_agenda_tasks");

    // Setting up listeners
    writeListsToDOM(lists);
    writeAgendaToDOM(agenda);
    writeListsToPanel(lists);
    setupTaskBlockOnClick();
    setupMoveToAgendaButtons();
    setupAddTaskFormListeners(agenda.length);
    setupDeleteTaskButtons();
    setupDeleteListButtons();

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

/**
 * Writes the current lists to the side panel under the 'Lists' tab
 *
 * @param lists The user's current lists
 */
export function writeListsToPanel(lists: Array<List>) {
    let listHTML = "";

    for (let i = 0; i < lists.length; i++) {
        listHTML += getSidePanelListHTML(lists[i], i);
    }

    let listContainer = document.getElementById("list-panel-container");

    if (listContainer == null) return;

    listContainer.innerHTML = listHTML;
}
