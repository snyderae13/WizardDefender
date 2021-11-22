const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 900;
canvas.height = 600;
const myMyusic = document.querySelector("audio");

//globals 
const cellSize = 100; //100 X 100px
const cellGap = 3; // used so the defenders wont bump into enemies below or above
const gameGrid = []; // sets up the actual grid, holds info about each cell in the grid
const defenders = []; // playable characters with projectiles
let numOfResources = 300; // starting points to place defenders 
const enemies = []; // enemies coming from right to left 
const enemyPositions = []; // sets where the enemies start on the grid 
let enemiesInterval = 600; // how often the enemies will spawn 
let frame = 0; // this lets me slow down my animations so they look nicer and dont spazz out 
let gameOver = false; // for showing the game is lost 
const projectiles = []; // shoot at enemies and reduce their health
let score = 0; // the points for killing an enemy 
const victory = 300; // the points needed to win the game 



//mouse variable so you can click on a cell within the grid so you can place defenders 
const mouse = {
    x: 10,
    y: 10,
    width: 0.1,
    height: 0.1,

}
let canvasPosition = canvas.getBoundingClientRect();// returns a DOM Rect object giving info about the size of the element and its position relative to the canvas source:https://www.w3schools.com/jsref/met_element_getboundingclientrect.asp
canvas.addEventListener('mousemove', function (e) {
    mouse.x = e.x - canvasPosition.left;
    mouse.y = e.y - canvasPosition.top;

}); 
// when we move the mouse onto the grid, it takes a function with an event so that the X and Y of the mouse are equal to the event minus the left and top canvas positions
canvas.addEventListener('mouseleave', function () {
    mouse.x = undefined;
    mouse.y = undefined;
}) 

// leave undefined because the mouse is no longer on our canvas screen

// I need an addEventListener for keyup and keydown so you can control your wizard character and move them up and down 

/*
window.addEventListener('keydown', function (e) {
    myGameArea.key = e.keyCode;
  })
  window.addEventListener('keyup', function (e) {
    myGameArea.key = false;
  })  */

  // need to figure out what to use instead of keyCode


<<<<<<< HEAD
=======
// leave undefined because the mouse is no longer on our canvas screen source :https://javascript.info/mousemove-mouseover-mouseout-mouseenter-mouseleave 
>>>>>>> dea8e5a1b0ff10af5f9b152aa165321d42a1add9



// grid base game board to cover the whole width but only one cell high
const topNavBar = {
    width: canvas.width,
    height: cellSize,
}

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = cellSize;
        this.height = cellSize;
    }
    draw() {
        if (mouse.x && mouse.y && collision(this, mouse)) {
            ctx.strokeStyle = 'black';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }// if the mouse's x and y and the collison function didnt detect anything wrong, it will create a black rectangle 
}
function createGrid() {
    for (let y = cellSize; y < canvas.height; y += cellSize) {
        for (let x = 0; x < canvas.width; x += cellSize) {
            gameGrid.push(new Cell(x, y));

        }
    }
} // setting the y for loop to cellSize stops it from making cells in the control bar
createGrid();
function handleGameGrid() {
    for (let i = 0; i < gameGrid.length; i++) {
        gameGrid[i].draw();
    }

} 
//creates the game grid with the draw function, so the mouse can move over the cells 


//projectiles
const fireball = new Image();
fireball.src = 'public/images/bigfireball.png'



class Projectile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.power = 20; //hp of the projectilees
        this.speed = 5; // how fast they travel over the cells 
        this.frameX = 0;
        this.frameY = 0;
        this.minFrame = 0;
        this.maxFrame = 2;
        this.spriteWidth = 96;
        this.spriteHeight = 96;
    }
    update() {
        this.x += this.speed;

    } // this helps with keeping the projectile at 5 for speed 
    draw() {

        ctx.drawImage(fireball, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    } // to create the size of the projectile 
}
function handleProjectiles() {
    for (let i = 0; i < projectiles.length; i++) {
        projectiles[i].update();
        projectiles[i].draw();

        for (let j = 0; j < enemies.length; j++) {
            if (enemies[j] && projectiles[i] && collision(projectiles[i], enemies[j])) {
                enemies[j].health -= projectiles[i].power;
                projectiles.splice(i, 1);
                i--;
            }
        }

        if (projectiles[i] && projectiles[i].x > canvas.width - cellSize) {
            projectiles.splice(i, 1);
            i--;
        }
    }

}// the first for loop is to make sure that the projectiles  are updated and drawn
// the second loop is for enemies that is to set that if enemies and projectiles make a collison, that the enemies health is subtracted from the power of the projectile. Then the projectile is removed from the array so it won't travel through the enemy 
// The last loop is to make sure that the projectile dosen't travel off our screen and kills an enemy before they can even spawn 


