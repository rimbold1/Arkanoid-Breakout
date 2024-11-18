import { Application, Assets, Sprite, Ticker, Graphics, Text, TextStyle } from 'pixi.js';
import { gameTextures } from './texturesPaths.js';
import { Ball } from './ball.js';
import { rectCircleCollide, rectToRectCollide } from './collisionDetectionFunc.js';
import { clamp } from './clamp.js';
import { Bonus } from './bonus.js';
import { Brick } from './brick.js';

// Asynchronous IIFE
(async () => {
	const app = new Application();

	await app.init({ 
		background: '#b0d3f1',
		// resizeTo: window 
		width: 650,
		height: 800
	});

	document.body.appendChild(app.canvas);

	// init global constances
	
	const background = new Sprite(gameTextures.fieldTexture);
	const ball = new Ball(gameTextures.ironBallTexture, app.screen/2, app.screen/2, 0, -7);
	const currentPaddle = new Sprite(gameTextures.smallPlatformTexture);
	const expandBonus = new Bonus(gameTextures.expandBonusTexture);
	const narrowBonus = new Bonus(gameTextures.narrowBonusTexture);
	const splitBonus = new Bonus(gameTextures.splitBonusTexture);
	const ticker = new Ticker();
	const graphics = new Graphics();
	const scoreStyle = new TextStyle({
		fontFamily: 'Arial',            // Font family
		fontSize: 26,                    // Font size
		fontStyle: 'italic',             // Style of font: normal, italic, or oblique
		fontWeight: 'bold',
		fill: '#ff9999',    // Gradient fill (array for gradient)
		stroke: '#4a1850',
	});
	
	const ballsArray = [];
	ballsArray.push(ball);

	let score = 0;
	const scoreCount = new Text({text : score,
		style : scoreStyle
	});

	// const bonusVelocity = 2.5;
	let clampMin = 60;
	let clampMax = 590;
	let currentPlatform = currentPaddle;
	
	graphics.rect(50, 50, 650, 800);
	graphics.fill(0xde3249);

	// moving platfrom basic settings (position and anchor)
	currentPlatform.x = app.screen.width/2;
	currentPlatform.y = 770;
	currentPlatform.anchor.set(0.5);

	ball.x = currentPlatform.x;
	ball.y = currentPlatform.y-20;

	const brickArray = [];
	const levelMap = [
		[4,'','','','','','',4],
		[3, 3, 3, 3, 3, 3, 3, 3],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[1, 1, 1, 1, 1, 1, 1, 1],
		[2, 2, 2, 2, 2, 2, 2, 2],
		[3, 3, 3, 3, 3, 3, 3, 3],
		[4, 4,'','','','', 4, 4]
	];
	
	const brickTextures = {
		0: gameTextures.redBlockTexture, // Червоний
		1: gameTextures.orangeBlockTexture, // Помаранчевий
		2: gameTextures.yellowBlockTexture, // Жовтий
		3: gameTextures.blueBlockTexture, //Голубий
		4: gameTextures.armoredBlockTexture // Сірий (бронь)
	};

	scoreCount.x = app.screen.width/2;
	scoreCount.anchor.set(0.5)
	scoreCount.y = 35;
	app.stage.addChild(scoreCount);

	function addBricks(levelMap, brickTextures) { // Building level by adding bricks to the game
		let xPos = 115;
		let yPos = 200;
		for (let i = 0; i < levelMap.length; i++) {
			const row = levelMap[i];
			
			for (let j = 0; j < row.length; j++) {
				const rowItem = row[j];
				const brick = app.stage.addChild(new Brick(brickTextures[rowItem], rowItem));
				if (rowItem === '') {
					brick.num = null;
					xPos += 60;
					continue;
				}else if (rowItem === 4) {
					brick.num = null;
					brick.x = xPos;
					brick.y = yPos;
					brickArray.push(brick);
				}else {
					brick.x = xPos;
					brick.y = yPos;
					brickArray.push(brick);
				}
				xPos += 60;
			}
			yPos += 30;
			xPos = 115;
		}
	};

	addBricks(levelMap, brickTextures);

	// adding object to the stage
	app.stage.addChild(background);
	app.stage.addChild(ball);
	app.stage.addChild(currentPaddle);
	brickArray.forEach((brick) => { // Adding bricks to the game stage.
		app.stage.addChild(brick);
	});
	app.stage.addChild(scoreCount); // Adding score counter.

	// Moving platform events
	let isDown = true;
	let isNot = true;
	window.addEventListener('mousedown', function() {
		isDown = true;
	});

	window.addEventListener('mousemove', (event) => {
		let pos = event.clientX;
		if (isDown) {
			currentPlatform.x = clamp(pos, clampMin, clampMax);
		}
		if (isNot === true) {
			ball.x = currentPlatform.x;
			ball.y = currentPlatform.y-20;
		}

	});
	
	window.addEventListener('mouseup', function () {
		// isDown = false;
	});
	
	let movementReady = false;
	window.addEventListener('click', function() {
		movementReady = true;
		isNot = false;
	});
	

	
	ticker.add((ticker) => {
		
		if (movementReady) {
			for (let i = 0; i < ballsArray.length; i++) {
				const ballElement = ballsArray[i];
				if (ballsArray.length < 1) {
					ticker.stop();
				}
				app.stage.addChild(ballElement);
				ballElement.move(ticker);
				if (rectCircleCollide(currentPaddle, ballElement)) { 
					const sidesDistances = { 
						left: Math.abs(currentPaddle.x - currentPaddle.width / 2 - (ballElement.x + ballElement.radius)), 
						right: Math.abs(ballElement.x - ballElement.radius - (currentPaddle.x + currentPaddle.width / 2)), 
						top: Math.abs(currentPaddle.y - currentPaddle.height / 2 - (ballElement.y + ballElement.radius)), 
						bottom: Math.abs(ballElement.y - ballElement.radius - (currentPaddle.y + currentPaddle.height / 2)), 
					};
		
					let currentMin = Infinity; 
					let side = null; 
		
					ballElement.xSpeed = -(currentPaddle.x - ballElement.x) / currentPaddle.width / 2 * 25;
					ballElement.ySpeed = -ballElement.ySpeed;
		
				}
		
				for (let i = 0; i < brickArray.length; i++) {
		
					const brick = brickArray[i];
					// Перевірка на наявність блоків, якщо  немає то стоп-гра.
					if (brickArray.every(brick => brick.x === null && brick.y === null )) { 
						ticker.stop();
					}
		
					if (rectCircleCollide(brick, ballElement)) {

						const sidesDistances = { 
							left: Math.abs(brick.x - brick.width / 2 - (ballElement.x + ballElement.radius)), 
							right: Math.abs(ballElement.x - ballElement.radius - (brick.x + brick.width / 2)), 
							top: Math.abs(brick.y - brick.height / 2 - (ballElement.y + ballElement.radius)), 
							bottom: Math.abs(ballElement.y - ballElement.radius - (brick.y + brick.height / 2)), 
						}; 
							
						let currentMin = Infinity; 
						let side = null; 
							
						for (const key in sidesDistances) { 
							if (sidesDistances[key] < currentMin) { 
							currentMin = sidesDistances[key]; 
							side = key; 
							} 
						} 
						if (side === 'top') { 
							ballElement.y = brick.y - brick.height / 2 - ballElement.radius ;
							ballElement.ySpeed = -ballElement.ySpeed;
						}else if (side === 'bottom') {
							ballElement.y =  brick.y + brick.height/2 + ballElement.radius;
							ballElement.ySpeed = -ballElement.ySpeed;
						}else if (side === 'right') {
							ballElement.x = brick.x + brick.width/2 + ballElement.radius;
							ballElement.xSpeed = -ballElement.xSpeed;
						}else if (side === 'left') {
							ballElement.x = brick.x - brick.width/2 - ballElement.radius;
							ballElement.xSpeed = -ballElement.xSpeed;
						}
						
						if (brick.typeID === 3) {
							score += 10;
						}else if (brick.typeID === 2) {
							score += 20;
						}else if (brick.typeID === 1) {
							score += 30;
						}else if (brick.typeID === 0) {
							score += 40;
						}
		
						switch (brick.num) {
							case 1:
							case 3:
								expandBonus.x = brick.x;
								expandBonus.y = brick.y;
								app.stage.addChild(expandBonus);
								break;
							case 4:
							case 6:
								narrowBonus.x = brick.x;
								narrowBonus.y = brick.y;
								app.stage.addChild(narrowBonus);
								break;
							case 7:
							case 9:
								splitBonus.x = brick.x;
								splitBonus.y = brick.y;
								app.stage.addChild(splitBonus);
								break;
							default:
								break;
						}
						if (brick.typeID === 4) {
							continue;
						}else {
							brick.x = null;
							brick.y = null;
							scoreCount.text = score;
							app.stage.removeChild(brick);
							// break;
						}
		
						
					}
				}
				expandBonus.fall();
				narrowBonus.fall();
				splitBonus.fall();
		
				// Collision detection for left, right walls and top.
				if (ballElement.x+ballElement.radius >= app.screen.width-25) {
					ballElement.x = app.screen.width-25-ballElement.radius;
					ballElement.xSpeed = -ballElement.xSpeed;
				}else if (ballElement.x-ballElement.radius <= 25) {
					ballElement.x = 25+ballElement.radius;
					ballElement.xSpeed = -ballElement.xSpeed;
				}else if (ballElement.y-ballElement.radius <= 25) {
					ballElement.y = 25+ballElement.radius;
					ballElement.ySpeed = -ballElement.ySpeed;
				}else if (ballElement.y+ballElement.radius > app.screen.height) {
					// ball.y = app.screen.height-ball.radius;
					// ball.ySpeed = -ball.ySpeed;
					ticker.stop();
				}
		
		
				if (rectToRectCollide(currentPlatform, expandBonus)) {
					currentPlatform.texture = gameTextures.largePlatformTexture;
					clampMin = 90;
					clampMax = 560;
					app.stage.removeChild(expandBonus);
					
				}else if (rectToRectCollide(currentPlatform, narrowBonus)) {
					currentPlatform.texture = gameTextures.smallPlatformTexture;
					clampMin = 60;
					clampMax = 590;
					app.stage.removeChild(narrowBonus);
				}else if (rectToRectCollide(currentPlatform, splitBonus)) {
					// ballsArray.push(new Ball(gameTextures.ironBallTexture, ball.x, ball.y, -3, -4));
				}
				
			}
		}

		
		

	});
	
	ticker.start();
	

})();
