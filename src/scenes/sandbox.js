/* Deps */
const domify = require('domify')

/* Styles */
const css = require('./sandbox.css')

/* Component */
module.exports = function Sandbox() {
  return {
    render() {
      return domify(`
        <div class="scene sandboxScene"></div>
      `)
    }
  }
}
