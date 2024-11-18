import { Sprite } from "pixi.js";

export class Brick extends Sprite {
    constructor(textures) {
    super(textures)
        this.anchor.set(0.5);
        this.num = Math.floor(Math.random()*16);
    }
};