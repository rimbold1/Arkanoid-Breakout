import { Application, Assets, Sprite, Ticker, Graphics } from 'pixi.js';
import { gameTextures } from './texturesPaths.js';
import { Ball } from './ball.js';
import { Block } from './block.js';
import { rectCircleCollide, rectToRectCollide } from './collisionDetectionFunc.js';
// import { blendModes } from 'pixi';
import { clamp } from './clamp.js';
// import { offset } from 'pixi/core/globals.js';

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
	const ball = new Ball(gameTextures.ironBallTexture, app.screen/2, app.screen/2, 4, -6.5);
	const smallPlatform = new Sprite(gameTextures.smallPlatformTexture);
	const blueBlock = new Sprite(gameTextures.blueBlockTexture);
	const greenBlock = new Sprite(gameTextures.greenBlockTexture);
	const redBlock = new Sprite(gameTextures.redBlockTexture);
	const orangeBlock = new Sprite(gameTextures.orangeBlockTexture);
	const yellowBlock = new Sprite(gameTextures.orangeBlockTexture);
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
	blueBlock.anchor.set(0.5);

	const blockArray = [];
	let posX = 170;
	for (let i = 0; i < 6; i++) {
		const block = new Sprite(gameTextures.blueBlockTexture);
		block.anchor.set(0.5);
		block.x = posX;
		block.y = 80;
		blockArray.push(block);
		posX += 60;
	}

	
	console.log(blockArray)

	greyBonus.anchor.set(0.5);
	greyBonus.fall = function() {
		this.y += bonusVelocity;
	}

	// adding object to the stage
	app.stage.addChild(background);
	app.stage.addChild(ball);
	app.stage.addChild(smallPlatform);
	blockArray.forEach((block) => {
		app.stage.addChild(block);
	});
	// app.stage.addChild(blueBlock);

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
	ticker.add((deltaTime) => {
		ball.move();

		if (rectCircleCollide(smallPlatform, ball)) { 

			ball.xSpeed = -(smallPlatform.x - ball.x) / smallPlatform.width / 2 * 25;
			ball.ySpeed = -ball.ySpeed;

		}

		for (let i = 0; i < blockArray.length; i++) {

			const element = blockArray[i];
			if (blockArray.every(element => element.x === null && element.y === null )) {
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