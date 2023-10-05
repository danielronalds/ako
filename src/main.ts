import {invoke} from "@tauri-apps/api/tauri";

import {List, Task} from "./list.ts";

let appLists: Array<List>;

window.addEventListener("DOMContentLoaded", () => {
    refreshLists();
});

async function refreshLists() {
    appLists = await invoke("get_lists");
    writeListsToDOM(appLists);
    setupTaskBlockOnClick();
    setupFormListeners();
}


function setupFormListeners(){
    for (let i = 0; i < appLists.length; i++) {
        let buttonId = "#submit" + i;
        document.querySelector(buttonId)?.addEventListener("click", (e) => {
            e.preventDefault();
            let formId = "list" + i;
            let form: any | null = document.getElementById(formId);
            if(form == null) return;

            let taskTitle = form.elements["new-task-title"];
            let taskDesc = form.elements["new-task-description"];

            if (taskTitle.value === "") return;

            invoke("add_task", {
                taskTitle: taskTitle.value,
                taskDesc: taskDesc.value,
                listI: i
            }).then(() => {
                refreshLists()
            });
        });
    }
}

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
                refreshLists();
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
                refreshLists();
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
        <form name="list${listIndex}" id="list${listIndex}">
            <input name="new-task-title" id="new-task-title" placeholder="New task's title">
            <input name="new-task-description" id="new-task-description" placeholder="New task's description">
            <button type="submit" name="submit${listIndex}" id="submit${listIndex}">Add</button>
        </form>
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
