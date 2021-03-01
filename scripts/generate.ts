import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { timeEnd, timeStart } from './logger'
// import Parser from './parser'
// import prepare from './prepare'
import { cachePath } from './sources'
// import Scanner from './tokeniser/scanner'

let adsAndTrackersBlocks = ''

const process = (contents: string) =>
  contents
    .split('\n')
    .filter((str) => str.includes('0.0.0.0') || str.includes('127.0.0.1'))
    .map((str) => str.split(' ')[1] || '')
    .filter((str) => str !== '')
    .filter((str) => str !== '0.0.0.0')
    .map((str) => `*://*.${str}/*`)

const file = (cacheFile: string) => {
  timeStart(cacheFile)
  const fileContents = readFileSync(
    join(cachePath, `${cacheFile}.txt`)
  ).toString()
  const data = process(fileContents)
  writeFileSync(`./out/${cacheFile}.json`, JSON.stringify({ blocked: data }))
  timeEnd(cacheFile)
}

;(async () => {
  file('ADS_TRACKERS')
  file('FAKE_NEWS')
  file('GAMBLING')
  file('SOCIAL')
})()
