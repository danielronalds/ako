// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod list;

use list::List;
use std::sync::Mutex;
use tauri::State;

struct AppState(Mutex<ApplicationData>);

struct ApplicationData {
    lists: Vec<List>,
}

impl Default for ApplicationData {
    fn default() -> Self {
        Self {
            lists: vec![List::default(), List::default(), List::default()],
        }
    }
}

#[tauri::command]
fn get_lists(state: State<AppState>) -> Vec<List> {
    match state.0.lock() {
        Ok(data) => data.lists.clone(),
        Err(_) => vec![]
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

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_lists,
            complete_task,
            restart_task
        ])
        .manage(AppState(Default::default()))
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
