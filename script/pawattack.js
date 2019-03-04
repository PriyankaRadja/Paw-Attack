// ------------------------
// Variable Initializations
// ------------------------
var SPRITESHEET_URL = "data/img/violet.png"; 
var SPRITE_WIDTH = 48;
var SPRITE_HEIGHT = 48; 
var NB_POSTURES = 4; 
var NB_FRAMES_PER_POSTURE = 6; 

var canvas, ctx, w, h;
var spritesheet;
var woman = [];
var inputStates = {};

var ballArray = [];
var boneArray = [];

var score = 0;
var life = 3;

var DIR_LEFT = 1; 
var DIR_RIGHT = 2; 
var DIR_UP = 3; 
var DIR_DOWN = 0;
var currentDirection = 0;

var speedX = 0;
var speedY = 0;
var posY = 10;
var posX = 10;

var startaudio = new Audio("data/audio/bensound-jazzyfrenchy.mp3");
var endaudio = new Audio("data/audio/bensound-jazzyfrenchy.mp3");
var barkaudio = new Audio('data/audio/bark.mp3');
var bubbleaudio = new Audio('data/audio/Bubble5.mp3');

var currentGameState = 0;

// ------------------------
// Functions
// ------------------------
window.onload = function() {   

  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  w = canvas.width;
  h = canvas.height;

  currentGameState = 0;

  window.addEventListener('keydown', function(event){
    if (event.keyCode === 37) {
      inputStates.left = true;
    } else if (event.keyCode === 38) {
      inputStates.up = true;
    } else if (event.keyCode === 39) {
      inputStates.right = true;
    } else if (event.keyCode === 40) {
      inputStates.down = true;
    } 
  }, false);
    
  window.addEventListener('keyup', function(event){
    if (event.keyCode === 37) {
      inputStates.left = false;
    } else if (event.keyCode === 38) {
      inputStates.up = false;
    } else if (event.keyCode === 39) {
      inputStates.right = false;
    } else if (event.keyCode === 40) {
      inputStates.down = false;
    } 
  }, false);

  window.addEventListener('keypress', function(event) {
    if(event.keyCode === 32) {
      inputStates.space = true; 
    }
  }, false);

  window.addEventListener('keypress', function(event) {
    if(event.keyCode === 13) {
      inputStates.enter = true; 
    }
  }, false);

  requestAnimationFrame(mainloop);

};

function start(){

  createBalls(3);
  createScore();
  createLife();

  ctx.font = "20px Arial";
  ctx.strokeStyle = ctx.fillStyle = 'gold';
  ctx.fillText("Press ENTER to start", w/3, h/2);

  spritesheet = new Image();
  spritesheet.src = SPRITESHEET_URL;      
  
  // Called when the spritesheet has been loaded
  spritesheet.onload = function() {
    // Create player sprites
  for(var i = 0; i < NB_POSTURES; i++) {
    var sprite = new Sprite();
  
    sprite.extractSprites(spritesheet, NB_POSTURES, (i+1), 
                           NB_FRAMES_PER_POSTURE, 
                           SPRITE_WIDTH, SPRITE_HEIGHT);
    sprite.setNbImagesPerSecond(20);
    woman[i] = sprite;
  }

  startaudio.play();

  if(inputStates.enter)
  {
    startaudio.pause();
    currentGameState = 1;
    inputStates.enter = false;
  }

  requestAnimationFrame(mainloop);
    
  };

}

function movePlayerToStart(){

  currentDirection = 0;
  posY = 10;
  posX = 10;

  woman[currentDirection].draw(ctx, posX, posY, 1);
}

function gameOverMenu() {
      
  ctx.font = "20px Arial";
  ctx.strokeStyle = ctx.fillStyle = 'red';
  ctx.textAlign = "center"; 
  ctx.fillText("GAMEOVER", w/2, h/2.5); 
  ctx.fillText("Press ENTER to restart", w/2, h/2);

  if(inputStates.enter)
  {
    boneArray = [];
    score = 0;
    life = 3;
    currentGameState = 1;
    inputStates.enter = false;
    inputStates.space = false;

    updateScore();
    updateLives();
    createBalls(3);
    movePlayerToStart();
    endaudio.pause();
  }

  requestAnimationFrame(mainloop);

}

