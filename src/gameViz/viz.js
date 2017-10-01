const { evaluate } = require('../lib/evaluate');

module.exports = function GameViz(params) {

	const stage = params.stage;

	let desired_height = params.height || 300;
	let world_width = (stage.domain[1] - stage.domain[0]);
	let world_height = (stage.range[1] - stage.range[0]);

	const GRID_SCALE = desired_height / world_height;
	const GRID_STEP = 5;
	const DT = params.dt// || 0.5;
	const T_STEP = params.step// || 25;
	const PLAYER_OFFSET = 1.5;
	
	let finalCallback;

	const SPRITE_MAP = {
		'building1': true,
		'building2': true,
		'building3': true,
		'building4': true,
		'building5': true,
		'building6': true,
		'balloon': true,
		'gold_coin': true,
		'cloud': true,
		'bird': true,
		'sprite': true
	}

	let yStart = 0;
	let lastChangeTime = 0;
	let newPlayerFormula = false;
	let currentPlayerFormula = '0';

	function getPlayerFormula(t) {
		return {
			y: currentPlayerFormula
		};
	}

	let xL = 0;
	let yL = 0;

	let once = true;

	let collidedWith = {};
	let tree = [];
	let playing = true;

	function initAnimations(params) {
			if (newPlayerFormula) {
				//console.log(xL, yL)
				yStart = yL;
				lastChangeTime = params.t;
				currentPlayerFormula = newPlayerFormula;
				newPlayerFormula = false;
				tree.push({
					type: 'formula',
					t: params.t,
					f: currentPlayerFormula
				});
			}
		return new Promise((resolveAll, rejectAll) => {

			let objects = params.objects;
			let scaler = params.scaler;

			if (objects.length === 0) {
				playing = false;
				resolveAll({
					actions: tree,
					success: true
				});
			}
			
			objects.forEach((d, idx) => {
				let did = `object-${idx}`;
				let p = {
					x: xL,
					y: yL
				}
				if (!d.isPlayer) {
					if (d.data.type === 'coin') {
						let x = scaler.getX(d.data, {t: params.t});
						let y = scaler.getY(d.data, {t: params.t});
						let c = {
							x: x,
							y: y
						}
						let col = didCollideWithPoint(p, c, scaleSize(2));
						if (col) {
							if (!(did in collidedWith)) {
								//console.log('hit: ', d.data)
								tree.push({
									type: 'coin',
									t: params.t,
									value: d.data.value || 0,
									did: did
								});
								collidedWith[did] = true;
							}
						}
					} else {
						let x = scaler.getX(d.data, {t: params.t});
						let y = scaler.getY(d.data, {t: params.t});
						let rect = {
							x: x,
							y: y,
							w: scaleSize(d.data.width),
							h: scaleSize(d.data.height)
						}
						let col = didCollideWithRect(p, rect);
						//console.log(col, p, rect)
						if (col) {
							if (!(did in collidedWith)) {
								//console.log('hit: ', d.data);
								tree.push({
									type: 'obstacle',
									t: params.t,
									did: did
								});
								collidedWith[did] = true;
							}
						}
					}
				}
			});

			let animations = [];
			objects.forEach((obj, idx) => {
				let did = `object-${idx}`;
				let x = scaler.getX(obj.data, {t: params.t});
				let y = scaler.getY(obj.data, {t: params.t});
				let attr = {
					x: x,
					y: y
				}
				if (obj.isPlayer) {
					//console.log(yStart)
					let nX = scaler.getX({x: 't'}, {t: params.t})
					let nY = scaler.getY({y: currentPlayerFormula}, {x: params.t - lastChangeTime});// - yStart;//scaleSize(10)
					yStart = 0;
					//console.log(nY)
					attr = {
						x: nX,
						y: nY// + yStart
					}
					// let m = (attr.y - yL) / (attr.x - xL);
					// let deg = (Math.atan(m) / (2 * Math.PI)) * 360;
					// let tstr = `r${deg},${xL},${yL}`;
					// console.log(m, deg, tstr)
					// obj.g.transform(tstr);
					params.s.line(xL, yL, attr.x, attr.y).attr({
						stroke: 'red'
					});
					xL = attr.x;
					yL = nY//attr.y;
				}
				if (did in collidedWith) {
					if (obj.data.type === 'coin') {
						obj.g.attr({
							visibility: 'hidden'
						});
					} else {
						playing = false;
						resolveAll({
							actions: tree,
							success: false
						});
					}
				} 
				obj.g.animate(attr, params.step);
			});

			//Promise.all(animations).then((done) => {
			setTimeout(() => {
				params.t += params.dt;
				if (params.t < params.max) {
					if (playing) {
						initAnimations(params).then(resolveAll).catch(rejectAll);
					}
				} else {
					playing = false;
					resolveAll({
						actions: tree,
						success: true
					});
				}
			}, params.step);
			//});

		});
	}

	function scaleValue(val, worldBounds, viewBounds) {
		let worldVal = val - worldBounds[0];
		let ratio = worldVal / (worldBounds[1] - worldBounds[0]);
		let viewVal = (ratio * (viewBounds[1] - viewBounds[0])) + viewBounds[0];
		return viewVal;
	}

	function scaleSize(val) {
		return val * GRID_SCALE;
	}

	function Scaler(params) {
		let wb = params.world;
		let vb = params.view;
		return {
			getX (data, payload) {
				let val;
				if (typeof data.x === 'string') {
					val = evaluate(data.x, payload);
				} else {
					val = data.x;
				}
				let n = scaleValue(val, wb.x, vb.x);
				return n;
			},
			getY (data, payload) {
				let val;
				if (typeof data.y === 'string') {
					val = evaluate(data.y, payload);
				} else {
					val = data.y;
				}
				let n = scaleValue(val, wb.y, vb.y);
				if (data.scaledHeight) {
					n -= data.scaledHeight;
				}
				return n;
			}
		}
	}

	function didCollideWithPoint(p, c, l) {
		let limit = l || 0;
		let inX = Math.abs(p.x - c.x) <= l;
		let inY = Math.abs(p.y - c.y) <= l;
		return inX && inY;
	}

	function didCollideWithRect(p, rect, l) {
		let limit = l || 0;
		let xs1 = rect.x;
		let xs2 = rect.x + rect.w;
		let inX = Math.min(xs1, xs2) <= p.x && p.x <= Math.max(xs1, xs2);

		let ys1 = rect.y;
		let ys2 = rect.y + rect.h;
		let inY = Math.min(ys1, ys2) <= p.y && p.y <= Math.max(ys1, ys2);

		// if (inX && inY) {
		// 	console.log(`${Math.min(xs1, xs2)} <= ${p.x} && ${p.x} <= ${Math.max(xs1, xs2)};`);
		// 	console.log(`${Math.min(ys1, ys2)} <= ${p.y} && ${p.y} <= ${Math.max(ys1, ys2)};`);
		// }

		return inX && inY;
	}

	function drawGridLines(s, wb, vb, opt) {
		for (let ix = wb.x[0]; ix <= wb.x[1]; ix += opt.step) {
			let line = s.line().attr({
				x1: scaleValue(ix, wb.x, vb.x),
				y1: scaleValue(wb.y[0], wb.y, vb.y),
				x2: scaleValue(ix, wb.x, vb.x),
				y2: scaleValue(wb.y[1], wb.y, vb.y),
				stroke: opt.stroke,
				strokeWidth: ix === 0 ? 4 : 0.25
			});
			s.text(scaleValue(ix, wb.x, vb.x), vb.y[0], ix + '').attr({
				fill: '#black',
				fontFamily: 'sans-serif',
				fontSize: scaleSize(2)
			});
		}
		for (let iy = wb.y[0]; iy <= wb.y[1]; iy += opt.step) {
			let line = s.line().attr({
				x1: scaleValue(wb.x[0], wb.x, vb.x),
				y1: scaleValue(iy, wb.y, vb.y),
				x2: scaleValue(wb.x[1], wb.x, vb.x),
				y2: scaleValue(iy, wb.y, vb.y),
				stroke: opt.stroke,
				strokeWidth: iy === 0 ? 2 : 0.25
			});
			s.text(vb.x[0], scaleValue(iy, wb.y, vb.y), iy + '').attr({
				fill: '#black',
				fontFamily: 'sans-serif',
				fontSize: scaleSize(2)
			});
		}
	}

	let s;
	
	return {

		init () {

			s = Snap(params.output);

			s.attr({
				width: GRID_SCALE * world_width,
				height: GRID_SCALE * world_height
			});

			console.log('width:', GRID_SCALE * world_width);
			console.log('height:', GRID_SCALE * world_height);

			let WIDTH = s.node.width.baseVal.value;
			let HEIGHT = s.node.height.baseVal.value;

			const WORLD = {
				x: stage.domain,
				y: stage.range
			};

			const VIEW = {
				x: [0, WIDTH],
				y: [HEIGHT, 0]
			};

			let background = s.rect(0, 0, WIDTH, HEIGHT);
			background.attr({
				fill: '#BEEAF1'
			});

			let objects = [];
			let scaler = Scaler({
				world: WORLD,
				view: VIEW
			});

			let player = {
				type: 'player',
				sprite: 'sprite',
				x: 0,
				y: 0,
				width: 2 * PLAYER_OFFSET,
				height: 2 * PLAYER_OFFSET
			}

			let thingies = [];
			stage.obstacles.forEach((d) => {
				thingies.push(d);
			});
			stage.coins.forEach((d) => {
				d.type = 'coin';
				thingies.push(d);
			});
			thingies.push(player);

			thingies.forEach((data) => {
				let xS = scaler.getX(data, {t: 0});
				let yS = scaler.getY(data, {t: 0});
				let wS = 0;
				let hS = 0;
				let attr = {
					x: xS,
					y: yS
				}
				let g;


				if (data.fill) {
					//console.log(data)
					attr.fill = data.fill;
				}

				if (data.type === 'coin') {
					//let rS = scaleSize(1);
					//g = s.circle(xS, yS, rS).attr(attr);
					wS = scaleSize(2);
					hS = scaleSize(2);
					data.scaledHeight = hS;
					attr.width = wS;
					attr.height = hS;
					data.sprite = 'gold_coin';
				} else {
					wS = scaleSize(data.width);
					hS = scaleSize(data.height);
					data.scaledHeight = hS;
					attr.width = wS;
					attr.height = hS;
					
				}
				if (data.sprite in SPRITE_MAP) {
					let src = `../src/img/${data.sprite}.png`;
					g = s.image(src, xS, yS, wS, hS).attr(attr);	
				} else {
					attr.fill = 'black';
					g = s.rect(xS, yS, wS, hS).attr(attr);
				}

				if (data.type === 'player') {
					xL = xS;
					yL = yS;
					tree.push({
						type: 'spawn',
						x: 0,
						y: 0
					});
				}
				
				objects.push({
					g: g,
					data: data,
					isObstacle: !(data.type === 'player'),
					isPlayer: data.type === 'player'
				});
			});

			drawGridLines(s, WORLD, VIEW, {
				stroke: 'white',
				step: GRID_STEP
			});

			const T_MAX = WORLD.x[1] - WORLD.x[0];
			//console.log(T_MAX)

			initAnimations({
				s: s,
				objects: objects,
				scaler: scaler,
				t: 0,
				dt: DT,
				step: T_STEP,
				max: T_MAX
			}).then((results) => {
				if (finalCallback) {
					finalCallback(results);
				}
			});

		},

		changePlayerFormula (formulaString) {
			newPlayerFormula = formulaString;
		},

		onEnd (callback) {
			finalCallback = callback;
		},

		clear () {
			playing = false;
			s.clear();
		}

	}

}