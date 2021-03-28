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
struct HeaderConfig {
    creator: String,
    product: String,
}

#[derive(Debug, Deserialize)]
struct Config {
    name: String,
    out: String,

    // Header configs
    header: Option<HeaderConfig>,

    // Lists
    lists: Vec<List>,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    // Read the config file for shieldDB
    let config_str = fs::read_to_string("config.yml")?;
    let config: Config = serde_yaml::from_str(&config_str)?;

    // Log a welcome message
    println!("{}", config.name);
    println!("===============");

    // Create the out path
    if !folder_exist(&config.out)? {
        create_dir(&config.out)?;
    }

    // Create header template string
    let mut header_template = String::new();

    if let Some(header) = config.header {
        header_template =
            format!(
"This is an automatically generated blocklist based on a number of third-party sources.
These sources have their own copyright and license. This list was generated for {} by {}

The list $list_name$ includes:$n$$list_sources$$n$", header.product, header.creator);

        header_template = header_template.replace("\n", "\n! ").replace("$n$", "\n");
        header_template = format!("! {}", header_template);
    }

    // Create the progress manager
    let mut progress = Progress::new();
    // Create the total list progress file
    let total_lists = progress.bar(config.lists.len(), "All lists");
    // Loop through all of the lists
    for list_config in config.lists {
        // Parse the list
        list(&list_config, &mut progress, &config.out, &header_template).await?;
        // Increment total progress bar
        progress.inc_and_draw(&total_lists, 1);
    }

    Ok(())
}

async fn list(
    list: &List,
    progress: &mut Progress,
    out: &str,
    header_template: &str,
) -> Result<(), Box<dyn Error>> {
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

    let file_contents = format!(
        "{}\n{}",
        header_template.replace("$list_name$", name).replace(
            "$list_sources$",
            &generate_sources_string(&list.abp, &list.hosts)
        ),
        full_list.join("\n")
    );

    let mut file = File::create(&format!("{}/{}.txt", out, name))?;
    file.write_all(&file_contents.as_bytes())?;

    progress.inc_and_draw(&bar, 1);

    Ok(())
}

fn generate_sources_string(abp: &Vec<String>, hosts: &Vec<String>) -> String {
    let mut final_str = String::new();

    for list in abp {
        final_str.push_str(&format!("! - {}", list));
    }

    for host in hosts {
        final_str.push_str(&format!("! - {}", host));
    }

    final_str
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
