import TokenType from '../tokenType'

class Token {
  type: TokenType
  //lexeme: string
  literal: Object
  line: number
  index = 0

  constructor(type: TokenType, lexeme: string, literal: Object, line: number) {
    this.type = type
    this.literal = literal
    this.line = line
  }

  toString() {
    return `${this.line}: ${this.type} ${this.literal} ${
      this.index !== 0 ? this.index : ''
    }`
  }
}

export default Token
