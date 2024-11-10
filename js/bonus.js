import {Sprite} from 'pixi.js';

export class Bonus extends Sprite {
    constructor(expandBonusTexture, narrowBonusTexture, splitBonusTexture, x, y, xSpeed, ySpeed) {
        super(expandBonusTexture, splitBonusTexture, narrowBonusTexture)
        this.x = x;
        this.y = y;
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
        this.velocity = 2.5;
        this.anchor.set(0.5);
    }

    fall() {
        this.y += this.velocity;
    }
}