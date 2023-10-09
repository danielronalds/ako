use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
/// A struct to represent a list of tasks
pub struct List {
    /// The name of the list
    name: String,
    /// Tasks in the list
    tasks: Vec<Task>,
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
        }
    }

    /// Gets the number of tasks in the lists
    ///
    /// # Returns
    ///
    /// The length of the task vec
    pub fn len(&self) -> usize {
        self.tasks.len()
    }

    /// Adds a task to the list. If the task is completed it will be added to the completed_task
    /// vec, otherwise to the normal one
    ///
    /// # Arguments
    ///
    /// - `tasks` The task to add to the list
    pub fn add_task(&mut self, task: Task) {
        self.tasks.push(task);
        self.sort_tasks();
    }

    /// If the given index is in range, completes the task at the index
    ///
    /// # Arguments
    ///
    /// - `index` The index of the task to complete
    pub fn complete_task(&mut self, index: usize) {
        if index >= self.tasks.len() {
            return;
        }

        self.tasks[index].set_completed(true);
        self.sort_tasks();
    }

    /// If the given index is in range, restarts the task at the index
    ///
    /// # Arguments
    ///
    /// - `index` The index of the task to restart
    pub fn restart_task(&mut self, index: usize) {
        if index >= self.tasks.len() {
            return;
        }

        self.tasks[index].set_completed(false);
        self.sort_tasks();
    }

    /// Deletes a task from the list
    ///
    /// # Arguments
    ///
    /// - `index` The index of the task to delete
    ///
    /// # Returns
    ///
    /// The deleted task, or `None` if the index was out of range
    pub fn delete_task(&mut self, index: usize) -> Option<Task> {
        match index >= self.tasks.len() {
            true => None,
            false => Some(self.tasks.remove(index)),
        }
    }

    /// Gets the tasks on the list as a vec
    ///
    /// # Returns
    ///
    /// A clone of the tasks vec
    pub fn get_tasks(&self) -> Vec<Task> {
        self.tasks.clone()
    }

    /// Sorts the tasks in the list with completed tasks being pushed to the back
    fn sort_tasks(&mut self) {
        self.tasks = self
            .tasks
            .iter()
            .filter(|x| !x.completed)
            .chain(self.tasks.iter().filter(|x| x.completed))
            .map(|x| x.to_owned())
            .collect();
    }

    /// Deletes all completed tasks from the list
    pub fn delete_completed_tasks(&mut self) {
        self.tasks = self
            .tasks
            .iter()
            .filter(|x| !x.completed)
            .map(|x| x.to_owned())
            .collect();
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

#[derive(Serialize, Deserialize, Clone)]
/// A struct to represent a Task
pub struct Task {
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

    /// Sets the status of the task
    ///
    /// # Arguments
    ///
    /// - `status` Whether the task is complete or not
    pub fn set_completed(&mut self, status: bool) {
        self.completed = status;
    }
}
