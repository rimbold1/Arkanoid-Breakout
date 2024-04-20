import { Sprite } from 'pixi.js';

export class Block extends Sprite{
    constructor(blueBlockTexture, greenBlockTexture, redBlockTexture, orangeBlockTexture, yellowBlockTexture) {
        super(blueBlockTexture, greenBlockTexture, redBlockTexture, orangeBlockTexture, yellowBlockTexture, x, y, width, height);

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = width;
        this.anchor.set(0.5);
    }
}
