import { join } from 'path'

export const cachePath = join(__dirname, '..', 'cache')
export const localPath = join(__dirname, '..', 'local')

export const ADS_TRACKERS_HOSTS = [
  'https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts',
  'https://www.github.developerdan.com/hosts/lists/ads-and-tracking-extended.txt',
  'https://blocklistproject.github.io/Lists/malware.txt',
  'https://blocklistproject.github.io/Lists/tracking.txt',
  'https://winhelp2002.mvps.org/hosts.txt',
  'https://raw.githubusercontent.com/anudeepND/blacklist/master/adservers.txt',
  'https://raw.githubusercontent.com/StevenBlack/hosts/master/data/adaway.org/hosts',
  'https://raw.githubusercontent.com/badmojr/1Hosts/master/Pro/hosts.txt',
  'https://block.energized.pro/unified/formats/hosts.txt',
  'https://pgl.yoyo.org/adservers/serverlist.php?hostformat=hosts;showintro=0',
]

export const FAKE_NEWS_HOSTS = [
  'https://raw.githubusercontent.com/StevenBlack/hosts/master/extensions/fakenews/hosts',
]

export const GAMBLING_HOSTS = [
  'https://raw.githubusercontent.com/StevenBlack/hosts/master/extensions/gambling/hosts',
]

export const SOCIAL_HOSTS = [
  'https://raw.githubusercontent.com/StevenBlack/hosts/master/extensions/social/sinfonietta/hosts',
  'https://block.energized.pro/extensions/social/formats/hosts.txt',
]

export const ADS_TRACKERS_PATHS: string[] = []

export const FAKE_NEWS_PATHS: string[] = []

export const GAMBLING_PATHS: string[] = []

export const SOCIAL_PATHS: string[] = []

export default {
  ADS_TRACKERS_HOSTS,
  cachePath,
  localPath,
  FAKE_NEWS_HOSTS,
  GAMBLING_HOSTS,
  SOCIAL_HOSTS,
  ADS_TRACKERS_PATHS,
  FAKE_NEWS_PATHS,
  GAMBLING_PATHS,
  SOCIAL_PATHS,
}
