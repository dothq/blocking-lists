use std::{
    env,
    error::Error,
    fs::{self, create_dir, File},
    io::{self, Write},
};

extern crate yaml_rust;

use serde::Deserialize;

#[derive(Debug, Deserialize)]
struct Lists {
    trackers: Vec<String>,
}

#[derive(Debug, Deserialize)]
struct Config {
    lists: Lists,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    // Welcome
    println!("ShieldDB updating...");

    // Create the cache path
    // if !folder_exist(".cache")? {
    //     create_dir("./.cache")?;
    // }

    // Create the out path
    if !folder_exist("out")? {
        create_dir("./out")?;
    }

    println!("Loading config...");

    // Read the config file for shieldDB
    let config_str = fs::read_to_string("config.yml")?;
    let docs: Config = serde_yaml::from_str(&config_str)?;

    let trackers_list = download_lists(docs.lists.trackers).await?;

    println!("Saving...");
    let mut file = File::create("out/trackers.txt")?;
    file.write_all(&trackers_list.join("\n").as_bytes())?;

    Ok(())
}

async fn download_lists(lists: Vec<String>) -> Result<Vec<String>, Box<dyn Error>> {
    // Download files and store them in a scripts
    let mut list = Vec::new();
    for file in lists {
        let downloaded = reqwest::get(&file).await?.text().await?;

        let split: Vec<&str> = downloaded.split('\n').collect();

        let mut split = split
            .iter()
            .map(|s| s.split('!').collect::<Vec<&str>>()[0])
            .filter(|s| s != &"")
            .map(|s| s.to_string())
            .collect();

        list.append(&mut split);

        println!("Downloaded: '{}'", &file);
    }

    println!("Deduping...");
    list.sort();
    list.dedup();

    Ok(list)
}

fn folder_exist(name: &str) -> io::Result<bool> {
    let mut path = env::current_dir()?;
    path.push(name);
    let metadata = fs::metadata(path)?;
    Ok(metadata.is_dir())
}
