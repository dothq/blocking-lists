import { join } from 'path'

export const cachePath = join(__dirname, '..', 'cache')

export const ADS_TRACKERS = [
  'https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts',
//  'https://www.github.developerdan.com/hosts/lists/ads-and-tracking-extended.txt',
  'https://blocklistproject.github.io/Lists/ads.txt',
  'https://blocklistproject.github.io/Lists/malware.txt',
  'https://blocklistproject.github.io/Lists/tracking.txt',
]

export const FAKE_NEWS = [
  'https://raw.githubusercontent.com/StevenBlack/hosts/master/extensions/fakenews/hosts',
]

export const GAMBLING = [
  'https://raw.githubusercontent.com/StevenBlack/hosts/master/extensions/gambling/hosts',
]

export const SOCIAL = [
  'https://raw.githubusercontent.com/StevenBlack/hosts/master/extensions/social/sinfonietta/hosts',
]
