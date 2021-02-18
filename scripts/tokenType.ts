enum TokenType {
  SEPARATOR, // ^
  DOMAIN_ANCHOR, // ||
  ANCHOR, // |
  OPTION_SEPARATOR, // $
  COMMA, // ,
  EQUALS, // =
  EXEMPTION, // @@
  EXCLUDE, // ~
  CSS_SEPARATOR, // ##
  EXEMPT_CSS_SEPARATOR, // #@#
  HIDING_CSS_SEPARATOR, // #?#
  SNIPPET_SEPARATOR, // #$#
  CHAR,
  EOF,
}

export default TokenType
