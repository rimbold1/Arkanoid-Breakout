import {Sprite} from 'pixi.js';

export class Bonus extends Sprite {
    constructor(x, y, expandBonusTexture, narrowBonusTexture, splitBonusTexture) {
        super(expandBonusTexture, splitBonusTexture, narrowBonusTexture)
        this.x = x;
        this.y = y;
        this.isActive = false;
        this.velocity = 2.5;
        this.anchor.set(0.5);
        // this.fall();
    }

    fall() {
        this.y += this.velocity;
        // this.isActive = true;
    }

    // removeFromScene() {
    //     app.stage.removeChild(this);
    // }
}