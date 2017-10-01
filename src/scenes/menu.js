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
          <h1>
            <img class="menuScene__title" src="../src/img/logo.png">
          </h1>
          <div class="menuScene__startButtonContainer">
            <div class="menuScene__startButton">
              <img role="button" src="../src/img/button2.png">
              <span>Start</span>
            </div>
            <div class="menuScene__startButtonShadow"></div>
          </div>
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
