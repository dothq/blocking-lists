import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { timeEnd, timeStart } from './logger'
// import Parser from './parser'
// import prepare from './prepare'
import { cachePath } from './sources'
// import Scanner from './tokeniser/scanner'

let adsAndTrackersBlocks = ''

const processHosts = (contents: string): string[] =>
  contents
    .split('\n')
    .filter((str) => str.includes('0.0.0.0') || str.includes('127.0.0.1'))
    .map((str) => str.split(' ')[1] || '')
    .filter((str) => str !== '')
    .filter((str) => str !== '0.0.0.0')
    .filter((str) => !str.includes('localhost'))
    .map((str) => `*://*.${str}/*`)

const processPaths = (contents: string) =>
  contents
    .split('\n')
    .map((str) => str.split('#')[0])
    .filter((str) => str != '')

const prepareDomains = (contents: string) =>
  contents
    .split('\n')
    .map((str) => str.split('#')[0])
    .filter((str) => str != '')
    .map((str) => `0.0.0.0 ${str}`)
    .join('\n')

const file = (cacheFile: string) => {
  let toBlock: string[] = []

  timeStart(`${cacheFile} hosts`)

  const hostContents = readFileSync(
    join(cachePath, `${cacheFile}_HOSTS.txt`)
  ).toString()
  toBlock = [...toBlock, ...processHosts(hostContents)]

  timeEnd(`${cacheFile} hosts`)

  timeStart(`${cacheFile} paths`)

  const pathContents = readFileSync(
    join(cachePath, `${cacheFile}_PATHS.txt`)
  ).toString()
  const pathFile = processPaths(pathContents)
  toBlock = [...toBlock, ...pathFile]

  const domainContents = readFileSync(
    join(cachePath, `${cacheFile}_DOMAINS.txt`)
  ).toString()
  const domainFile = processHosts(prepareDomains(domainContents))
  toBlock = [...toBlock, ...domainFile]

  timeEnd(`${cacheFile} paths`)

  writeFileSync(`./out/${cacheFile}.json`, JSON.stringify({ blocked: toBlock }))
}

;(async () => {
  file('ADS_TRACKERS')
  file('FAKE_NEWS')
  file('GAMBLING')
  file('SOCIAL')
})()
