use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
/// A struct to represent a list of tasks
pub struct List {
    /// The name of the list
    name: String,
    /// Tasks that are on the list but not completed
    tasks: Vec<Task>,
    /// Tasks that are on the list but are completed
    completed_tasks: Vec<Task>,
}

impl List {
    /// Creates a new List
    ///
    /// # Arguments
    ///
    /// - `name` The name of the list
    ///
    /// # Returns
    ///
    /// A new List struct with the given name
    pub fn new(name: impl Into<String>) -> Self {
        Self {
            name: name.into(),
            tasks: vec![],
            completed_tasks: vec![],
        }
    }

    /// Adds a task to the list. If the task is completed it will be added to the completed_task
    /// vec, otherwise to the normal one
    ///
    /// # Arguments
    ///
    /// - `tasks` The task to add to the list
    pub fn add_task(&mut self, task: Task) {
        match task.completed {
            true => self.completed_tasks.push(task),
            false => self.tasks.push(task)
        }
    }
}

impl Default for List {
    fn default() -> Self {
        let mut list = List::new("Default list");
        list.add_task(Task::new("Task 1", "This is the first task"));
        list.add_task(Task::new("Task 2", "This is a second task"));
        list.add_task(Task::new("Task 3", "Three is a nice number of tasks"));
        list.add_task(Task::new("Task 4", "Wait......"));
        list.add_task(Task::new("Task 5", "Why is there another?!?!?"));
        list.add_task(Task::new("Task 6", "Don't finish on an even number!"));
        list
    }
}

#[derive(Serialize, Deserialize)]
/// A struct to represent a Task
struct Task {
    /// Whether the task is completed
    completed: bool,
    /// The title of the task
    title: String,
    /// The description of the task
    description: String,
}

impl Task {
    /// Creates a new Task
    ///
    /// # Arguments
    ///
    /// - `title`       The title of the task
    /// - `description` The description of the task
    ///
    /// # Returns
    ///
    /// A new task that has not been completed
    pub fn new<T: Into<String>>(title: T, description: T) -> Self {
        Self {
            completed: false,
            description: description.into(),
            title: title.into(),
        }
    }
}