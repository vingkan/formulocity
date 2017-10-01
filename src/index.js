function SceneManager() {
  const css = require('./scenes/scene.css')
  const rootEl = document.getElementById('root')
  const onRenderFns = []

  return {
    renderScene(name, opts = {}) {
      while (rootEl.firstChild) {
        rootEl.removeChild(rootEl.firstChild)
      }
      const scene = require(`./scenes/${name}`)(opts)
      rootEl.appendChild(scene.render())
      onRenderFns.forEach(fn => fn(name, scene))
      return scene
    },

    onRender(fn) {
      if (typeof fn === 'function') {
        onRenderFns.push(fn)
      }
    }
  }
}

const sceneManager = SceneManager()

// Define navigation between scenes
sceneManager.onRender((name, scene) => {
  switch (name) {
    case 'menu':
      scene.onStartClick(() => {
        sceneManager.renderScene('game', { stage: 'stage1' })
      })
      break;
    case 'game':
      scene.onQuitClick(() => {
        sceneManager.renderScene('menu')
      })
      break;
  }
})

// Kickoff game with menu
sceneManager.renderScene('menu')
