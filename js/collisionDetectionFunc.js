
// Collision detection func between red circle (ball) and target object (block).

export const rectCircleCollide = function (target, ball) {    

    const distX = Math.abs(ball.x - target.x);
    const distY = Math.abs(ball.y - target.y);
    if (distX > target.width / 2 + ball.radius ||
        distY > target.height / 2 + ball.radius    ) {
        return false;    }
    if (distX <= target.width / 2 || distY <= target.height / 2) {
        return true;
      }
    const dx = distX - target.width / 2;
    const dy = distY - target.height / 2;
    return dx * dx + dy * dy <= ball.radius * ball.radius;

};

// Collision detection for 2 rectangles
export const rectToRectCollide = function (rect1, rect2) {
    if (rect1.x+rect1.width/2 >= rect2.x-rect2.width/2 &&
        rect1.x-rect1.width/2 <= rect2.x+rect2.width/2 &&
        rect1.y+rect1.height/2 >= rect2.y-rect2.height/2 &&
        rect1.y-rect1.height/2 <= rect2.y+rect2.height/2) 
        {
        return true;
    }
};


// Collision detection for walls and lower field
export function collisonDetectionForWalls(ballElement, ballsArray) {
    if (ballElement.x+ballElement.radius >= app.screen.width-25) {
        ballElement.x = app.screen.width-25-ballElement.radius;
        ballElement.xSpeed = -ballElement.xSpeed;
    }else if (ballElement.x-ballElement.radius <= 25) {
        ballElement.x = 25+ballElement.radius;
        ballElement.xSpeed = -ballElement.xSpeed;
    }else if (ballElement.y-ballElement.radius <= 25) {
        ballElement.y = 25+ballElement.radius;
        ballElement.ySpeed = -ballElement.ySpeed;
    }else if (ballElement.y+ballElement.radius > app.screen.height) {
        app.stage.removeChild(ballElement);
        ballsArray.splice(ballsArray.indexOf(ballElement), 1);
        
    }
    return console.log(ballsArray.length);
}