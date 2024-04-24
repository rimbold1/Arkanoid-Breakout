import { Application, Assets, Sprite, Ticker, Graphics } from 'pixi.js';
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
	const ball = new Ball(gameTextures.ironBallTexture, app.screen/2, app.screen/2, 1, -5.5);
	const smallPlatform = new Sprite(gameTextures.smallPlatformTexture);
	// const blueBlock = new Sprite(gameTextures.blueBlockTexture);
	// const greenBlock = new Sprite(gameTextures.greenBlockTexture);
	// const redBlock = new Sprite(gameTextures.redBlockTexture);
	// const orangeBlock = new Sprite(gameTextures.orangeBlockTexture);
	// const yellowBlock = new Sprite(gameTextures.orangeBlockTexture);
	const greyBonus = new Sprite(gameTextures.greyBonusTexture);
	const ticker = new Ticker();
	const graphics = new Graphics();
	
	const bonusVelocity = 2.5;
	let clampMin = 60;
	let clampMax = 590;
	let currentPlatform = smallPlatform;
	
	
	graphics.rect(50, 50, 650, 800);
	graphics.fill(0xde3249);

	ball.x = app.screen.width/2;
	ball.y = 400;

	// moving platfrom basic settings (position and anchor)
	currentPlatform.x = app.screen.width/2;
	currentPlatform.y = 770;
	currentPlatform.anchor.set(0.5);

	// blueBlock.x = app.screen.width/2;
	// blueBlock.y = 200;
	// blueBlock.anchor.set(0.5);

	const brickArray = [];
	const map = [
		[0, 0, 0, 0, 0, 0, 0, 0],
		[1, 1, 1, 1, 1, 1, 1, 1],
		[2, 2, 2, 2, 2, 2, 2, 2],
		[3, 3, 3, 3, 3, 3, 3, 3]
	];
	
	const textures = {
		0: gameTextures.redBlockTexture,
		1: gameTextures.orangeBlockTexture,
		2: gameTextures.yellowBlockTexture,
		3: gameTextures.blueBlockTexture
	};


	function addBricks(map, textures) {
		let xPos = 115;
		let yPos = 60;
		for (let i = 0; i < map.length; i++) {
			const element = map[i];
			
			for (let j = 0; j < element.length; j++) {
				const item = element[j];
				
				const brick = app.stage.addChild(new Sprite(textures[item]));
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

	let isDown = false;
	window.addEventListener('mousedown', function() {
		isDown = true;
	});

	window.addEventListener('mousemove', (event) => {
		let pos = event.clientX;
		if (isDown) {
			smallPlatform.x = clamp(pos, clampMin, clampMax);
		}
	});
	
	
	ticker.stop();
	ticker.add((ticker) => {
		
		ball.move(ticker);
		console.log(ticker)

		if (rectCircleCollide(smallPlatform, ball)) { 

			ball.xSpeed = -(smallPlatform.x - ball.x) / smallPlatform.width / 2 * 25;
			ball.ySpeed = -ball.ySpeed;

		}

		for (let i = 0; i < brickArray.length; i++) {

			const element = brickArray[i];
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
				greyBonus.x = element.x;
				greyBonus.y = element.y;
				element.x = null;
				element.y = null;
				app.stage.removeChild(element);
				app.stage.addChild(greyBonus);
				
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