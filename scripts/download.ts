import axios from 'axios'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
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
    | 'ADS_TRACKERS_DOMAINS'
    | 'FAKE_NEWS_DOMAINS'
    | 'GAMBLING_DOMAINS'
    | 'SOCIAL_DOMAINS'
) => {
  timeStart(key)

  const localFile: string = join(localPath, `${key}.txt`)
  const remoteFiles: string[] = HOSTS_AND_PATHS[key]

  // Check if the local file exists and if not, add it
  if (!existsSync(localFile)) {
    writeFileSync(
      localFile,
      `# This is the local file for ${key}. Use it wisely! \n`
    )
  }

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

  // Hosts
  await download('ADS_TRACKERS_HOSTS')
  await download('FAKE_NEWS_HOSTS')
  await download('GAMBLING_HOSTS')
  await download('SOCIAL_HOSTS')

  // Paths
  await download('ADS_TRACKERS_PATHS')
  await download('FAKE_NEWS_PATHS')
  await download('GAMBLING_PATHS')
  await download('SOCIAL_PATHS')

  // Domains
  await download('ADS_TRACKERS_DOMAINS')
  await download('FAKE_NEWS_DOMAINS')
  await download('GAMBLING_DOMAINS')
  await download('SOCIAL_DOMAINS')
})()
