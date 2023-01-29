"use strict"

import * as input from "../input.js";

const kUPS = 60; // Updates per second
const kMPF = 1000 / kUPS;  // Milliseconds per update
let updateCallsPerDraw = 0;
let totalUpdateCalls = 0;
let framesCompleted = 0;
let totalLagTime = 0
let averageLagTime = 0;

// Variables for timing gameloop
let mPrevTime;
let mLagTime;

// the current loop state (running or should stop)
let mLoopRunning = false;
let mCurrentScene = null;
let mFrameID = -1;

function loopOnce() {
  if (mLoopRunning) {
    //  Step A: set up for next call to LoopOnce
    mFrameID = requestAnimationFrame(loopOnce);

    // Step B: now let's draw
    //        draw() MUST be called before update()
    //        as update() may stop the loop!
    mCurrentScene.draw();
    framesCompleted++;

    // Step C: compute time elapsed since last loopOnce was executed
    let currentTime = performance.now();
    let elapsedTime = currentTime - mPrevTime;
    mPrevTime = currentTime;
    mLagTime += elapsedTime;

    let currentLagTime = (mLagTime - kMPF) < 0 ? 0 : mLagTime - kMPF; // if lag time < 0, then make it 0
    totalLagTime += currentLagTime;
    averageLagTime = totalLagTime / framesCompleted;

    // Step D: update the game the appropriate number of times
    //         Update only every kMPF (1/60 of a second)
    //         If lag larger then update frames, update until caught up
    while ((mLagTime >= kMPF) && mLoopRunning) {
      input.update();
      mCurrentScene.update();
      mLagTime -= kMPF;
      updateCallsPerDraw++;
      totalUpdateCalls++;
    }

    if (currentLagTime > mMaxLagTime) { mMaxLagTime = currentLagTime };

    gUpdateFrame(elapsedTime, updateCallsPerDraw, currentLagTime);
    mAvgUpdate = totalUpdateCalls / framesCompleted;
    if (updateCallsPerDraw > mMaxUpdatePerDraw)
      mMaxUpdatePerDraw = updateCallsPerDraw;
    mAvgLag = averageLagTime;
    updateCallsPerDraw = 0;


  }
}

function start(scene) {
  if (mLoopRunning) {
    throw new Error("loop already running");
  }

  mCurrentScene = scene;
  mCurrentScene.init();

  mPrevTime = performance.now();
  mLagTime = 0.0;
  mLoopRunning = true;
  mFrameID = requestAnimationFrame(loopOnce);
}

function stop() {
  mLoopRunning = false;
  // make sure no more animation frames
  cancelAnimationFrame(mFrameID);
}

function getMPF() { return kMPF; }

export {start, stop, getMPF}