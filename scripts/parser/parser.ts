import { match } from 'assert'
import Token from '../tokeniser/token'
import TokenType from '../tokenType'

enum ParserState {
  BLOCKED_DOMAIN,
  PASS,
}

class Parser {
  tokens: Token[]
  tokenId = 0

  constructor(tokens: Token[]) {
    this.tokens = tokens
  }

  parse() {
    let blockList = []

    while (this.tokenId < this.tokens.length) {
      let state: ParserState

      switch (this.currentToken().type) {
        case TokenType.DOMAIN_ANCHOR:
          state = ParserState.BLOCKED_DOMAIN
          break

        default:
          state = ParserState.PASS
          break
      }

      switch (state) {
        case ParserState.PASS:
          while (
            this.tokens[this.tokenId] &&
            this.tokens[this.tokenId].type !== TokenType.NEW_LINE
          )
            this.tokenId++
          break

        case ParserState.BLOCKED_DOMAIN:
          const url = this.nextValue()

          // Note: Separators aren't needed for exact paths, although I would prefer them
          if (this.peekNextToken().type === TokenType.SEPARATOR)
            this.nextToken()

          let options = []

          // If there are additional options, retrieve it
          if (this.peekNextToken().type === TokenType.OPTION_SEPARATOR) {
            this.nextValue()
            options = this.parseOptions()
          }

          console.log(`${url} ${options}`)

          break
      }

      this.tokenId++
    }
  }

  parseOptions(): {
    key: string
    value?: string
    exclude: boolean
    valueExclude?: boolean
  }[] {
    let options = []

    options.push(this.parseOption())

    // If there is a comma, parse the next item
    if (this.peekNextToken().type === TokenType.COMMA) {
      // Consume COMMA
      this.nextToken()

      // Parse next values recursively
      options = [...options, ...this.parseOptions()]
    }

    return options
  }

  parseOption(): {
    key: string
    value?: string
    exclude: boolean
    valueExclude?: boolean
  } {
    let exclude = false
    // Check if this value is excluded or not
    if (this.peekNextToken().type == TokenType.EXCLUDE) {
      exclude = true
      // Consume token
      this.nextToken()
    }

    const keyToken = this.nextToken()
    if (keyToken.type !== TokenType.STRING)
      throw new Error(
        `${
          keyToken.line
        }: Expected type string in option, found: \n    ${keyToken.toString()}`
      )
    const key = keyToken.literal as string

    let value: string
    let valueExclude

    // Check if it is a key-value assignment
    if (this.peekNextToken().type == TokenType.EQUALS) {
      valueExclude = false

      // Consume equals character
      this.nextToken()

      // Check if this value is excluded or not
      if (this.peekNextToken().type == TokenType.EXCLUDE) {
        valueExclude = true
        // Consume token
        this.nextToken()
      }

      // Retrieve the value
      const valueToken = this.nextToken()

      if (keyToken.type !== TokenType.STRING)
        throw new Error(
          `${
            keyToken.line
          }: Expected type string in option as value, found: \n    ${keyToken.toString()}`
        )

      value = valueToken.literal as string
    }

    return { key, value, valueExclude, exclude }
  }

  currentToken(): Token {
    return this.tokens[this.tokenId]
  }

  currentValue(): Object {
    return this.tokens[this.tokenId].literal
  }

  nextValue(): Object {
    this.tokenId++
    return this.tokens[this.tokenId].literal
  }

  nextToken(): Token {
    this.tokenId++
    return this.tokens[this.tokenId]
  }

  peekNextValue(): Object {
    return this.tokens[this.tokenId + 1]
  }

  peekNextToken(): Token {
    return this.tokens[this.tokenId + 1]
  }
}

export default Parser
