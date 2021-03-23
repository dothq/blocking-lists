use std::{
    env,
    error::Error,
    fs::{self, create_dir, File},
    io::{self, Write},
};

use serde::Deserialize;

#[derive(Debug, Deserialize)]
struct List {
    abp: Vec<String>,
    hosts: Vec<String>,
}

#[derive(Debug, Deserialize)]
struct Config {
    trackers: List,
    social: List,
    fake_news: List,
    gambling: List,
    ip_grabbers: List,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    // Welcome
    println!("ShieldDB updating...");

    // Create the out path
    if !folder_exist("out")? {
        create_dir("./out")?;
    }

    println!("Loading config...");

    // Read the config file for shieldDB
    let config_str = fs::read_to_string("config.yml")?;
    let config: Config = serde_yaml::from_str(&config_str)?;

    list(config.trackers, "trackers").await?;
    list(config.social, "social").await?;
    list(config.fake_news, "fake_news").await?;
    list(config.gambling, "gambling").await?;
    list(config.ip_grabbers, "ip_grabbers").await?;

    Ok(())
}

async fn list(list: List, name: &str) -> Result<(), Box<dyn Error>> {
    println!("Downloading lists...");
    let mut trackers_list = download_abp(list.abp).await?;
    let mut host_list = download_hosts(list.hosts).await?;
    trackers_list.append(&mut host_list);

    println!("Deduping...");
    trackers_list.sort();
    trackers_list.dedup();

    println!("Saving...");
    let mut file = File::create(&format!("out/{}.txt", name))?;
    file.write_all(&trackers_list.join("\n").as_bytes())?;

    Ok(())
}

async fn download_abp(lists: Vec<String>) -> Result<Vec<String>, Box<dyn Error>> {
    // Download files and store them in a scripts
    let mut list = Vec::new();
    for file in lists {
        let downloaded = reqwest::get(&file).await?.text().await?;

        let split: Vec<&str> = downloaded.split('\n').collect();

        let mut split = split
            .iter()
            .map(|s| s.split('!').collect::<Vec<&str>>()[0])
            .filter(|s| s != &"")
            .filter(|s| {
                !s.contains('<') && !s.contains(' ') && !s.contains('>') && !s.contains('\u{0009}')
            }) // Why is there html in this list
            .map(|s| s.to_string())
            .collect();

        list.append(&mut split);

        println!("Downloaded: '{}'", &file);
    }

    Ok(list)
}

async fn download_hosts(lists: Vec<String>) -> Result<Vec<String>, Box<dyn Error>> {
    // Download files and store them in a scripts
    let mut list = Vec::new();
    for file in lists {
        let downloaded = reqwest::get(&file).await?.text().await?;

        let split: Vec<&str> = downloaded.split('\n').collect();

        let mut split = split
            .iter()
            .map(|s| s.split('#').collect::<Vec<&str>>()[0])
            .filter(|s| s != &"")
            .filter(|s| s != &"0.0.0.0")
            .filter(|s| !s.contains("localhost"))
            .map(|s| str::replace(s, "0.0.0.0 ", ""))
            .map(|s| str::replace(&s, "127.0.0.1 ", ""))
            .map(|s| format!("||{}^", s))
            .collect();

        list.append(&mut split);

        println!("Downloaded: '{}'", &file);
    }

    Ok(list)
}

fn folder_exist(name: &str) -> io::Result<bool> {
    let mut path = env::current_dir()?;
    path.push(name);
    let metadata = fs::metadata(path)?;
    Ok(metadata.is_dir())
}
