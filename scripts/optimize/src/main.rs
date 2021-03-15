use serde::{Deserialize, Serialize};
use serde_json;
use std::fs;

#[derive(Serialize, Deserialize, Debug)]
struct BlockList {
    blocked: Vec<String>,
}

fn main() {
    let paths = fs::read_dir("../../out/").unwrap();

    for path in paths {
        let path = path.unwrap().path();

        println!("{:?}", path);
        let data = fs::read_to_string(&path).expect("Unable to read file");
        let mut res: BlockList = serde_json::from_str(&data).expect("Unable to parse");
        
        // Note that rust requires a vec to be sorted before it can be deduped
        res.blocked.sort();
        res.blocked.dedup();

        fs::write(path, serde_json::to_string(&res).unwrap()).unwrap();
    }
}
