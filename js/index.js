import { Application, Assets, Sprite, Ticker } from 'pixi.js';
import { gameTextures } from './texturesPaths.js';
import { Ball } from './ball.js';
import { Block } from './block.js';
import { rectCircleCollide, rectToRectCollide } from './collisionDetectionFunc.js';
// import { blendModes } from 'pixi';
import { clamp } from './clamp.js';
import { movePlatform } from './movePlatformFunc.js';
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
	const ball = new Ball(gameTextures.ironBallTexture, app.screen/2, app.screen/2, 0, -6.5);
	const smallPlatform = new Sprite(gameTextures.smallPlatformTexture);
	const largePlatform = new Sprite(gameTextures.largePlatformTexture)
	const blueBlock = new Sprite(gameTextures.blueBlockTexture);
	const greenBlock = new Sprite(gameTextures.greenBlockTexture);
	const redBlock = new Sprite(gameTextures.redBlockTexture);
	const orangeBlock = new Sprite(gameTextures.orangeBlockTexture);
	const yellowBlock = new Sprite(gameTextures.orangeBlockTexture);
	const greyBonus = new Sprite(gameTextures.greyBonusTexture);
	const ticker = new Ticker();
	
	const bonusVelocity = 4.5;
	let clampMin = 60;
	let clampMax = 590;
	let currentPlatform = smallPlatform;

	ball.x = app.screen.width/2;
	ball.y = 400;

	// moving platfrom basic settings (position and anchor)
	smallPlatform.x = app.screen.width/2;
	smallPlatform.y = 770;
	smallPlatform.anchor.set(0.5);

	largePlatform.anchor.set(0.5);

	blueBlock.x = app.screen.width/2;
	blueBlock.y = 200;
	blueBlock.anchor.set(0.5);

	greyBonus.anchor.set(0.5);
	greyBonus.fall = function() {
		this.y += bonusVelocity;
	}

	// adding object to the stage
	app.stage.addChild(background);
	app.stage.addChild(ball);
	app.stage.addChild(smallPlatform);
	app.stage.addChild(blueBlock);

	// let isDown = false;
	// window.addEventListener('mousedown', function() {
	// 	isDown = true;
	// });

	// window.addEventListener('mousemove', (event) => {
	// 	let pos = event.clientX;
	// 	if (isDown) {
	// 		smallPlatform.x = clamp(pos, clampMin, clampMax);
	// 		// console.log(smallPlatform.x, smallPlatform.y)
	// 	}
	// });
	
	
	ticker.stop();
	ticker.add((deltaTime) => {
		ball.move();
		// clamp(value, clampMin, clampMax);
		movePlatform(currentPlatform, clampMin, clampMax);


		if (rectCircleCollide(smallPlatform, ball)) { 

			ball.xSpeed = -(smallPlatform.x - ball.x) / smallPlatform.width / 2 * 25;
			ball.ySpeed = -ball.ySpeed;

		}

		if (rectCircleCollide(blueBlock, ball)) {

			const sidesDistances = { 
				left: Math.abs(blueBlock.x - blueBlock.width / 2 - (ball.x + ball.radius)), 
				right: Math.abs(ball.x - ball.radius - (blueBlock.x + blueBlock.width / 2)), 
				top: Math.abs(blueBlock.y - blueBlock.height / 2 - (ball.y + ball.radius)), 
				bottom: Math.abs(ball.y - ball.radius - (blueBlock.y + blueBlock.height / 2)), 
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
				ball.y = blueBlock.y - blueBlock.height / 2 - ball.radius ;
				ball.ySpeed = -ball.ySpeed;
			}else if (side === 'bottom') {
				ball.y =  blueBlock.y + blueBlock.height/2 + ball.radius;
				ball.ySpeed = -ball.ySpeed;
			}else if (side === 'right') {
				ball.x = blueBlock.x + blueBlock.width/2 + ball.radius;
				ball.xSpeed = -ball.xSpeed;
			}else if (side === 'left') {
				ball.x = blueBlock.x - blueBlock.width/2 - ball.radius;
				ball.xSpeed = -ball.xSpeed;
			}
			greyBonus.x = blueBlock.x;
			greyBonus.y = blueBlock.y;
			blueBlock.x = null;
			blueBlock.y = null;
			app.stage.removeChild(blueBlock);
			app.stage.addChild(greyBonus);
			
			 
		}
			
		// Collision detection for left, right walls and top.
		if (ball.x+ball.radius >= app.screen.width-25 || ball.x-ball.radius <= 25) { 
			ball.xSpeed = -ball.xSpeed;
		}else if (ball.y-ball.radius <= 25) {
			ball.ySpeed = -ball.ySpeed;
		}else if (ball.y+ball.radius > app.screen.height) {
			// ticker.stop();
			ball.ySpeed = -ball.ySpeed;
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