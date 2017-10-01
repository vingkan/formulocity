const math = require('mathjs')

module.exports = {
  evaluate(expr, scope = {}) {
    return math.eval(expr, scope)
  }
}
