import {Sprite} from 'pixi.js';

export class Bonus extends Sprite {
    constructor(expandBonusTexture, narrowBonusTexture, splitBonusTexture) {
        // super(expandBonusTexture, splitBonusTexture, narrowBonusTexture)
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
        this.isActive = false;
        this.velocity = 2.5;
        this.anchor.set(0.5);
    }

    fall() {
        this.y += this.velocity;
        this.isActive = true;
    }
}