import { invoke } from "@tauri-apps/api/tauri";

import { List, Task } from "./list.ts";

window.addEventListener("DOMContentLoaded", () => {
    let lists: Promise<Array<List>> = invoke("get_lists")
    lists.then((lists) => {
        console.log(lists);
        writeListsToDOM(lists);
    });
});

function writeListsToDOM(lists: Array<List>) {
    let listWindowsContainer = document.getElementById("list-windows-container");
    if (listWindowsContainer == null) return;

    let innerHtml = "";

    lists.forEach((list) => {
        innerHtml += getListHtml(list);
    })

    listWindowsContainer.innerHTML = innerHtml;
}

function getListHtml(list: List): string {
    let innerHtml = `
    <list-window>
        <h1>${list.name}</h1>
        <hr>
    `;

    for (let i = 0; i < list.tasks.length; i++) {
        innerHtml += getTaskHtml(list.tasks[i], i);
    }

    for (let i = 0; i < list.completed_tasks.length; i++) {
        innerHtml += getCompletedTaskHtml(list.completed_tasks[i], i);
    }

    innerHtml += `
        </list-window>
    `;
    return innerHtml;
}

function getTaskHtml(task: Task, index: number): string {
    return `
    <task-block index="${index}">
        <task-title>${task.title}</task-title>
        <task-description>${task.description}</task-description>
    </task-block>
    `
}
function getCompletedTaskHtml(task: Task, index: number): string {
    return `
    <task-block completed index="${index}">
        <task-title>${task.title}</task-title>
    </task-block>
    `
}
