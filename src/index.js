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
			width : 7,
			height : 5

		},
		{
			sprite : 'cloud',
			x : 29,
			y : 20,
			width : 7,
			height : 5

		},
		/*{
			sprite: 'building1', //short building
			x : 25,
			y : -10,
			width : 10,
			height : 6,
			fill: 'red'
		},*/

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
			x: '100 - t',
			y: '11 + (5 * sin(t))',
			width: 5,
			height: 5,
			fill: 'blue'
		},
		{
			sprite: 'bird', //updated
			x: '0 + t',
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
			x : 58,
			y : '(20 + (2* sin(0)))'
		},

    {
			value : 10,
			x : 60,
			y : '(20 + (2* sin(45)))'
		},
    	
		{
			value : 10,
			x : 62,
			y : '(20 + (2* sin(90)))'
		},
    {
			value : 10,
			x : 64,
			y : '(20 + (2* sin(135)))'
		},
		{
			value : 10,
			x : 66,
			y : '(20 + 2* sin(180))'
		},
    {
			value : 10,
			x : 68,
			y : '(20 + (2* sin(225)))'
		},
    {
			value : 10,
			x : 70,
			y : '(20 + (2* sin(270)))'
		},
    
		{
			value : 10,
			x : 72,
			y : '(20 + (2* sin(315)))'
		},
    
		{
			value : 10,
			x : 74,
			y : '(20 + (2* sin(0)))'
		},
    {
			value : 10,
			x : 76,
			y : '(20 + (2* sin(45)))'
		},
    
		{
			value : 10,
			x : 78,
			y : '(20 + (2* sin(90)))'
		},
		{
			value : 10,
			x : 80,
			y : '(20 + (2* sin(135)))'
		},
		{
			value : 10,
			x : 82,
			y : '(20 + (2* sin(180)))'
		},

		{
			value: 200,
			x: 99,
			y: '10 * sin(t)'
		},
		{
			value: 175,
			x: 90,
			y: '4*tan(t)'
		},
	]
};

const mathField = MathField()

let demo = GameViz({
	output: '#svg',
	stage: STAGE,
	dt: 0,
	step: 0,
	height: 400
});

demo.init();

let game = GameViz({
	output: '#svg',
	stage: STAGE,
	dt: 0.5,
	step: 50,
	height: 400
});


Array.from(document.querySelectorAll('[data-formula]')).forEach((btn) => {
	let formula = btn.dataset.formula;
	//mathField.renderExpr(formula, btn);
	btn.addEventListener('click', (e) => {
		console.log(formula)
		game.changePlayerFormula(formula);
	});
});


let sb = document.getElementById('start-button')
sb.addEventListener('click', (e) => {
	demo.clear();
	game.init();
})

game.changePlayerFormula('0');


let themData = JSON.parse(`{"actions":[{"type":"spawn","x":0,"y":0},{"type":"formula","t":0,"f":"2"},{"type":"formula","t":10,"f":"x"},{"type":"coin","t":12.5,"value":1,"did":"object-10"},{"type":"coin","t":14.5,"value":1,"did":"object-11"},{"type":"coin","t":16.5,"value":1,"did":"object-12"},{"type":"coin","t":18.5,"value":1,"did":"object-13"},{"type":"coin","t":20.5,"value":1,"did":"object-14"},{"type":"formula","t":24,"f":"10 * sin ((1/4) * x)"},{"type":"formula","t":37.5,"f":"x"},{"type":"obstacle","t":39.5,"did":"object-2"}],"success":false}`);



let themDiv = document.querySelector('#them');

themData.actions.filter((d) => {
	return d.type === 'formula';
}).forEach((d) => {


	let node = document.createElement('p');

	node.innerText = `Changed formula to y = ${d.f} at t = ${d.t}.`

	themDiv.appendChild(node);

});

function endItAll(results) {
console.log('save this to firebase:', results);
	let res = JSON.stringify(results);
	localStorage.setItem('game_results', res);
	game.clear();

	let myVex = vex.dialog.confirm({
		message: 'Nice try! Time to reflect on the game.',
		buttons: [
			{
				type: 'button',
				text: 'Play Again',
				className: 'vex-dialog-button-primary',
				click: (e) => {
					console.log('play again')
					myVex.close();
					game = GameViz({
						output: '#svg',
						stage: STAGE,
						dt: 0.5,
						step: 50,
						height: 400
					});
					game.init();
					game.onEnd(endItAll);
				}
			},
			{
				type: 'button',
				text: 'Go to Reflection',
				className: 'vex-dialog-button-secondary',
				click: (e) => {
					console.log('refl')
					myVex.close();

				let re = GameViz({
					output: '#reflect-svg',
					stage: STAGE,
					dt: 0,
					step: 0,
					height: 400
				});

				re.init();

					document.querySelector('#game-div').style.display = 'none';
					document.querySelector('#reflect-div').style.display = 'block';

				let meDiv = document.querySelector('#me');

				results.actions.filter((d) => {
					return d.type !== 'spawn';
				}).forEach((d) => {


					let node2 = document.createElement('p');

					let msg2 = ``;

					switch (d.type) {
						case 'formula':
							msg2 = `Changed formula to y = ${d.f} at t = ${d.t}.`
							break;
						case 'coin':
							msg2 = `Picked up a coin worth ${d.value} at t = ${d.t}.`
							break;
						case 'obstacle':
							msg2 = `Crashed into an obstacle at t = ${d.t}.`
							break;
					}

					node2.innerText = msg2

					meDiv.appendChild(node2);

				});


				}
			}
		],
		callback: (val) => {
			console.log(val)
		}
	});

}

game.onEnd((results) => {
	endItAll(results);


});

let toolkit = document.getElementById('toolkit')

let mathOut = document.getElementById('math-out');

mathOut.appendChild(mathField.render())

const button = document.getElementById('calc-button')
button.textContent = 'Add to Toolkit'
button.addEventListener('click', () => {
  //console.log(evaluate(mathField.getExpr()))
  let fm = mathField.getExpr()
  console.log(fm)
  let b = document.createElement('button');
  b.classList.add('button')
  b.classList.add('is-primary')
  b.classList.add('is-outlined')
  b.innerText = fm;
  let parts = fm.split('y = ');
  let data = parts[parts.length - 1];
  b.dataset.formula = data;
  b.addEventListener('click', (e) => {
		console.log(data)
		game.changePlayerFormula(data);
	});
  toolkit.appendChild(b)

})
//mathOut.appendChild(button)



