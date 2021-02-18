import { join } from 'path'

export const cachePath = join(__dirname, '..', 'cache')

export const adsAndTrackers = [
  [
    'https://raw.githubusercontent.com/AdguardTeam/FiltersRegistry/master/filters/filter_2_English/filter.txt',
    'adguard-english',
  ],
  // [
  //   'https://raw.githubusercontent.com/AdguardTeam/FiltersRegistry/master/filters/filter_3_Spyware/filter.txt',
  //   'adguard-spyware',
  // ],
]
