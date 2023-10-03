import {invoke} from "@tauri-apps/api/tauri";

import {List, Task} from "./list.ts";

let appLists: Array<List>;

window.addEventListener("DOMContentLoaded", () => {
    let lists: Promise<Array<List>> = invoke("get_lists")
    lists.then((lists) => {
        console.log(lists);
        appLists = lists;
        writeListsToDOM(appLists);
        setupTaskBlockOnClick();
    });
});

function setupTaskBlockOnClick() {
    document.querySelectorAll("task-block")?.forEach((task) => {
        task.addEventListener('click', () => {
            const index = task.getAttribute("index");
            const listIndex = task.getAttribute("list-index");

            if (index == null || listIndex == null) return;

            invoke("complete_task", {
                taskI: Number(index),
                listI: Number(listIndex)
            }).then(() => {
                let lists: Promise<Array<List>> = invoke("get_lists")
                lists.then((lists) => {
                    appLists = lists;
                    writeListsToDOM(appLists);
                    setupTaskBlockOnClick();
                })
            })
        });
    });
    document.querySelectorAll("completed-task-block")?.forEach((task) => {
        task.addEventListener('click', () => {
            const index = task.getAttribute("index");
            const listIndex = task.getAttribute("list-index");

            if (index == null || listIndex == null) return;

            invoke("restart_task", {
                taskI: Number(index),
                listI: Number(listIndex)
            }).then(() => {
                let lists: Promise<Array<List>> = invoke("get_lists")
                lists.then((lists) => {
                    appLists = lists;
                    writeListsToDOM(appLists);
                    setupTaskBlockOnClick();
                })
            })
        });
    })
}

function writeListsToDOM(lists: Array<List>) {
    let listWindowsContainer = document.getElementById("list-windows-container");
    if (listWindowsContainer == null) return;

    let innerHtml = "";

    for (let i = 0; i < lists.length; i++) {
        innerHtml += getListHtml(lists[i], i);
    }

    listWindowsContainer.innerHTML = innerHtml;
}

function getListHtml(list: List, listIndex: number): string {
    let innerHtml = `
    <list-window>
        <h1>${list.name}</h1>
        <hr>
    `;

    for (let i = 0; i < list.tasks.length; i++) {
        innerHtml += getTaskHtml(list.tasks[i], i, listIndex);
    }

    for (let i = 0; i < list.completed_tasks.length; i++) {
        innerHtml += getCompletedTaskHtml(list.completed_tasks[i], i, listIndex);
    }

    innerHtml += `
        </list-window>
    `;
    return innerHtml;
}

function getTaskHtml(task: Task, index: number, listIndex: number): string {
    return `
    <task-block index="${index}" list-index="${listIndex}">
        <task-title>${task.title}</task-title>
        <task-description>${task.description}</task-description>
    </task-block>
    `
}

function getCompletedTaskHtml(task: Task, index: number, listIndex: number): string {
    return `
    <completed-task-block index="${index}" list-index="${listIndex}">
        <task-title>${task.title}</task-title>
    </completed-task-block>
    `
}
