export type List = {
    name: string,
    tasks: Array<Task>
    completed_tasks: Array<Task>
}

export type Task = {
    completed: boolean,
    title: string,
    description: string
}