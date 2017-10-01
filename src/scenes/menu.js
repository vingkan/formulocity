/* Deps */
const domify = require('domify')

/* Styles */
const css = require('./menu.css')

/* Component */
module.exports = function Menu() {
  const onStartClickFns = []

  return {
    render() {
      const el = domify(`
        <div class="scene menuScene">
          <h1 class="menuScene__title">Formulocity</h1>
          <button class="menuScene__startButton">Start</button>
        </div>
      `)

      el.querySelector('.menuScene__startButton').addEventListener('click', () => {
        onStartClickFns.forEach(fn => fn())
      })

      return el
    },

    onStartClick(fn) {
      if (typeof fn === 'function') {
        onStartClickFns.push(fn)
      }
    }
  }
}
