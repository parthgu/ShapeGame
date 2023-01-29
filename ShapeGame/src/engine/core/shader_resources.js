"use strict";

import SimpleShader from "../simple_shader.js";

// Simple Shader
let kSimpleVS = "src/glsl_shaders/simple_vs.glsl"; // to VertexShader
let kSimpleFS = "src/glsl_shaders/simple_fs.glsl"; // to FragmentShader
let mConstColorShader = null;

function createShaders() {
    mConstColorShader = new SimpleShader(kSimpleVS, kSimpleFS);
}

function init() {
    createShaders();
}

function getConstColorShader() { return mConstColorShader; }

export {init, getConstColorShader}