//defenders- I need to add a function that will handle the characters movements for the keyup and keydown Event Listners from upabove in the code. 

/*function updateGameArea() {
    myGameArea.clear();
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    if (myGameArea.key && myGameArea.key == 37) {myGamePiece.speedX = -1; }
    if (myGameArea.key && myGameArea.key == 39) {myGamePiece.speedX = 1; }
    if (myGameArea.key && myGameArea.key == 38) {myGamePiece.speedY = -1; }
    if (myGameArea.key && myGameArea.key == 40) {myGamePiece.speedY = 1; }
    myGamePiece.newPos();
    myGamePiece.update();
  } */ 
  // it needs to be something like this but modified 

const defender1 = new Image();
defender1.src = 'public/images/wizard.png'



class Defender {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = cellSize - cellGap * 2; // this is too avoid collison with enemies 
        this.height = cellSize - cellGap * 2; // this is to avoid collision with enemies 
        this.health = 100;
        this.projectiles = [];
        this.timer = 0; // how frequently the projectile fires
        this.frameX = 0;
        this.frameY = 0;
        this.minFrame = 0; //starting frame of animation sprite
        this.maxFrame = 3; //ending frame of animation sprite
        this.spriteWidth = 64;
        this.spriteHeight = 64;
        this.speedX = 0;
        this.speedY = 0;
        
    }
    draw() {
        //ctx.fillStyle = 'blue';
        //ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText(Math.floor(this.health), this.x, this.y);
        ctx.drawImage(defender1, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    } // this displays the image, its frames for the animation and displays health source for drawImage parameters : https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
    update() {
        this.timer++;
        if (this.timer % 100 === 0) {
            projectiles.push(new Projectile(this.x + 70, this.y + 30));
        }
        if (frame % 20 === 0) {
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = this.minFrame;
        }
    }// this updates our projectile time and where it fires from our defender. the frame sets how quickly we go through our sprite sheet to make the animation smooth 
}




canvas.addEventListener('click', function () {
    const gridPositionX = mouse.x - (mouse.x % cellSize) + cellGap;
    const gridPositionY = mouse.y - (mouse.y % cellSize) + cellGap;
    if (gridPositionY < cellSize) return;
    let defenderCost = 100;
    if (numOfResources >= defenderCost) {
        defenders.push(new Defender(gridPositionX, gridPositionY));
        numOfResources -= defenderCost;
    }
}); 
// this sets up for when we click that the X and Y position is added with cellGap so we don't collide with defenders from above or below. Also the cost of a defender and an if statment if we have enough resources to create another defender base on our X and Y grid position that we chose, also to reduce that cost from of numOfResources displayed in the controls bar 

function handleDefenders() {
    for (let i = 0; i < defenders.length; i++) {
        defenders[i].draw();
        defenders[i].update();
        for (let j = 0; j < enemies.length; j++) {
            if (defenders[i] && collision(defenders[i], enemies[j])) {
                enemies[j].movement = 0;
                defenders[i].health -= 0.2;
            }
            if (defenders[i] && defenders[i].health <= 0) {
                defenders.splice(i, 1);
                i--;
                enemies[j].movement = enemies[j].speed;
            }
        }

    }
} // first loop is to draw and update the defenders
// second loop is for when a defender and enemy collide the enemy will stop moving and start reducing the defenders health
// The third loop is once a defender's health reaches or equal to zero that it removes the defender from the array and if the enemy still has health that it will return to its speed 

//enemies
const enemyTypes = [];
const enemy1 = new Image();
enemy1.src = 'public/images/dragon.png'
enemyTypes.push(enemy1);


