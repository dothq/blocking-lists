import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { timeEnd, timeStart } from './logger'
import Parser from './parser'
import prepare from './prepare'
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
  const tokens = scanner.scanTokens()
  timeEnd('Tokenizing')

  timeStart('Parsing')
  const parser = new Parser(tokens)
  const parsed = parser.parse()
  timeEnd('Parsing')

  timeStart('Preparing')
  const prepared = prepare(parsed)
  timeEnd('Preparing')

  timeStart('Converting to JSON')
  const data = JSON.stringify(prepared)
  timeEnd('Converting to JSON')

  // Write to json files
  timeStart('Saving files')
  writeFileSync('./adsAndTrackers.json', data)
  timeEnd('Saving files')
})()
