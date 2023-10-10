/// This module contains the logic for serializing and deserializing the programs state
use crate::ApplicationData;

use std::fs::File;
use std::io;
use std::io::{Read, Write};

const FILE_PATH: &str = ".ako.json";

pub fn get_saved_state() -> Option<ApplicationData> {
    let file = open_file();
    let file_contents = read_file(file);
    json_to_application_data(file_contents)
}

fn open_file() -> Option<File> {
    let home_dir = dirs::home_dir().expect("Couldn't get home dir");
    match File::open(home_dir.join(FILE_PATH)) {
        Ok(file) => Some(file),
        Err(e) => {
            eprintln!("{}", e);
            None
        }
    }
}

fn read_file(file: Option<File>) -> Option<String> {
    if let Some(mut file) = file {
        let mut contents = String::new();
        if let Ok(_) = file.read_to_string(&mut contents) {
            return Some(contents);
        }
    }
    None
}

fn json_to_application_data(file_contents: Option<String>) -> Option<ApplicationData> {
    if let Some(contents) = file_contents {
        if let Ok(decks) = serde_json::from_str(&contents) {
            return Some(decks);
        }
    }
    None
}

pub fn save_application_data(data: ApplicationData) -> io::Result<()> {
    //create_dir_all(FOLDER_PATH)?;
    let file = create_file();
    let json = application_data_to_json(data);
    write_json_to_file(file, json)
}

fn create_file() -> Option<File> {
    let home_dir = dirs::home_dir().expect("Couldn't get home dir");
    let file = File::create(home_dir.join(FILE_PATH));
    match file {
        Ok(file) => Some(file),
        Err(e) => {
            eprintln!("{}", e);
            None
        }
    }
}

fn application_data_to_json(data: ApplicationData) -> Option<String> {
    if let Ok(json) = serde_json::to_string_pretty(&data) {
        return Some(json);
    }
    None
}

fn write_json_to_file(file: Option<File>, json: Option<String>) -> io::Result<()> {
    if file.is_none() {
        println!("File is missing!");
    }
    if json.is_none() {
        println!("Json is missing!");
    }

    if let (Some(json), Some(mut file)) = (json, file) {
        file.write_all(&*json.into_bytes())?;
        file.flush()?;
    }

    Ok(())
}
