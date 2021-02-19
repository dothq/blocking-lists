import TokenType from '../tokenType'
import Token from './token'

class Scanner {
  source: string
  tokens: Token[] = []

  start = 0
  current = 0
  line = 1

  constructor(source: string) {
    this.source = source
  }

  scanTokens(): Token[] {
    while (!this.isAtEnd()) {
      this.start = this.current
      this.scanToken()
    }

    this.tokens.push(new Token(TokenType.EOF, '', null, this.line))

    let newTokens = []
    let currentToken: boolean | Token = false

    this.tokens.forEach((token) => {
      if (token.type !== TokenType.CHAR) {
        if (currentToken instanceof Token) {
          newTokens.push(currentToken)
          currentToken = false
        }

        newTokens.push(token)
      } else {
        // Is a string
        if (!(currentToken instanceof Token)) {
          currentToken = new Token(TokenType.NEW_LINE, '', '', token.line)
        }

        currentToken.literal += token.literal as string
      }
    })

    return newTokens
  }

  scanToken() {
    const c = this.advance()

    switch (c) {
      case '^':
        this.addToken(TokenType.SEPARATOR)
        break

      case '|':
        this.addToken(
          this.match('|') ? TokenType.DOMAIN_ANCHOR : TokenType.ANCHOR
        )
        break

      case '$':
        this.addToken(TokenType.OPTION_SEPARATOR)
        break

      case ',':
        this.addToken(TokenType.COMMA)
        break

      case '=':
        this.addToken(TokenType.EQUALS)
        break

      case '!':
        while (this.peek() != '\n' && !this.isAtEnd()) this.advance()
        break

      case '~':
        this.addToken(TokenType.EXCLUDE)
        break

      case '#':
        const nextChar = this.advance()

        if (nextChar === '#') {
          this.addToken(TokenType.CSS_SEPARATOR)
        } else if (nextChar === '@') {
          if (this.match('#')) this.addToken(TokenType.EXEMPT_CSS_SEPARATOR)
          else {
            const peek = this.peek()
            let context = ''

            for (let index = 0; index < 15; index++) {
              context += this.advance()
            }

            throw new Error(
              `${this.line}: Unknown token here, expected '#' got ${peek}. Context: \n ${context}`
            )
          }
        } else if (nextChar === '?') {
          if (this.match('#')) this.addToken(TokenType.HIDING_CSS_SEPARATOR)
          else {
            const peek = this.peek()
            let context = ''

            for (let index = 0; index < 15; index++) {
              context += this.advance()
            }

            throw new Error(
              `${this.line}: Unknown token here, expected '#' got ${peek}. Context: \n ${context}`
            )
          }
        } else if (nextChar === '$') {
          if (this.match('#')) this.addToken(TokenType.SNIPPET_SEPARATOR)
          else {
            this.addToken(TokenType.CHAR, '#')
            this.addToken(TokenType.SEPARATOR)
          }
        }
        break

      case '@':
        if (this.match('@')) {
          this.addToken(TokenType.EXEMPTION)
        } else {
          this.addToken(TokenType.CHAR, '@')
        }

        break

      case ' ':
      case '\r':
      case '\t':
        // Ignore whitespace
        break

      case '\n':
        this.line++
        this.addToken(TokenType.NEW_LINE)
        break

      default:
        this.addToken(TokenType.CHAR, c)
        break
    }
  }

  advance(): string {
    this.current++
    return this.source.charAt(this.current - 1)
  }

  match(expected: string): boolean {
    if (expected.length !== 1)
      throw new Error(`'${expected}' isn't of length 1`)
    if (this.isAtEnd()) return false
    if (this.source.charAt(this.current) != expected) return false

    this.current++
    return true
  }

  peek() {
    if (this.isAtEnd()) return '\0'
    return this.source.charAt(this.current)
  }

  addToken(type: TokenType, literal: Object = null) {
    const text = this.source.substr(this.start, this.current)
    this.tokens.push(new Token(type, text, literal, this.line))
  }

  isAtEnd(): boolean {
    return this.current >= this.source.length
  }
}

export default Scanner
