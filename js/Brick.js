import { Sprite } from "pixi.js";
import { gameTextures } from "./texturesPaths";

export class Brick extends Sprite {
    constructor(armoredBlockTexture, blueBlockTexture, greenBlockTexture, redBlockTexture, orangeBlockTexture, yellowBlockTexture, x, y) {
        super(armoredBlockTexture, blueBlockTexture, greenBlockTexture, redBlockTexture, orangeBlockTexture, yellowBlockTexture)
        this.anchor.set(0.5);
        this.x = x;
        this.y = y;
        this.num = Math.floor(Math.random()*16);
    }
}