// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod list;
mod serialisation;

use list::List;
use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::State;

use crate::list::Task;
use crate::serialisation::{get_saved_state, save_application_data};

struct AppState(Mutex<ApplicationData>);

#[derive(Serialize, Deserialize, Clone)]
pub struct ApplicationData {
    lists: Vec<List>,
    daily_agenda: List,
}

impl Default for ApplicationData {
    fn default() -> Self {
        // get_saved_state().unwrap_or({
        let mut daily_agenda = List::new("Daily Agenda");
        daily_agenda.add_task(Task::new(
            "Get Groceries",
            "And not many, they're expensive",
        ));
        daily_agenda.add_task(Task::new("Build a Paper Plane", "Fold it or something"));

        Self {
            lists: vec![
                List::default(),
                List::default(),
                List::default(),
                List::default(),
                List::default(),
                List::default(),
                List::default(),
            ],
            daily_agenda,
        }
        // })
    }
}

#[tauri::command]
fn save_state(state: State<AppState>) {
    if let Ok(state) = state.0.lock() {
        let _ = save_application_data(state.clone());
    }
}

#[tauri::command]
fn get_lists(state: State<AppState>) -> Vec<List> {
    match state.0.lock() {
        Ok(data) => data.lists.clone(),
        Err(_) => vec![],
    }
}

#[tauri::command]
fn complete_task(state: State<AppState>, task_i: usize, list_i: usize) {
    if let Ok(mut data) = state.0.lock() {
        if list_i >= data.lists.len() {
            return;
        }

        data.lists[list_i].complete_task(task_i);
    }
}

#[tauri::command]
fn restart_task(state: State<AppState>, task_i: usize, list_i: usize) {
    if let Ok(mut data) = state.0.lock() {
        if list_i >= data.lists.len() {
            return;
        }

        data.lists[list_i].restart_task(task_i);
    }
}

#[tauri::command]
fn add_task(state: State<AppState>, task_title: String, task_desc: String, list_i: usize) {
    if let Ok(mut data) = state.0.lock() {
        if list_i >= data.lists.len() {
            return;
        }

        let new_task = Task::new(task_title, task_desc);

        data.lists[list_i].add_task(new_task);
    }
}

#[tauri::command]
fn move_task_to_agenda(state: State<AppState>, task_i: usize, list_i: usize) {
    if let Ok(mut data) = state.0.lock() {
        if list_i >= data.lists.len() {
            return;
        }

        if task_i >= data.lists[list_i].len() {
            return;
        }

        let task = data.lists[list_i]
            .delete_task(task_i)
            .expect("Index out of range");

        data.daily_agenda.add_task(task);
    }
}

#[tauri::command]
fn get_agenda_tasks(state: State<AppState>) -> Vec<Task> {
    if let Ok(data) = state.0.lock() {
        return data.daily_agenda.get_tasks();
    }

    vec![]
}

#[tauri::command]
fn restart_agenda_task(state: State<AppState>, index: usize) {
    if let Ok(mut data) = state.0.lock() {
        data.daily_agenda.restart_task(index)
    }
}

#[tauri::command]
fn complete_agenda_task(state: State<AppState>, index: usize) {
    if let Ok(mut data) = state.0.lock() {
        data.daily_agenda.complete_task(index)
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            save_state,
            get_lists,
            add_task,
            complete_task,
            restart_task,
            move_task_to_agenda,
            get_agenda_tasks,
            complete_agenda_task,
            restart_agenda_task
        ])
        .manage(AppState(Default::default()))
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
