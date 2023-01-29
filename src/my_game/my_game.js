// import from engine/index.js for all engine symbols
import engine from "../engine/index.js";
// Accessing engine internal is not ideal
//    this must be resolved! (later)
import * as loop from "../engine/core/loop.js";
import Renderable from "../engine/renderable.js";

class MyGame {
  constructor() {
    // variables for the shapes
    this.cursor = null;
    this.shapes = [];
    this.numShapes = 0;
    this.timeCreated = [];
    this.timerToDelete = 0;
    this.shapeType = null;
    this.randomMovementMode;
    this.gravityMode;
    this.gravity = 0.035;
    this.shapeGravity = [];

    // The camera to view the scene
    this.mCamera = null;
    this.deleteMode = false;

    this.squareOption = null;
    this.circleOption = null;
    this.triangleOption = null;
    this.starOption = null;
  }

  init() {
    // Step A: set up the cameras
    this.mCamera = new engine.Camera(
      vec2.fromValues(50, 37.5), // position of the camera
      100,                      // width of camera
      [0, 0, 640, 480]       // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    // sets the background to gray

    // Step B: Create the Renderable object
    this.cursor = new engine.Renderable("square");
    this.cursorXform = this.cursor.getXform();
    this.cursor.setColor([1, 0, 0, 1]);


    // Step C: Init the red cursor
    this.cursorXform.setPosition(50, 37.5);
    this.cursorXform.setSize(1, 1);

    this.randomMovementMode = false;
    this.gravityMode = false;

    this.squareOption = document.getElementById("square-option");
    this.triangleOption = document.getElementById("triangle-option");
    this.circleOption = document.getElementById("circle-option");
    this.starOption = document.getElementById("star-option");

    this.updateShapeType();
    
  }

  draw() {
    // Step A: clear the canvas
    engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    // Step  B: Activate the drawing Camera
    this.mCamera.setViewAndCameraMatrix();

    this.drawShapes();

    // Step  D: Activate the red cursor to draw
    this.cursor.draw(this.mCamera);

  }

  update() {
    this.updateShapeType();
    this.getCursorInput();
    this.getDrawInput();
    this.updateShapeMovement();
    this.updateDeleteInput();

    gUpdateObject(this.numShapes, this.deleteMode, this.randomMovementMode, this.gravityMode);
  }

  getCursorInput() {
    if (engine.input.isKeyPressed(engine.input.keys.Right)) {
      if (this.cursorXform.getXPos() + 0.5 < 100) {
        this.cursorXform.incXPosBy(0.5);
      }
    }
    if (engine.input.isKeyPressed(engine.input.keys.Left)) {
      if (this.cursorXform.getXPos() - 0.5 > 0) {
        this.cursorXform.incXPosBy(-0.5);
      }
    }
    if (engine.input.isKeyPressed(engine.input.keys.Up)) {
      if (this.cursorXform.getYPos() + 0.5 < 75) {
        this.cursorXform.incYPosBy(0.5);
      }
    }
    if (engine.input.isKeyPressed(engine.input.keys.Down)) {
      if (this.cursorXform.getYPos() - 0.5 > 0) {
        this.cursorXform.incYPosBy(-0.5);
      }
    }
  }

  getDrawInput() {
    if (engine.input.isKeyClicked(engine.input.keys.Space)) {
      this.createShapes(this.shapeType);
    }
  }

  updateDeleteInput() {
    if (engine.input.isKeyClicked(engine.input.keys.D)) {
      if (this.deleteMode || this.shapes.length == 0) {
        this.deleteMode = false;
        this.timerToDelete = 0;
      }
      else{
        this.deleteMode = true;
      }
    }
    if (this.deleteMode) {
      if (this.shapes.length == 0) {
        this.deleteMode = false;
        this.timerToDelete = 0;
      }
      else {
        if (this.timerToDelete <= 0) {
          this.timerToDelete = this.timeCreated[1] - this.timeCreated[0];
          this.numShapes -= this.shapes[this.shapes.length - 1].length;
          this.shapes.splice(this.shapes.length - 1, 1);
          this.timeCreated.splice(0, 1);
        }
        else if (this.timerToDelete > 0) {
          this.timerToDelete -= loop.getMPF();
        }
      }
    }
  }

  drawShapes() {
    for (let i = this.shapes.length - 1; i >= 0; i--){
      for (let j = 0; j < this.shapes[i].length; j++){
        this.shapes[i][j].draw(this.mCamera);
      }
    }
  }

  createShapes(type) {
    // Source: https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
    let numOfShapes = Math.floor(Math.random() * 11 + 10);
    this.numShapes += numOfShapes;

    let shapesToAdd = [];
    let gravityValuesToAdd = [];
    for (let i = 0; i < numOfShapes; i++) {
      let shape = new Renderable(type);

      // setting random shape color
      let rValue = Math.random();
      let gValue = Math.random();
      let bValue = Math.random();
      shape.setColor([rValue, gValue, bValue, 1]);

      // setting random shape position within 5 units of cursor
      let minX = this.cursor.getXform().getXPos() - 5;
      let maxX = this.cursor.getXform().getXPos() + 5;
      let minY = this.cursor.getXform().getYPos() - 5;
      let maxY = this.cursor.getXform().getYPos() + 5;
      // Source: https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
      let randomX = Math.floor(Math.random() * (maxX - minX + 1) + minX);
      let randomY = Math.floor(Math.random() * (maxY - minY + 1) + minY);
      shape.getXform().setPosition(randomX, randomY);

      // setting random shape size from 1 - 6
      let size = Math.floor(Math.random() * 6 + 1);
      shape.getXform().setSize(size, size);

      // setting random shape rotation
      shape.getXform().setRotationInDegree(Math.floor(Math.random() * 360 + 1));

      // pushing shape to array
      shapesToAdd.push(shape);
      gravityValuesToAdd.push(0);
    }

    // pushing array of new squares to squares array
    this.shapes.unshift(shapesToAdd); 
    this.timeCreated.push(performance.now());
    this.shapeGravity.unshift(gravityValuesToAdd);
  }
  
  updateShapeType() {

    if (this.squareOption.checked) {
      this.shapeType = "square";
    }
    else if (this.triangleOption.checked) {
      this.shapeType = "triangle";
    }
    else if (this.circleOption.checked) {
      this.shapeType = "circle";
    }
    else if (this.starOption.checked) {
      this.shapeType = "star";
    }
  }

  updateShapeMovement() {

    if (engine.input.isKeyClicked(engine.input.keys.R)) {
      this.randomMovementMode = this.randomMovementMode ? false : true;
      this.gravityMode = false;
    }

    if (engine.input.isKeyClicked(engine.input.keys.G)) {
      this.gravityMode = this.gravityMode ? false : true;
      this.randomMovementMode = false;
      for (let i = 0; i < this.shapes.length; i++) {
        for (let j = 0; j < this.shapes[i].length; j++) {
          this.shapeGravity[i][j] = 0;
        }
      }
    }

    if (this.randomMovementMode) {
      for (let i = 0; i < this.shapes.length; i++) {
        for (let j = 0; j < this.shapes[i].length; j++) {
          this.shapeGravity[i][j] = 0;
          let theShape = this.shapes[i][j]

          if (((theShape.getXform().getYPos() >= 75) && theShape.getRandomYMovement() > 0) ||
              ((theShape.getXform().getYPos() <= 0) && theShape.getRandomYMovement() < 0)) {
            theShape.setRandomYMovement(theShape.getRandomYMovement() * (-1));
          }
          if (((theShape.getXform().getXPos() >= 100) && theShape.getRandomXMovement() > 0) ||
              ((theShape.getXform().getXPos() <= 0) && theShape.getRandomXMovement() < 0)) {
            theShape.setRandomXMovement(theShape.getRandomXMovement() * (-1));
          }

          theShape.getXform().incXPosBy(theShape.getRandomXMovement());
          theShape.getXform().incYPosBy(theShape.getRandomYMovement());
          theShape.getXform().incRotationByDegree(theShape.getRandomRotation());
        }
      }
    }

    if (this.gravityMode) {
      for (let i = 0; i < this.shapes.length; i++) {
        for (let j = 0; j < this.shapes[i].length; j++) {
          let theShape = this.shapes[i][j];
          if (theShape.getXform().getYPos() > 1) {
            theShape.getXform().incYPosBy(this.shapeGravity[i][j] * -1);
            this.shapeGravity[i][j] += this.gravity;
          }
          else {
            this.shapeGravity[i][j] = 0;
          }
          
        }
      }
    }
  }

}

window.onload = function () {
  engine.init("GLCanvas");
  let myGame = new MyGame();
  // new begins the game
  loop.start(myGame);

}

window.addEventListener("keydown", function(event) {
  if (["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", " "].indexOf(event.key) > -1) {
    event.preventDefault();
  }
});