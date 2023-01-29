"use strict";

import * as glSys from "./core/gl.js";
import * as shaderResources from "./core/shader_resources.js";
import Transform from "./transform.js";

class Renderable {
  constructor(type) {
    this.mShader = shaderResources.getConstColorShader();
    this.mColor = [1, 1, 1, 1]; // color of pixel
    this.mXform = new Transform();
    this.timeCreated = performance.now();
    this.type = type;

    // Source: https://stackoverflow.com/questions/13455042/random-number-between-negative-and-positive-value
    this.randomXMovement = (Math.random() * 0.5) * (Math.round(Math.random()) ? 1 : -1);
    this.randomYMovement = (Math.random() * 0.5) * (Math.round(Math.random()) ? 1 : -1);
    this.randomRotation = (Math.random() * 1) * (Math.round(Math.random()) ? 1 : -1);

  }

  draw(camera) {  
    let gl = glSys.get();
    this.mShader.activate(this.type, this.mColor, this.mXform.getTRSMatrix(), camera.getCameraMatrix());
    if(this.type == "square")
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    if(this.type == "triangle")
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    if(this.type == "circle")
      gl.drawArrays(gl.TRIANGLE_FAN, 0, 125);
    if(this.type == "star")
      gl.drawArrays(gl.TRIANGLE_FAN, 0, 10);
  }

  setColor(color) { this.mColor = color; }
  getColor() { return this.mColor; }
  getXform() { return this.mXform; }
  getTimeCreated() { return this.timeCreated; }
  getRandomXMovement() { return this.randomXMovement; }
  getRandomYMovement() { return this.randomYMovement; }
  getRandomRotation() { return this.randomRotation; }
  setRandomXMovement(value) { this.randomXMovement = value; }
  setRandomYMovement(value) { this.randomYMovement = value; }
  setRandomRotation(value) { this.randomRotation = value; }

}

export default Renderable;

