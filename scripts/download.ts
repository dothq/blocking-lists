import axios from 'axios'
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { timeEnd, timeStart } from './logger'
import HOSTS_AND_PATHS, { cachePath, localPath } from './sources'

const download = async (
  key:
    | 'ADS_TRACKERS_HOSTS'
    | 'FAKE_NEWS_HOSTS'
    | 'GAMBLING_HOSTS'
    | 'SOCIAL_HOSTS'
    | 'ADS_TRACKERS_PATHS'
    | 'FAKE_NEWS_PATHS'
    | 'GAMBLING_PATHS'
    | 'SOCIAL_PATHS'
) => {
  timeStart(key)

  const localFile: string = join(localPath, `${key}.txt`)
  const remoteFiles: string[] = HOSTS_AND_PATHS[key]

  let file = (
    await Promise.all(
      remoteFiles.map(async (url) => (await axios.get(url)).data)
    )
  ).join('\n')

  file += readFileSync(localFile)

  writeFileSync(`${join(cachePath, key)}.txt`, file)

  timeEnd(key)
}

;(async () => {
  mkdirSync(cachePath)

  await download('ADS_TRACKERS_HOSTS')
  await download('ADS_TRACKERS_PATHS')
  await download('FAKE_NEWS_HOSTS')
  await download('FAKE_NEWS_PATHS')
  await download('GAMBLING_HOSTS')
  await download('GAMBLING_PATHS')
  await download('SOCIAL_HOSTS')
  await download('SOCIAL_PATHS')
})()
