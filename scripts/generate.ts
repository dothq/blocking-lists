import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { adsAndTrackers, cachePath } from './sources'
import Scanner from './tokeniser/scanner'

let adsAndTrackersBlocks = ''

const phishingAndMalware = []
let phishingAndMalwareBlocks = []

const fakeNews = []
let fakeNewsBlocks = []

const general = []
let generalBlocks = []

const parseFile = (file: string) => {
  let fullyBlockedDomains = []
  let exactlyBlockedDomains = []
  let exemptions = []

  file
    .split('\n')
    .map((s) => s.split('!')[0]) // Strip comments from the file
    .map((s) => s.replace('\r', ''))
    .filter((s) => s !== '\n') // Strip newlines from the file
    .filter((s) => !s.includes('#')) // TODO: Implement style parsing and inclusion (requires Dot Shield support)
    .map((s) => {
      // For the case of a fully blocked domains. The syntax for this is ||<domain>^
      // That will then block:
      // https://something.<domain>/
      // http://<domain>/
      // http://<domain>:1234/
      if (s.substr(0, 2) == '||') {
        fullyBlockedDomains.push(s.replace('||', '').split('^')[0])

        return null
      }
      //! This filter appears to output gibberish, so I am skipping it
      // Case for blocking exact address. The syntax is |https://<domain>/|
      // That will then block:
      // https://<domain>
      // But wont block
      // http://example.com/foo.gif
      // http://example.info/redirect/http://example.com/
      // else if (s.substr(0, 2) == '|h') {
      //   exactlyBlockedDomains.push(s.split('|')[1])
      // }
      // This case is for exemptions to filter rules. The syntax is @@||<domain>^
      else if (s.substr(0, 4) == '@@||') {
        exemptions.push(s.replace('@@||', '').split('^')[0].split('$')[0])

        return null
      }

      return s
    })
    .filter((s) => s == null)

  // TODO: Implement filtering for exemptions

  return fullyBlockedDomains
}

;(async () => {
  // Ads and trackers
  for (const list in adsAndTrackers) {
    console.log(adsAndTrackers[list][1])
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

  const scanner = new Scanner(adsAndTrackersBlocks)
  console.log('Parsing')

  const parsed = scanner.scanTokens()

  console.log('Stringifying')

  const data = JSON.stringify(parsed.slice(0, 10000))
  console.log('Saving files')

  // Write to json files
  writeFileSync('./adsAndTrackers.json', data)
})()
