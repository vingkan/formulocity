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
			sprite: 'building1', //short building
			x : 25,
			y : -10,
			width : 10,
			height : 6,
			fill: 'red'
		},

		{
			sprite: 'building2', //dome
			x: 39,
			y: -10,
			width: 40,
			height: 20,
			fill: 'coral'
			
		},
		{
			sprite : 'building3', //skinny medium 
			x : 76,
			y : -10,
			width : 10,
			height: 20,
			fill: 'purple'
		},

		{
			sprite : 'building4', // skinnt tall
			x : 86,
			y : -10,
			width : 15,
			height : 20,
			fill: 'lime'
		},
		
		{
			sprite : 'balloon',
			x : 60,
			y : 't',
			width: 2.5,
			height: 5,
			fill: 'green'
		},

		{
			sprite : 'balloon',
			x : 62,
			y: 't/2',
			width: 2.5,
			height: 5,
			fill: 'green'
		},

		{
			sprite : 'balloon',
			x : 64,
			y : 't/3',
			width: 2.5,
			height: 5,
			fill: 'green'
		},

		{
			sprite: 'bird',//updated
			x: '50 - t',
			y: '11 + (5 * sin(t))',
			width: 5,
			height: 5,
			fill: 'blue'
		},
		{
			sprite: 'bird', //updated
			x: 0,
			y: '11+ (5 * cos(t))',
			width: 5,
			height: 5,
			fill: 'blue'
		}

		
	],
	coins: [
		

		{
			value : 1,
			x : 12,
			y : 2

		},

		{
			value : 1,
			x : 14,
			y : 4

		},

		{
			value : 1,
			x : 16,
			y : 6

		},

		{
			value : 1,
			x : 18,
			y : 8

		},

		{
			value : 1,
			x : 20,
			y : 10

		},

		{
			value : 5,
			x : 30,
			y : 0


		},

		{
			value : 10,
			x : 50,
			y : '(15 + 2* sin(0))'
		},


		{
			value : 10,
			x : 52,
			y :  '(15 + 2* sin(90))'
		},


		{
			value : 10,
			x : 54,
			y :'(15 + 2* sin(180))'
		},

		{
			value : 10,
			x : 56,
			y : '(15 + 2* sin(270))'
		},
		{
			value : 10,
			x : 58,
			y : '(15 + 2* sin(0))'
		},

		{
			value : 10,
			x : 60,
			y : '(15 + 2* sin(90))'
		},
		{
			value : 10,
			x : 62,
			y : '(15 + 2* sin(180))'
		},
		{
			value : 10,
			x : 64,
			y : '(15 + 2* sin(270))'
		},
		{
			value : 10,
			x : 66,
			y : '(15 + 2* sin(0))'
		},
		{
			value : 10,
			x : 68,
			y : '(15 + 2* sin(90))'
		},
		{
			value : 10,
			x : 70,
			y : '(15 + 2* sin(180))'
		},
		{
			value : 10,
			x : 72,
			y : '(15 + 2* sin(270))'
		},
		{
			value : 10,
			x : 74,
			y : '(15 + 2* sin(0))'
		},
		{
			value : 10,
			x : 76,
			y : '(15 + 2* sin(360))'
		},
		{
			value : 10,
			x : 78,
			y : '(15 + 2* sin(90))'
		},
		{
			value : 10,
			x : 80,
			y : '(15 + 2* sin(180))'
		},


		{
			value: 200,
			x: 100,
			y: '10 * sin(t)'
		},
		{
			value: 175,
			x: 90,
			y: 'tan(t)'
		},

	]
};

let game = GameViz({
	output: '#svg',
	stage: STAGE,
	dt: 1
});

game.init();
game.changePlayerFormula('10 * sin(x)');

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