const imageExtensions = require('image-extensions')

import { ParserResponse } from './parser'

const images = imageExtensions.map((img: string) => `.${img}`)

const contains = (arr: any[], key: any) => {
  const value = arr.find((o) => o.key === key)

  return typeof value !== 'undefined'
}

const multipleExtensions = (
  blocked: any[],
  template: string,
  extensions: string[]
) => {
  extensions.forEach((ext) => blocked.push(`${template}${ext}`))
}

const prepare = (parsed: ParserResponse) => {
  const blocked: string[] = []

  parsed.blockList.forEach((item) => {
    // Pass exact paths through
    if (item.exact) {
      blocked.push(`*://\*.${item.url}`)
      return
    }

    // If there are no options and if they are, add it in to the blockList
    if (item.options.length == 0) {
      blocked.push(`*://\*.${item.url}/*`)
      return
    }

    if (contains(item.options, { key: 'third-party', exclude: false })) {
      blocked.push(`*://\*.${item.url}/*`)
    }

    if (contains(item.options, { key: 'popup', exclude: false })) {
      multipleExtensions(blocked, `*://\*.${item.url}/*`, ['.html', '.htm'])
    }

    if (contains(item.options, { key: 'script', exclude: false })) {
      blocked.push(`*://\*.${item.url}/*.js`)
    }

    if (contains(item.options, { key: 'stylesheet', exclude: false })) {
      blocked.push(`*://\*.${item.url}/*.css`)
    }

    if (contains(item.options, { key: 'image', exclude: false })) {
      multipleExtensions(blocked, `*://\*.${item.url}/*`, images)
    }
  })

  return { blocked }
}

export default prepare
