/**
 * This module contains all the logic for manipulating tasks on the DOM
 *
 * @author Daniel R
 */
import {invoke} from "@tauri-apps/api/tauri";
import {refreshDOM} from "./main.ts";

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