class Enemy {
    constructor(verticalPosition) {
        this.x = canvas.width;
        this.y = verticalPosition;
        this.width = cellSize;
        this.height = cellSize;
        this.speed = Math.random() * 0.2 + 0.4; // varies in speed for each enemy to keep things interesting 
        this.movement = this.speed;
        this.health = 100;
        this.maxHealth = this.health;
        this.enemyType = enemyTypes[0]; //plan to add more enemies in the future
        this.frameX = 0;
        this.frameY = 0;
        this.minFrame = 0;// starting frame of animation sprite
        this.maxFrame = 3;// ending frame of animation sprite 
        this.spriteWidth = 80;
        this.spriteHeight = 80;
    }
    update() {
        if (frame % 3 === 0) {
            this.x -= this.movement;
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = this.minFrame;
        }
    }// this updates the speed of the animation and 
    draw() {
        //ctx.fillStyle = 'red';
        //ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText(Math.floor(this.health), this.x, this.y);
        ctx.drawImage(this.enemyType, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    } //displays enemies health and sprite animation from drawImage 
}
function handleEnemy() {
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].update();
        enemies[i].draw();
        if (enemies[i].x < 0) {
            gameOver = true;
        }
        if (enemies[i].health <= 0) {
            let resourceGain = enemies[i].maxHealth / 5;
            numOfResources += resourceGain;
            score += resourceGain;
            const findThisIndex = enemyPositions.indexOf(enemies[i].y);
            enemyPositions.splice(findThisIndex, 1);
            enemies.splice(i, 1);
            i--;
        }

    } // first loop updates and draws the enemy, then the first if is made true when an enemy reaches the end of the left side of the screen, making gameOver to be true and firing the GAME OVER text below. the last if statment is for when the enemy's health is either or less than 0, you gain 20 pts to both rescources and score. Then findThisIndex finds teh enemies position who dided and removes it from the array
    if (frame % enemiesInterval === 0) {
        let verticalPosition = Math.floor(Math.random() * 5 + 1) * cellSize;
        enemies.push(new Enemy(verticalPosition));
        enemyPositions.push(verticalPosition);
    }
} // this is to set when the next enemy will appear using math floor and math random to place an enemy randomly and then to push that new enemy with its vertical position to its enemyPositions

//game screen functions 
function handleGameStatus() {
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.fillText('Score: ' + score, 20, 40);
    ctx.fillText('Resources:' + numOfResources, 20, 80);
    if (gameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '60px Arial';
        ctx.fillText(' GAME OVER', 135, 330);

    }
    if (score >= victory) {
        ctx.fillStyle = 'black';
        ctx.font = '60px Arial';
        ctx.fillText(' VICTORY!', 135, 330);
        endGame();
    }
}
// this is to handle the game's score, resouces, and Victory or Game over
// endGame() isn't the prettiest nor smoothest endings, but I found it did just what I needed it to do 


// this function handles the creation and position of the controls bar, as well as the handle grid, defender, projectiles, enemies, and Game Status, also it makes sure that the frame variable is incremented. Also makes sure that if its not gameOver that it continues to animate the game 

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, topNavBar.width, topNavBar.height);
    handleGameGrid();
    handleDefenders();
    handleProjectiles();
    handleEnemy();
    handleGameStatus();
    frame++;
    if (!gameOver) requestAnimationFrame(animate);


}

animate();


//this is for collision between two rectangle cells 
function collision(first, second) {
    if (!(first.x > second.x + second.width || first.x + first.width < second.x || first.y > second.y + second.height || first.y + first.height < second.y)
    ) {
        return true;
    };
};


// this helps when you need to resize the screen to full size so it won't mess up the game 

window.addEventListener('resize', function () {
    canvasPosition = canvas.getBoundingClientRect();
})

//music source : https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide this allows me to be able to play the music once you interact 

// this allows me to play the music after the first interaction with the page source :https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide

let playAttempt = setInterval(() => {
    myMyusic.play()
        .then(() => {
            clearInterval(playAttempt);
        })
        .catch(error => {
            console.log('Unable to play the video, User has not interacted yet.');
        });
}, 3000);






