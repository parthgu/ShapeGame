attribute vec3 aVertexPosition; // Vertex shader expects one position

// to tranasform the vertex position
uniform mat4 uModelXformMatrix;

uniform mat4 uCameraXformMatrix;

void main(void) {
  // Convert the vec3 into vec4 for scan concersion and
  // assign to gl_Position to pass the vertex to the fragment shader
  gl_Position = uCameraXformMatrix *
    uModelXformMatrix *
    vec4(aVertexPosition, 1.0);
}
