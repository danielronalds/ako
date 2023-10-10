/**
 * This module contains all the functions for generating HTML 'components'
 *
 * @author Daniel R
 */
import {List, Task} from "./list.ts";

/**
 * Creates the HTML markup for a List
 *
 * @param list The list to create
 * @param listIndex The index of the list
 * @return A string containing the HTML markup of the List
 */
export function getListHtml(list: List, listIndex: number): string {
    let innerHtml = `
    <list-window>
        <h1>${list.name}</h1>
        <details>
        <summary>Add Task</summary>
        <form name="list${listIndex}" id="list${listIndex}">
            <input name="new-task-title" id="new-task-title" placeholder="New task's title">
            <input name="new-task-description" id="new-task-description" placeholder="New task's description">
            <button type="submit" name="submit${listIndex}" id="submit${listIndex}">Add</button>
        </form>
        </details>
    `;

    for (let i = 0; i < list.tasks.length; i++) {
        let task = list.tasks[i];
        if (task.completed) {
            innerHtml += getCompletedTaskHtml(task, i, listIndex);
        } else {
            innerHtml += getTaskHtml(task, i, listIndex);
        }
    }

    innerHtml += `
        </list-window>
    `;
    return innerHtml;
}

/**
 * Creates the HTML markup for a task on the Agenda Panel
 *
 * @param task The task to create the markup for
 * @param index The index of the task
 * @return A string containing the HTML markup of the task
 */
export function getAgendaTaskHtml(task: Task, index: number): string {
    return `
    <task-block agenda index="${index}">
        <task-title>${task.title}</task-title>
        <task-description>${task.description}</task-description>
    </task-block>
    `
}

/**
 * Creates the HTML markup for a completed task on the Agenda Panel
 *
 * @param task The task to create the markup for
 * @param index The index of the task
 * @return A string containing the HTML markup of the completed task
 */
export function getCompletedAgendaTaskHtml(task: Task, index: number): string {
    return `
    <completed-task-block agenda index="${index}">
        <task-title>${task.title}</task-title>
    </completed-task-block>
    `
}

/**
 * Creates the HTML markup for a task in a list
 *
 * @param task The task to create the markup for
 * @param index The index of the task
 * @param listIndex The index of the list the task is on
 * @return A string containing the HTML markup of the task
 */
function getTaskHtml(task: Task, index: number, listIndex: number): string {
    return `
    <task-row>
        <agenda-button index="${index}" list-index="${listIndex}">+</agenda-button>
        <task-block index="${index}" list-index="${listIndex}">
            <task-title>${task.title}</task-title>
            <task-description>${task.description}</task-description>
        </task-block>
    </task-row>
    `
}

/**
 * Creates the HTML markup for a completed task in a list
 *
 * @param task The task to create the markup for
 * @param index The index of the task
 * @param listIndex The index of the list the task is on
 * @return A string containing the HTML markup of the completed task
 */
function getCompletedTaskHtml(task: Task, index: number, listIndex: number): string {
    return `
    <completed-task-block index="${index}" list-index="${listIndex}">
        <task-title>${task.title}</task-title>
    </completed-task-block>
    `
}
