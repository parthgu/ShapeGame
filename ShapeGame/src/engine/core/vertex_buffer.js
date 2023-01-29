"use strict";
import * as glSys from "./gl.js";

let mGLSquareVertexBuffer = null;
let mGLTriangleVertexBuffer = null;
let mGLCircleVertexBuffer = null;
let mGLStarVertexBuffer = null;

function get(shape) {
  if (shape == "square")
    return mGLSquareVertexBuffer;
  if (shape == "triangle")
    return mGLTriangleVertexBuffer;
  if (shape == "circle")
    return mGLCircleVertexBuffer;
  if (shape == "star")
    return mGLStarVertexBuffer;
  
  return mGLSquareVertexBuffer;
}

let mVerticesOfSquare = [
   0.5,   0.5, 0.0,
  -0.5,   0.5, 0.0,
   0.5,  -0.5, 0.0,
  -0.5,  -0.5, 0.0
];

let mVerticiesOfTriangle = [
   0.0,   0.5, 0.0,
  -0.5,  -0.5, 0.0,
   0.5,  -0.5, 0.0
];

let mVerticesOfStar = [
   0.12,   0.15, 0,
   0,      0.5,  0,
  -0.12,   0.15, 0,
  -0.5,    0.15, 0,
  -0.19,  -0.06, 0,
  -0.3,   -0.43, 0,
   0,     -0.2,  0,
   0.3,   -0.43, 0,
   0.19,  -0.06, 0,
   0.5,    0.15, 0
];

let mCircleNumVertex = 125;

let mVerticesOfCircle = [];

let delta = (2.0 * Math.PI) / (mCircleNumVertex - 1);
for (let i = 0; i <= mCircleNumVertex; i++){
  var angle = (i - 1) * delta;
  let x = 0.5 * Math.cos(angle);
  let y = 0.5 * Math.sin(angle);
  mVerticesOfCircle.push(x);
  mVerticesOfCircle.push(y);
  mVerticesOfCircle.push(1.0);
}

function init() {
  let gl = glSys.get();
  // Step A: Create a buffer on the gl context for our vertex positions
  mGLSquareVertexBuffer = gl.createBuffer();

  // Step B: Activate vertexBuffer
  gl.bindBuffer(gl.ARRAY_BUFFER, mGLSquareVertexBuffer);
  
  // Step C: Loads mVerticesOfSquare into the vertexBuffer
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array(mVerticesOfSquare), gl.STATIC_DRAW);
  
  
  mGLTriangleVertexBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, mGLTriangleVertexBuffer);

  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array(mVerticiesOfTriangle), gl.STATIC_DRAW);
  
  mGLCircleVertexBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, mGLCircleVertexBuffer);
  
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array(mVerticesOfCircle), gl.STATIC_DRAW);
  
  
  mGLStarVertexBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, mGLStarVertexBuffer);
  
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array(mVerticesOfStar), gl.STATIC_DRAW);
}

export { init, get }