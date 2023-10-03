// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod list;

use list::List;

#[tauri::command]
fn get_lists() -> Vec<List> {
    vec![ List::default(), List::default() , List::default()]
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_lists])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
