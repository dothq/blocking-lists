import { readdirSync, readFileSync, writeFileSync } from 'fs'

const optimise = (json: string[]) =>
  json.filter((c, i: number) => {
    console.log(i)
    return json.indexOf(c) === i
  })

readdirSync('./out').forEach((file) => {
  console.time(file)
  const path = `./out/${file}`
  const contents = JSON.parse(readFileSync(path).toString())
  writeFileSync(path, JSON.stringify({ blocked: optimise(contents.blocked) }))
  console.timeEnd(file)
})
