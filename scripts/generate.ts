import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { timeEnd, timeStart } from './logger'
import Parser from './parser'
import prepare from './prepare'
import { cachePath } from './sources'
import Scanner from './tokeniser/scanner'

let adsAndTrackersBlocks = ''

const process = (contents: string) =>
  contents
    .split('\n')
    .filter((str) => str.includes('0.0.0.0'))
    .map((str) => str.split(' ')[1] || '')
    .filter((str) => str !== '')
    .filter((str) => str !== '0.0.0.0')
    .map((str) => `*://*.${str}/*`)

const file = (cacheFile: string, outFile: string) => {
  timeStart(cacheFile)
  const fileContents = readFileSync(
    join(cachePath, `${cacheFile}.txt`)
  ).toString()
  const data = process(fileContents)
  writeFileSync(outFile, JSON.stringify({ blocked: data }))
  timeEnd(cacheFile)
}

;(async () => {
  file('ADS_TRACKERS', './ADS_TRACKERS.json')
  file('FAKE_NEWS', './FAKE_NEWS.json')
  file('GAMBLING', './GAMBLING.json')
  file('SOCIAL', './SOCIAL.json')
})()
