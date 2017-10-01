const { evaluate } = require('./lib/evaluate')
const MathField = require('./mathField/mathField')

const mathField = MathField()
document.body.appendChild(mathField.render())

document.body.appendChild(document.createElement('br'))

const button = document.createElement('button')
button.textContent = 'Calculate'
button.addEventListener('click', () => {
  console.log(evaluate(mathField.getExpr()))
})
document.body.appendChild(button)
