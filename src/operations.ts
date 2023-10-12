/**
 * This module contains all the logic for manipulating tasks on the DOM
 *
 * @author Daniel R
 */
import {invoke} from "@tauri-apps/api/tauri";
import {refreshDOM} from "./main.ts";

/**
 * Calls the rust backend to add a new list
 *
 * @param name The name the new list should have
 */
export function addList(name: String) {
    invoke("add_list", {
        name: name,
    }).then(() => {
        refreshDOM().then();
    })
}

/**
 * Calls the rust backend to remove the list at the given index, if it exists
 *
 * @param index The index of the list to delete
 */
export function deleteList(index: number) {
    invoke("delete_list", {
        index: index,
    }).then(() => {
        refreshDOM().then();
    })
}

/**
 * Calls the rust backend to add a task
 *
 * @param taskTitle The title of the task
 * @param taskDesc The description of the task
 * @param listI The index of the list the task is being added to
 */
export function addTask(taskTitle: string, taskDesc: string, listI: number) {
    if (taskTitle === "") return;

    invoke("add_task", {
        taskTitle: taskTitle,
        taskDesc: taskDesc,
        listI: listI
    }).then(() => {
        refreshDOM().then();
    });
}

/**
 * Calls the rust backend to delete a task from a list
 *
 * @param index The index of the task to delete
 * @param listIndex The index of the list the task belongs to
 */
export function deleteTask(index: number, listIndex: number) {
    invoke("delete_task", {
        taskI: index,
        listI: listIndex
    }).then(() => {
        refreshDOM().then();
    });
}


/**
 * Calls the rust backend to complete the given task and refreshed the DOM
 *
 * @param index The index of the task
 * @param listIndex The index of the list containing the task
 */
export function completeTask(index: number, listIndex: number) {
    invoke("complete_task", {
        taskI: index,
        listI: listIndex
    }).then(() => {
        refreshDOM().then();
    });
}

/**
 * Calls the rust backend to restart the given task and refreshed the DOM
 *
 * @param index The index of the task
 * @param listIndex The index of the list containing the task
 */
export function restartTask(index: number, listIndex: number) {
    invoke("restart_task", {
        taskI: index,
        listI: listIndex
    }).then(() => {
        refreshDOM().then();
    });
}

/**
 * Calls the rust backend to move a task to the agenda
 *
 * @param index The index of the task to move
 * @param listIndex The index of the list the task belongs to
 */
export function moveTaskToAgenda(index: number, listIndex: number) {
    invoke("move_task_to_agenda", {
        taskI: index,
        listI: listIndex
    }).then(() => {
        refreshDOM().then();
    });
}

/**
 * Calls the rust backend to complete the given task on the agenda and refreshed the DOM
 *
 * @param index The index of the task on the agenda
 */
export function completeAgendaTask(index: number) {
    invoke("complete_agenda_task", {
        index: index,
    }).then(() => {
        refreshDOM().then();
    });
}

/**
 * Calls the rust backend to restart the given task on the agenda and refreshed the DOM
 *
 * @param index The index of the task on the agenda
 */
export function restartAgendaTask(index: number) {
    invoke("restart_agenda_task", {
        index: index,
    }).then(() => {
        refreshDOM().then();
    });
}

export function cleanupAgendaTasks() {
    invoke("cleanup_agenda").then(() => {
        refreshDOM().then();
    });
}