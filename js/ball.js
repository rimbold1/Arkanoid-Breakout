import {Sprite} from 'pixi.js';

export class Ball extends Sprite {
    constructor(ironBallTexture, x, y, xSpeed, ySpeed) {
        super(ironBallTexture);

        this.x = x;
        this.y = y;
        this.width = 14;
        this.height = 14;
        this.radius = this.width/2;
        this.anchor.set(0.5);
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
    }

    move(ticker) {
        this.x += this.xSpeed * ticker.deltaTime ;
        this.y += this.ySpeed * ticker.deltaTime ;
    }
}