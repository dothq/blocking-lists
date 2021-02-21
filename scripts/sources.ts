import { join } from 'path'

export const cachePath = join(__dirname, '..', 'cache')

// export const adsAndTrackers = [
//   [
//     'https://raw.githubusercontent.com/AdguardTeam/FiltersRegistry/master/filters/filter_2_English/filter.txt',
//     'adguard-english',
//   ],
//   [
//     'https://raw.githubusercontent.com/AdguardTeam/FiltersRegistry/master/filters/filter_3_Spyware/filter.txt',
//     'adguard-spyware',
//   ],
// ]

export const ADS_TRACKERS =
  'https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts'

export const FAKE_NEWS =
  'https://raw.githubusercontent.com/StevenBlack/hosts/master/extensions/fakenews/hosts'

export const GAMBLING =
  'https://raw.githubusercontent.com/StevenBlack/hosts/master/extensions/gambling/hosts'

export const SOCIAL =
  'https://raw.githubusercontent.com/StevenBlack/hosts/master/extensions/social/sinfonietta/hosts'
