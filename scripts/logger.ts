export const print = (text: string | Uint8Array) => process.stdout.write(text)
export const clearLast = () => process.stdout.write('\r\x1b[K')
export const section = (overall: string, section: string) => {
  clearLast()
  print(`${overall}... ${section}`)
}

export const timeEnd = (text: string) => {
  clearLast()
  console.timeEnd(text)
}

export const timeStart = (text: string) => {
  print(`${text}...`)
  console.time(text)
}
