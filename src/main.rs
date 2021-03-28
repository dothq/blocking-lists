use std::{
    env,
    error::Error,
    fs::{self, create_dir, File},
    io::{self, Write},
};

use linya::Progress;
use serde::Deserialize;

#[derive(Debug, Deserialize)]
struct List {
    name: String,
    abp: Vec<String>,
    hosts: Vec<String>,
}

#[derive(Debug, Deserialize)]
struct Config {
    name: String,
    out: String,
    lists: Vec<List>,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    // Create the out path
    if !folder_exist("out")? {
        create_dir("./out")?;
    }

    // Read the config file for shieldDB
    let config_str = fs::read_to_string("config.yml")?;
    let config: Config = serde_yaml::from_str(&config_str)?;

    // Log a welcome message
    println!("{}", config.name);
    println!("===============");

    // Create the progress manager
    let mut progress = Progress::new();
    // Create the total list progress file
    let total_lists = progress.bar(config.lists.len(), "All lists");
    // Loop through all of the lists
    for list_config in config.lists {
        // Parse the list
        list(&list_config, &mut progress, &config.out).await?;
        // Increment total progress bar
        progress.inc_and_draw(&total_lists, 1);
    }

    Ok(())
}

async fn list(list: &List, progress: &mut Progress, out: &str) -> Result<(), Box<dyn Error>> {
    let name = &list.name;
    let mut full_list = Vec::new();
    let total_lists = list.abp.len() + list.hosts.len() + 2; // We add the extra one for deduping and saving

    let bar = progress.bar(total_lists, format!("List: {}", name));

    for list in &list.abp {
        let download = reqwest::get(list).await?.text().await?;
        let mut list = parse_abp(download);
        full_list.append(&mut list);

        progress.inc_and_draw(&bar, 1);
    }

    for list in &list.hosts {
        let download = reqwest::get(list).await?.text().await?;
        let mut list = parse_host(download);
        full_list.append(&mut list);

        progress.inc_and_draw(&bar, 1);
    }

    full_list.sort();
    full_list.dedup();

    progress.inc_and_draw(&bar, 1);

    let mut file = File::create(&format!("{}/{}.txt", name, out))?;
    file.write_all(&full_list.join("\n").as_bytes())?;

    progress.inc_and_draw(&bar, 1);

    Ok(())
}

fn parse_abp(file: String) -> Vec<String> {
    file.split('\n')
        .collect::<Vec<&str>>()
        .iter()
        .map(|s| s.split('!').collect::<Vec<&str>>()[0])
        .filter(|s| s != &"")
        .filter(|s| {
            !s.contains('<') && !s.contains(' ') && !s.contains('>') && !s.contains('\u{0009}')
        }) // Why is there html in this list
        .map(|s| s.to_string())
        .collect()
}

fn parse_host(file: String) -> Vec<String> {
    file.split('\n')
        .collect::<Vec<&str>>()
        .iter()
        .map(|s| s.split('#').collect::<Vec<&str>>()[0])
        .filter(|s| s != &"")
        .filter(|s| s != &"0.0.0.0")
        .filter(|s| !s.contains("localhost"))
        .map(|s| str::replace(s, "0.0.0.0 ", ""))
        .map(|s| str::replace(&s, "127.0.0.1 ", ""))
        .map(|s| format!("||{}^", s))
        .collect()
}

fn folder_exist(name: &str) -> io::Result<bool> {
    let mut path = env::current_dir()?;
    path.push(name);
    let metadata = fs::metadata(path)?;
    Ok(metadata.is_dir())
}
