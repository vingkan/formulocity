/* Deps */
const domify = require('domify')
const GameViz = require('../gameViz/viz')

/* Styles */
const css = require('./game.css')

/* Component */
module.exports = function Game({ stage } = {}) {
  const onQuitClickFns = []

  return {
    render() {
      const el = domify(`
        <div class="scene gameScene">
          <div id="grid-wrapper">
            <svg id="svg"></svg>
          </div>
          <button class="gameScene__quitButton">Quit</button>
        </div>
      `)

      // btn.addEventListener('click', (e) => {
      //  game.changePlayerFormula('sin(x)');
      // });

      const game = GameViz({
        output: el.querySelector('#svg'),
        stage: require(`../stages/${stage}.json`)
      })

      game.init()

      game.onEnd((results) => {
        console.log('save this to firebase:', results);
      })

      el.querySelector('.gameScene__quitButton').addEventListener('click', () => {
        onQuitClickFns.forEach(fn => fn())
      })

      return el
    },

    onQuitClick(fn) {
      if (typeof fn === 'function') {
        onQuitClickFns.push(fn)
      }
    }
  }
}
