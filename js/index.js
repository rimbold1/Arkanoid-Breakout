import { Application, Assets, Sprite, Ticker, Graphics, Text, TextStyle } from 'pixi.js';
import { gameTextures } from './texturesPaths.js';
import { Ball } from './ball.js';
import { rectCircleCollide, rectToRectCollide } from './collisionDetectionFunc.js';
import { clamp } from './clamp.js';

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
	const smallPlatform = new Sprite(gameTextures.smallPlatformTexture);
	const greyBonus = new Sprite(gameTextures.greyBonusTexture);
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
	
	let score = 0;
	const scoreCount = new Text({text : score,
		style : scoreStyle
	});

	const bonusVelocity = 2.5;
	let clampMin = 60;
	let clampMax = 590;
	let currentPlatform = smallPlatform;
	
	graphics.rect(50, 50, 650, 800);
	graphics.fill(0xde3249);

	// moving platfrom basic settings (position and anchor)
	currentPlatform.x = app.screen.width/2;
	currentPlatform.y = 770;
	currentPlatform.anchor.set(0.5);

	ball.x = currentPlatform.x;
	ball.y = currentPlatform.y-20;

	const brickArray = [];
	const map = [
		[3, 3, 3, 3, 3, 3, 3, 3],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[1, 1, 1, 1, 1, 1, 1, 1],
		[2, 2, 2, 2, 2, 2, 2, 2],
		[3, 3, 3, 3, 3, 3, 3, 3]
	];
	
	const textures = {
		0: gameTextures.redBlockTexture, // Червоний
		1: gameTextures.orangeBlockTexture, // Помаранчевий
		2: gameTextures.yellowBlockTexture, // Жовтий
		3: gameTextures.blueBlockTexture //Голуби
	};

	scoreCount.x = app.screen.width/2;
	scoreCount.anchor.set(0.5)
	scoreCount.y = 35;
	app.stage.addChild(scoreCount);

	function addBricks(map, textures) { // Building level by adding bricks to the game
		let xPos = 115;
		let yPos = 200;
		for (let i = 0; i < map.length; i++) {
			const element = map[i];
			
			for (let j = 0; j < element.length; j++) {
				const item = element[j];
				
				const brick = app.stage.addChild(new Sprite(textures[item]));
				brick.type = item;
				brick.anchor.set(0.5);
				brick.x = xPos;
				brick.y = yPos;
				brickArray.push(brick);
				xPos += 60;
			}
			yPos += 30;
			xPos = 115;
		}
	};

	addBricks(map, textures);

	greyBonus.anchor.set(0.5);
	greyBonus.fall = function() {
		this.y += bonusVelocity;
	}

	// adding object to the stage
	app.stage.addChild(background);
	app.stage.addChild(ball);
	app.stage.addChild(smallPlatform);
	brickArray.forEach((block) => { // Adding blocks to the game stage.
		app.stage.addChild(block);
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
	
	let startMovement = false;
	window.addEventListener('click', function() {
		startMovement = true;
		isNot = false;
	});
	
	// ticker.stop();
	ticker.add((ticker) => {
		
		if (startMovement === true) {
			ball.move(ticker)
		}

		if (rectCircleCollide(smallPlatform, ball)) { 
			const sidesDistances = { 
				left: Math.abs(smallPlatform.x - smallPlatform.width / 2 - (ball.x + ball.radius)), 
				right: Math.abs(ball.x - ball.radius - (smallPlatform.x + smallPlatform.width / 2)), 
				top: Math.abs(smallPlatform.y - smallPlatform.height / 2 - (ball.y + ball.radius)), 
				bottom: Math.abs(ball.y - ball.radius - (smallPlatform.y + smallPlatform.height / 2)), 
			};

			let currentMin = Infinity; 
			let side = null; 

			ball.xSpeed = -(smallPlatform.x - ball.x) / smallPlatform.width / 2 * 25;
			ball.ySpeed = -ball.ySpeed;

		}

		for (let i = 0; i < brickArray.length; i++) {

			const element = brickArray[i];
			// Перевірка на наявність блоків, якщо  немає то стоп-гра.
			if (brickArray.every(element => element.x === null && element.y === null )) { 
				ticker.stop();
			}

			if (rectCircleCollide(element, ball)) {

				const sidesDistances = { 
					left: Math.abs(element.x - element.width / 2 - (ball.x + ball.radius)), 
					right: Math.abs(ball.x - ball.radius - (element.x + element.width / 2)), 
					top: Math.abs(element.y - element.height / 2 - (ball.y + ball.radius)), 
					bottom: Math.abs(ball.y - ball.radius - (element.y + element.height / 2)), 
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
					ball.y = element.y - element.height / 2 - ball.radius ;
					ball.ySpeed = -ball.ySpeed;
				}else if (side === 'bottom') {
					ball.y =  element.y + element.height/2 + ball.radius;
					ball.ySpeed = -ball.ySpeed;
				}else if (side === 'right') {
					ball.x = element.x + element.width/2 + ball.radius;
					ball.xSpeed = -ball.xSpeed;
				}else if (side === 'left') {
					ball.x = element.x - element.width/2 - ball.radius;
					ball.xSpeed = -ball.xSpeed;
				}
				
				if (element.type === 3) {
					score += 10;
				}else if (element.type === 2) {
					score += 20;
				}else if (element.type === 1) {
					score += 30;
				}else if (element.type === 0) {
						score += 40;
				}
				greyBonus.x = element.x;
				greyBonus.y = element.y;
				element.x = null;
				element.y = null;
				
				scoreCount.text = score;
				
				app.stage.removeChild(element);
				app.stage.addChild(greyBonus);
				break;
			}
		}
			
		// Collision detection for left, right walls and top.
		if (ball.x+ball.radius >= app.screen.width-25) {
			ball.x = app.screen.width-25-ball.radius;
			ball.xSpeed = -ball.xSpeed;
		}else if (ball.x-ball.radius <= 25) {
			ball.x = 25+ball.radius;
			ball.xSpeed = -ball.xSpeed;
		}else if (ball.y-ball.radius <= 25) {
			ball.y = 25+ball.radius;
			ball.ySpeed = -ball.ySpeed;
		}else if (ball.y+ball.radius > app.screen.height) {
			// ball.y = app.screen.height-ball.radius;
			// ball.ySpeed = -ball.ySpeed;
			ticker.stop();
		}
		greyBonus.fall();

		if (rectToRectCollide(currentPlatform, greyBonus)) {
			
			currentPlatform.texture = gameTextures.largePlatformTexture;
			clampMin = 90;
			clampMax = 560;
			app.stage.removeChild(greyBonus)
			
		}

	});
	
	ticker.start();
	

})();