// -------------------------
// Enemy i.e. Dog definition
// -------------------------   
function Ball(x, y, vx, vy) {

  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;

  this.draw = function() {
    var dogImg = new Image();
    dogImg.src = 'data/img/dog.gif';

    this.w = dogImg.width * 0.1;
    this.h = dogImg.height * 0.1;

    ctx.drawImage(dogImg, this.x, this.y, dogImg.width * 0.1, dogImg.height * 0.1);
  };

  this.move = function() {
    // add horizontal increment to the x pos
    // add vertical increment to the y pos
    this.x += this.vx;
    this.y += this.vy;
 };

}

// -------------------------
// Bullet i.e. Bone definition
// -------------------------  
function Bone(x, y, vx, vy, direction){

  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.direction = direction;

  this.draw = function() {
    var boneImg = new Image();
    boneImg.src = 'data/img/bone.png'; 
    this.w = boneImg.width * 0.05;
    this.h = boneImg.height * 0.05;

    ctx.drawImage(boneImg, this.x, this.y, boneImg.width * 0.05, boneImg.height * 0.05);
  };

  this.move = function() {
    switch(this.direction){
      case 1: //DIR_LEFT
      this.x -= this.vx;
      break;
      case 2: //DIR_RIGHT
      this.x += this.vx;
      break;
      case 3: //DIR_UP
      this.y -= this.vy;
      break;
      case 0: //DIR_DOWN
      this.y += this.vy;
      break;
      default: break;
    }
  };
}

// -------------------------
// Create functions
// -------------------------  
function createBalls(numberOfBalls) {
  for(var i=0; i < numberOfBalls; i++) {
    var ball = new Ball(w,
                        h*Math.random(),
                        1,
                        1);
    ballArray[i] = ball;
   }
}

function createBone(direction){
  var bone = new Bone(posX + 10, posY + 30, 3, 3, direction);
  boneArray.push(bone);
}

function createScore() {
  ctx.font = "12px Arial";
  ctx.strokeStyle = ctx.fillStyle = 'gold';
  ctx.fillText("Score: "+ score, 370, 20);
}

function createLife() {
  life = 3;
  ctx.font = "12px Arial";
  ctx.strokeStyle = ctx.fillStyle = 'gold';
  ctx.fillText("Lives: "+ life, 420, 20);
}

// -------------------------
// Update functions
// -------------------------  
function updatePlayer() {
  speedX = 0;
  speedY = 0;
  // check inputStates
  if (inputStates.left) {
    speedX = -2;
    currentDirection = DIR_LEFT;
  }
  
  if (inputStates.right) {
    speedX = 2;
    currentDirection = DIR_RIGHT;
  }

  if (inputStates.up) {
    speedY = -2;
    currentDirection = DIR_UP;
  }
  
  if (inputStates.down) {
    speedY = 2;
    currentDirection = DIR_DOWN;
  }
  
  if(inputStates.space){
    //throw bones
    createBone(currentDirection);
    inputStates.space = false;
  }

  if(speedX === 0 && speedY === 0)
    woman[currentDirection].drawStopped(ctx, posX, posY, 1);
  else 
    woman[currentDirection].draw(ctx, posX, posY, 1);
  
  posX+= speedX;
  posY+= speedY;

  //Boundary analysis for player with walls
  // left
  if (posX < 0) { 
    posX = 0;            
  }                           
  // right
  if (posX > (w - SPRITE_WIDTH)) {
    posX = w - SPRITE_WIDTH;
  } 
  // up
  if (posY < 0) {
    posY = 0;
  } 
  // down
  if (posY > (h - SPRITE_HEIGHT)) {
    posY = h - SPRITE_HEIGHT;
  }
}

