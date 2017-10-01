const { evaluate } = require('./lib/evaluate')
const MathField = require('./mathField/mathField')
const GameViz = require('./gameViz/viz')

const STAGE = {
	title: 'My First Level',
	background: 'white',
	domain: [0, 100], 
	range: [-10, 30], 
	obstacles: [
		{
			sprite : 'cloud',
			x : 25,
			y : 20,
			width : 5,
			height : 3

		},
		{
			sprite : 'building1', //short building
			x : 24,
			y : -10,
			width : 15,
			height : 45
		},

		{
			sprite: 'building2', //dome
			x: 39,
			y: -10,
			width: 40,
			height: 60
			
		},
		{
			sprite : 'building3', //skinny medium 
			x : 76,
			y : -10,
			width : 10,
			height: 40
		},

		{
			sprite : 'building4', // skinnt tall
			x : 86,
			y : -10,
			width : 15,
			height : 60
		},
		
		{
			sprite : 'balloon',
			x : 60,
			y : 't',
			width: 5,
			height: 5
		},

		{
			sprite : 'balloon',
			x : 62,
			y: 't/2',
			width: 5,
			height: 5
		},

		{
			sprite : 'balloon',
			x : 64,
			y : 't/3',
			width: 5,
			height: 5
		},

		{
			sprite: 'bird',
			x: 50,
			y: '10 * sin(t)',
			width: 5,
			height: 5
		},
		{
			sprite: 'bird',
			x: '100 - t',
			y: '10 * sin(100 - t)',
			width: 5,
			height: 5
		}

		
	],
	coins: [
		

		{
			value : 1,
			x : 12,
			y : 't - 10'

		},

		{
			value : 1,
			x : 14,
			y : 't - 10'

		},

		{
			value : 1,
			x : 16,
			y : 't - 10'

		},

		{
			value : 1,
			x : 18,
			y : 't - 10'

		},

		{
			value : 1,
			x : 20,
			y : 't - 10'

		},

		{
			value : 5,
			x : 24,
			y : 0


		},

		{
			value : 5,
			x: 50,
			y: 75
		},

		{
			value : 10,
			x : 36,
			y : 20
		},


		{
			value : 10,
			x : 38,
			y : 20
		},


		{
			value : 10,
			x : 40,
			y : 20
		},

		{
			value : 10,
			x : 42,
			y : 18
		},
		{
			value : 10,
			x : 44,
			y : 16
		},

		{
			value : 10,
			x : 46,
			y : 12
		},
		{
			value : 10,
			x : 48,
			y : 12
		},
		{
			value : 10,
			x : 50,
			y : 12
		},
		{
			value : 10,
			x : 52,
			y : 14
		},
		{
			value : 10,
			x : 54,
			y : 16
		},
		{
			value : 10,
			x : 56,
			y : 14
		},
		{
			value : 10,
			x : 58,
			y : 12
		},
		{
			value : 10,
			x : 60,
			y : 12
		},
		{
			value : 10,
			x : 62,
			y : 14
		},
		{
			value : 10,
			x : 64,
			y : 16
		},
		{
			value : 10,
			x : 66,
			y : 18
		},
		{
			value : 10,
			x : 68,
			y : 20
		},

		{
			value : 10,
			x : 70,
			y : 20
		},
		{
			value : 10,
			x : 72,
			y : 20
		},


		{
			value: 10,
			x: 100,
			y: '10 * sin(t)'
		},
		{
			value: '175-t',
			x: '(25 * sin(t)) + 150',
			y: 75
		},

		{
			value: 30,
			x : 90,
			y : 15
		}
	]
};

let game = GameViz({
	output: '#svg',
	stage: STAGE
});

game.init();

// btn.addEventListener('click', (e) => {
// 	game.changePlayerFormula('sin(x)');
// });

game.onEnd((results) => {
	console.log('save this to firebase:', results);
});


const mathField = MathField()
document.body.appendChild(mathField.render())

document.body.appendChild(document.createElement('br'))

const button = document.createElement('button')
button.textContent = 'Calculate'
button.addEventListener('click', () => {
  console.log(evaluate(mathField.getExpr()))
})
document.body.appendChild(button)