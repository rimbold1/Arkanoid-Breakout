import { Assets } from "pixi.js";

export const gameTextures = {
    ironBallTexture : await Assets.load('assets/iron_ball.png'),
    fieldTexture : await Assets.load('assets/Blue_Field.png'),
    smallPlatformTexture : await Assets.load('assets/small_platform.png'),
    armoredBlockTexture : await Assets.load('assets/armored.png'),
    blueBlockTexture : await Assets.load('assets/blue.png'),
    greenBlockTexture : await Assets.load('assets/green.png'),
    redBlockTexture : await Assets.load('assets/red.png'),
    orangeBlockTexture : await Assets.load('assets/orange.png'),
    yellowBlockTexture : await Assets.load('assets/yellow.png'),
    largePlatformTexture : await Assets.load('assets/large_platform.png'),
    expandBonusTexture : await Assets.load('assets/expand.png'),
    narrowBonusTexture : await Assets.load('assets/narrow.png'),
    splitBonusTexture : await Assets.load('assets/split.png')
};