function updateBalls() {

  for(var i=0; i < ballArray.length; i++) {
   var ball = ballArray[i];
   ball.move();
   testCollisionWithWalls(ball);
   ball.draw();
  }

}

function updateBones() {

 for(var i=0; i < boneArray.length; i++) {
  var bone = boneArray[i];
  bone.move();

  //Boundary analysis for bones with the walls
  if (bone.x < 0) { 
    boneArray.splice(i, 1);
  }                           
  // right
  if (bone.x > w - (bone.w)) {
    boneArray.splice(i, 1);
  } 
  // up
  if (bone.y < 0) {
    boneArray.splice(i, 1);
  } 
  // down
  if (bone.y > h - (bone.h)) {
    boneArray.splice(i, 1);
  } 
  
  bone.draw();
  } 
}

function updateScore() {
  ctx.font = "12px Arial";
  ctx.strokeStyle = ctx.fillStyle = 'gold';
  ctx.fillText("Score: "+ score, 370, 20);
}



function updateLives() {
  ctx.font = "12px Arial";
  ctx.strokeStyle = ctx.fillStyle = 'gold';
  ctx.fillText("Lives: "+ life, 420, 20);
}

// -----------------------------
// Collision Detection functions
// -----------------------------  
function testCollisionWithWalls(ball) {
  //test enemy i.e. dog collision with walls

  // left
 if (ball.x < 0) { 
    ball.x = 0;    
    ball.vx *= -1;            
  }                           
  // right
  if (ball.x > w - (ball.w)) {
    ball.x = w - (ball.w);
    ball.vx *= -1;
  } 
  // up
  if (ball.y < 0) {
    ball.y = 0;
    ball.vy *= -1;
  } 
  // down
  if (ball.y > h - (ball.h)) {
    ball.y = h - (ball.h);
    ball.vy *= -1;
  }

}

function checkEnemyCollisionsWithPlayer() {
  //test enemy i.e. dog collision with Player
  var collision = false;

  for(var i=0; i < ballArray.length; i++) {
  var ball = ballArray[i];
  x2 = ball.x;
  y2 = ball.y;
  w2 = ball.w;
  h2 = ball.h;

  if (rectsOverlap(posX, posY, SPRITE_WIDTH, SPRITE_HEIGHT, x2, y2, w2, h2)){
    barkaudio.play();

    collision = true;
    ballArray.splice(i, 1);
    life = (life - 1);
    updateLives();

    //create extra enemy for the lost one
    ballArray.push(new Ball(w,
                h*Math.random(),
                1,
                1,
                30));

    if(life === 0){
      currentGameState = 2; //set to gameover state
      endaudio.play();
    }

  }

  if(collision)
    break;
  
  } 

}

function checkBoneCollisionsWithEnemy() {
  //test bone collision with enemy i.e. dog
  var collision = false;

  for(var i=0; i < boneArray.length; i++) {
  var bone = boneArray[i];
  x1 = bone.x;
  y1 = bone.y;
  w1 = bone.w;
  h1 = bone.h;


  for(var j =0; j < ballArray.length; j++){
    var ball = ballArray[j];
    x2 = ball.x;
    y2 = ball.y;
    w2 = ball.w;
    h2 = ball.h;

    if (rectsOverlap(x1, y1, w1, h1, x2, y2, w2, h2)){
      bubbleaudio.play();

      collision = true;
      ballArray.splice(j, 1);
      score = (score + 1);
      updateScore();
      boneArray.splice(i, 1);

      // add extra enemy to the array
      ballArray.push(new Ball(w,
                        h*Math.random(),
                        1,
                        1,
                        30));
    }

    if(collision)
      break;
      
   }

  if(collision)
    break;

  } 

}

function rectsOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {
 

  if ((x1 > (x2 + w2)) || ((x1 + w1) < x2))
    return false; // No horizontal axis projection overlap
  if ((y1 > (y2 + h2)) || ((y1 + h1) < y2))
    return false; // No vertical axis projection overlap
  return true;    // If previous tests failed, then both axis projections
                  // overlap and the rectangles intersect
}

