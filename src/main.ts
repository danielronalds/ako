import { invoke } from "@tauri-apps/api/tauri";

import { List, Task } from "./list.ts";

let appLists: Array<List>, agendaTasks: Array<Task>;
window.addEventListener("DOMContentLoaded", () => {
    refreshLists();

    document.querySelector("#cleanup-agenda")?.addEventListener("click", () => {
        invoke("cleanup_agenda").then(() => {
            refreshLists();
        });
    });

    setupTabButtons();
});

async function refreshLists() {
    appLists = await invoke("get_lists");
    agendaTasks = await invoke("get_agenda_tasks");
    writeListsToDOM(appLists);
    writeAgendaToDOM(agendaTasks);
    setupTaskBlockOnClick();
    setupAgendaButtonsOnClick();
    setupFormListeners();
    setupAddListForm();
    await invoke("save_state");
}

function setupTabButtons() {
    let listPanel = document.getElementById("list-panel");
    let agendaPanel = document.getElementById("todays-agenda-shown");
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

function setupFormListeners() {
    for (let i = 0; i < appLists.length; i++) {
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
                refreshLists()
            });
        });
    }
}

function setupAgendaButtonsOnClick() {
    document.querySelectorAll("agenda-button")?.forEach((task) => {
        task.addEventListener('click', () => {
            const index = task.getAttribute("index");
            const listIndex = task.getAttribute("list-index");

            if (index == null || listIndex == null) return;

            invoke("move_task_to_agenda", {
                taskI: Number(index),
                listI: Number(listIndex)
            }).then(() => {
                refreshLists();
            });
        });
    })
}

function setupTaskBlockOnClick() {
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

function setupAddListForm() {
    document.getElementById("add-list")?.addEventListener("click", (e) => {
        e.preventDefault();

        let form: any | null = document.getElementById("add-list-form");

        if(form == null) return;

        invoke("add_list", {
            name: form.elements["new-list-name"].value,
        }).then(() => {
            form.elements["new-list-name"].value = "";
            refreshLists();
        })
    });
}

function completeTask(index: number, listIndex: number) {
    invoke("complete_task", {
        taskI: index,
        listI: listIndex
    }).then(() => {
        refreshLists();
    });
}

function restartTask(index: number, listIndex: number) {
    invoke("restart_task", {
        taskI: index,
        listI: listIndex
    }).then(() => {
        refreshLists();
    });
}

function completeAgendaTask(index: number) {
    invoke("complete_agenda_task", {
        index: index,
    }).then(() => {
        refreshLists();
    });
}

function restartAgendaTask(index: number) {
    invoke("restart_agenda_task", {
        index: index,
    }).then(() => {
        refreshLists();
    });
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

function getListHtml(list: List, listIndex: number): string {
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

function getAgendaTaskHtml(task: Task, index: number): string {
    return `
    <task-block agenda index="${index}">
        <task-title>${task.title}</task-title>
        <task-description>${task.description}</task-description>
    </task-block>
    `
}

function getCompletedAgendaTaskHtml(task: Task, index: number): string {
    return `
    <completed-task-block agenda index="${index}">
        <task-title>${task.title}</task-title>
    </completed-task-block>
    `
}

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

function getCompletedTaskHtml(task: Task, index: number, listIndex: number): string {
    return `
    <completed-task-block index="${index}" list-index="${listIndex}">
        <task-title>${task.title}</task-title>
    </completed-task-block>
    `
}