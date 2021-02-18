import axios from 'axios'
import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { adsAndTrackers, cachePath } from './sources'
;(async () => {
  mkdirSync(cachePath)

  // Ads and trackers
  for (const list in adsAndTrackers) {
    console.log(adsAndTrackers[list][0])
    writeFileSync(
      `${join(cachePath, adsAndTrackers[list][1])}.txt`,
      (await axios.get(adsAndTrackers[list][0])).data
    )
  }
})()
