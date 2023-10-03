export type List = {
    name: string,
    tasks: Array<Task>
    completedTasks: Array<Task>
}

export type Task = {
    completed: boolean,
    title: string,
    description: string
}