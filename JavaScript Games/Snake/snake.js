//@ts-check
import SnakeBody from "./snakebody.js";
import InputHandler from "./input.js";
import Apple from "./apple.js";

// References
let canvas = document.getElementById("Snake");

// @ts-expect-error
let ctx = canvas.getContext("2d");

// Constants
const GAME_SIZE = canvas.clientWidth;

const GRID_SIZE = 25;

const GAME_SPEED = 100;

let started = false;
let gameStarted = false;


let snake = [];
let apple = new Apple(GRID_SIZE,GAME_SIZE);
let score = 0;

// Start game
function start(){
    snake = [];
    snake.push(new SnakeBody(true, GRID_SIZE, GAME_SIZE));
    for(let i = 1; i < 5; i++){
        snake.push(new SnakeBody(false, GRID_SIZE, GAME_SIZE, snake[i-1]));
    }
    new InputHandler(snake[0]);
}
start();
requestAnimationFrame(gameLoop);

// Game Loop
let last = -GAME_SPEED;
function gameLoop(dt){
    if (dt-last > GAME_SPEED ){
        // Clear screen
        ctx.clearRect(0,0,GAME_SIZE,GAME_SIZE);

        // Update and draw all items
        snake.forEach(snakeBody => snakeBody.update());
        snake.forEach(snakeBody => snakeBody.draw(ctx));
        apple.draw(ctx);
        apple.update(snake);

        // Check for snake body collision
        snake.forEach((snakeBody, index )=> {
            if (index != 0 && snakeBody.position.x == snake[0].position.x && snakeBody.position.y == snake[0].position.y ){
                snake[0].dead = true;
            }
        });

        // Check if score changed
        if (score != apple.score){
            snake.push(new SnakeBody(false, GRID_SIZE, GAME_SIZE, snake[snake.length-1]));
        }
        score = apple.score;
        

        // Check if snake has died
        if (snake[0].dead && (snake[0].speed.x != 0 || snake[0].speed.y != 0)){
            start();
            gameOverScreen();
            gameStarted = false;
        }   else if (snake[0].dead && snake[0].speed.x == 0 && snake[0].speed.y == 0){
            start();
            gameOverScreen();
            gameStarted = false;
        }

        // Log to check that the player has played this game before
        if (snake[0].speed.x!== 0 || snake[0].speed.y != 0){
            started = true
        }

        // Check when game starts to reset score
        if ((snake[0].speed.x!= 0 || snake[0].speed.y != 0) && !gameStarted ){
            apple.score = 0;
            score = 0;
            gameStarted = true;
        }

        // Draw scoreboard
        scoreBoard();

        // Update last time
        last = dt;
    }
    

    requestAnimationFrame(gameLoop);
}

function scoreBoard(){
    // Clear scoreboard section
    ctx.clearRect(0,0,GAME_SIZE,GRID_SIZE);

    // Draw score

    // Draw bottom line
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(0, GRID_SIZE);
    ctx.lineTo(GAME_SIZE, GRID_SIZE);
    ctx.stroke();

    // Draw score text
    ctx.font = "20px sans-serif"
    ctx.textAlign = "center";
    ctx.fillText("Score: " + score, GAME_SIZE/2, GRID_SIZE-GRID_SIZE/4)
}


function gameOverScreen(){
    // Set screen to be dark
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0,0,GAME_SIZE,GAME_SIZE);
    
    // Draw text
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.font = "16px sans-serif"
    ctx.textAlign = "center";
    if (!started){
        // Draw square around text
        ctx.clearRect(GAME_SIZE/6, GAME_SIZE/7,GAME_SIZE/1.5,GAME_SIZE/10);
        ctx.strokeRect(GAME_SIZE/6, GAME_SIZE/7,GAME_SIZE/1.5,GAME_SIZE/10);

        // Draw text
        ctx.fillText("Press the arrow keys to start " , GAME_SIZE/2, GAME_SIZE/5)
    } else {
        // Draw square around text
        ctx.clearRect(GAME_SIZE/6, GAME_SIZE/7,GAME_SIZE/1.5,GAME_SIZE/7);
        ctx.strokeRect(GAME_SIZE/6, GAME_SIZE/7,GAME_SIZE/1.5,GAME_SIZE/7);

        // Draw text
        ctx.fillText("You Died: Final Score: " + score , GAME_SIZE/2, GAME_SIZE/5)
        ctx.fillText("Press the arrow keys to play again " , GAME_SIZE/2, GAME_SIZE/4)
    }
}

// Apple bug testing button
document.getElementById("bruh").onclick = function() {doThing()};
function doThing(){
    apple.newPosition();
}