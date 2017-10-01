/* Deps */
const math = require('mathjs')

/* Styles */
const css = require('./mathField.css')

/* Component */
module.exports = function MathField() {
  let input

  return {
    render() {
      const el = document.createElement('div')
      el.className = 'mathField'

      const inputContainer = document.createElement('div')
      inputContainer.className = 'mathField__inputContainer'
      el.appendChild(inputContainer)

      input = document.createElement('input')
      input.className = 'mathField__input'
      inputContainer.appendChild(input)

      const renderContainer = document.createElement('div')
      renderContainer.className = 'mathField__renderContainer'
      el.appendChild(renderContainer)

      const render = document.createElement('p')
      render.className = 'mathField__render'
      render.textContent = '$$$$'
      renderContainer.appendChild(render)

      input.addEventListener('input', () => {
        try {
          const latex = math.parse(input.value).toTex({ parenthesis: 'keep', implicit: 'show' })
          const elem = MathJax.Hub.getAllJax(render)[0]
          MathJax.Hub.Queue(['Text', elem, latex])
        } catch (err) {
          // TODO: could handle a parsing error here
        }
      })

      MathJax.Hub.Queue(['Typeset', MathJax.Hub, render])

      return el
    },

    getExpr() {
      return input.value
    }
  }
}
