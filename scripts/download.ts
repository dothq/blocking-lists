import axios from 'axios'
import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { timeEnd, timeStart } from './logger'
import {
  ADS_TRACKERS_HOSTS,
  cachePath,
  FAKE_NEWS_HOSTS,
  GAMBLING_HOSTS,
  SOCIAL_HOSTS,
} from './sources'
;(async () => {
  mkdirSync(cachePath)

  let file: string

  timeStart('Ads and trackers')
  file = await (
    await Promise.all(
      ADS_TRACKERS_HOSTS.map(async (url) => (await axios.get(url)).data)
    )
  ).join('\n')

  writeFileSync(`${join(cachePath, 'ADS_TRACKERS_HOSTS')}.txt`, file)
  timeEnd('Ads and trackers')

  timeStart('Fake News')
  file = await (
    await Promise.all(
      FAKE_NEWS_HOSTS.map(async (url) => (await axios.get(url)).data)
    )
  ).join('\n')

  writeFileSync(`${join(cachePath, 'FAKE_NEWS_HOSTS')}.txt`, file)
  timeEnd('Fake News')

  timeStart('Gambling')
  file = await (
    await Promise.all(
      GAMBLING_HOSTS.map(async (url) => (await axios.get(url)).data)
    )
  ).join('\n')

  writeFileSync(`${join(cachePath, 'GAMBLING_HOSTS')}.txt`, file)
  timeEnd('Gambling')

  timeStart('Social')
  file = await (
    await Promise.all(
      SOCIAL_HOSTS.map(async (url) => (await axios.get(url)).data)
    )
  ).join('\n')

  writeFileSync(`${join(cachePath, 'SOCIAL_HOSTS')}.txt`, file)
  timeEnd('Social')
})()
