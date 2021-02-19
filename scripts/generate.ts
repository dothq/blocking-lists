import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { timeEnd, timeStart } from './logger'
import { adsAndTrackers, cachePath } from './sources'
import Scanner from './tokeniser/scanner'

let adsAndTrackersBlocks = ''

;(async () => {
  timeStart('Loading data')
  // Ads and trackers
  for (const list in adsAndTrackers) {
    adsAndTrackersBlocks += readFileSync(
      `${join(cachePath, adsAndTrackers[list][1])}.txt`
    ).toString()
  }

  // Remove annoying % signs, #@?#, #$?#, #@$#
  adsAndTrackersBlocks = adsAndTrackersBlocks
    .split('\n')
    .map((s) => {
      if (s.includes('%')) {
        return '!' + s
      } else {
        return s
      }
    })
    .map((s) => {
      if (s.includes('#@?#')) {
        return '!' + s
      } else {
        return s
      }
    })
    .map((s) => {
      if (s.includes('#$?#')) {
        return '!' + s
      } else {
        return s
      }
    })
    .map((s) => {
      if (s.includes('#@$#')) {
        return '!' + s
      } else {
        return s
      }
    })
    .join('\n')

  timeEnd('Loading data')

  timeStart('Tokenizing')
  const scanner = new Scanner(adsAndTrackersBlocks)
  const parsed = scanner.scanTokens()
  timeEnd('Tokenizing')

  timeStart('Converting to JSON')
  const data = JSON.stringify(parsed.slice(0, 10000))
  timeEnd('Converting to JSON')

  // Write to json files
  timeStart('Saving files')
  writeFileSync('./adsAndTrackers.json', data)
  timeEnd('Saving files')
})()
