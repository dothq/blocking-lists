import axios from 'axios'
import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { timeEnd, timeStart } from './logger'
import { ADS_TRACKERS, cachePath, FAKE_NEWS, GAMBLING, SOCIAL } from './sources'
;(async () => {
  mkdirSync(cachePath)

  timeStart('Ads and trackers')
  writeFileSync(
    `${join(cachePath, 'ADS_TRACKERS')}.txt`,
    (await axios.get(ADS_TRACKERS)).data
  )
  timeEnd('Ads and trackers')

  timeStart('Fake News')
  writeFileSync(
    `${join(cachePath, 'FAKE_NEWS')}.txt`,
    (await axios.get(FAKE_NEWS)).data
  )
  timeEnd('Fake News')

  timeStart('Gambling')
  writeFileSync(
    `${join(cachePath, 'GAMBLING')}.txt`,
    (await axios.get(GAMBLING)).data
  )
  timeEnd('Gambling')

  timeStart('Social')
  writeFileSync(
    `${join(cachePath, 'SOCIAL')}.txt`,
    (await axios.get(SOCIAL)).data
  )
  timeEnd('Social')
})()