// ------------------
// Animation function 
// ------------------  
function mainloop() {
  // clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
 
  switch(currentGameState){
    case 0:
    start();
    break;

    case 1: 
    updatePlayer();  
    updateBalls();
    updateBones();

    checkEnemyCollisionsWithPlayer();
    updateScore();
    updateLives();
    checkBoneCollisionsWithEnemy();
    requestAnimationFrame(mainloop);
    break;

    case 2: 
    gameOverMenu();
    break;

    default: 
    break;
  }   
  
}

// ---------------------
// Spritesheet functions
// ---------------------  
function SpriteImage(img, x, y, width, height) {
   this.img = img;  // the whole image that contains all sprites
   this.x = x;      
   this.y = y;
   this.width = width;   
   this.height = height;
   // xPos and yPos = position where the sprite should be drawn,
   // scale = rescaling factor between 0 and 1
   this.draw = function(ctx, xPos, yPos, scale) {
      ctx.drawImage(this.img,
                    this.x, this.y, // x, y, width and height of img to extract
                    this.width, this.height,
                    xPos, yPos,     // x, y, width and height of img to draw
                    this.width*scale, this.height*scale);
   };
}

function Sprite() {
  this.spriteArray = [];
  this.currentFrame = 0;
  this.delayBetweenFrames = 10;
  
  this.extractSprites = function(spritesheet, nbPostures, postureToExtract, nbFramesPerPosture, 
                         spriteWidth, spriteHeight) {
      // number of sprites per row in the spritesheet
      var nbSpritesPerRow = Math.floor(spritesheet.width / spriteWidth);
  
      // Extract each sprite
    var startIndex = (postureToExtract-1) * nbFramesPerPosture;
    var endIndex = startIndex + nbFramesPerPosture;
      for(var index = startIndex; index < endIndex; index++) {
          // Computation of the x and y position that corresponds to the sprite
          // index
          // x is the rest of index/nbSpritesPerRow * width of a sprite
          var x = (index % nbSpritesPerRow) * spriteWidth;
          // y is the divisor of index by nbSpritesPerRow * height of a sprite
          var y = Math.floor(index / nbSpritesPerRow) * spriteHeight;
    
          // build a spriteImage object
          var s = new SpriteImage(spritesheet, x, y, spriteWidth, spriteHeight);
    
          this.spriteArray.push(s);
      }
  };
  
  this.then = performance.now();
  this.totalTimeSinceLastRedraw = 0;
  
  this.drawStopped = function(ctx, x, y) {
    var currentSpriteImage = this.spriteArray[this.currentFrame];
     currentSpriteImage.draw(ctx, x, y, 1);
  };
  
  this.draw = function(ctx, x, y) {
    // Use time based animation to draw only a few images per second
    var now = performance.now();
    var delta = now - this.then;
    
    // draw currentSpriteImage
    var currentSpriteImage = this.spriteArray[this.currentFrame];
    // x, y, scale. 1 = size unchanged
    currentSpriteImage.draw(ctx, x, y, 1);
    /*currentSpriteImage.draw(ctx, x, y, boneImg.width * 0.05, boneImg.height * 0.05);*/
    
    // if the delay between images is elapsed, go to the next one
    if (this.totalTimeSinceLastRedraw > this.delayBetweenFrames) {
       // Go to the next sprite image
      this.currentFrame++; 
      this.currentFrame %=  this.spriteArray.length;
      
      // reset the total time since last image has been drawn
      this.totalTimeSinceLastRedraw = 0;
    } else {
      // sum the total time since last redraw
     this. totalTimeSinceLastRedraw += delta;
    }
    
    this.then = now;
  };
  
  this.setNbImagesPerSecond = function(nb) {
    // elay in ms between images
    this.delayBetweenFrames = 1000 / nb;
  };
}