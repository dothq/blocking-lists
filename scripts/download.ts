import axios from 'axios'
import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { timeEnd, timeStart } from './logger'
import { ADS_TRACKERS, cachePath, FAKE_NEWS, GAMBLING, SOCIAL } from './sources'
;(async () => {
  mkdirSync(cachePath)

  let file: string

  timeStart('Ads and trackers')
  file = await (
    await Promise.all(
      ADS_TRACKERS.map(async (url) => (await axios.get(url)).data)
    )
  ).join('\n')

  writeFileSync(`${join(cachePath, 'ADS_TRACKERS')}.txt`, file)
  timeEnd('Ads and trackers')

  timeStart('Fake News')
  file = await (
    await Promise.all(FAKE_NEWS.map(async (url) => (await axios.get(url)).data))
  ).join('\n')

  writeFileSync(`${join(cachePath, 'FAKE_NEWS')}.txt`, file)
  timeEnd('Fake News')

  timeStart('Gambling')
  file = await (
    await Promise.all(GAMBLING.map(async (url) => (await axios.get(url)).data))
  ).join('\n')

  writeFileSync(`${join(cachePath, 'GAMBLING')}.txt`, file)
  timeEnd('Gambling')

  timeStart('Social')
  file = await (
    await Promise.all(SOCIAL.map(async (url) => (await axios.get(url)).data))
  ).join('\n')

  writeFileSync(`${join(cachePath, 'SOCIAL')}.txt`, file)
  timeEnd('Social')
})()
