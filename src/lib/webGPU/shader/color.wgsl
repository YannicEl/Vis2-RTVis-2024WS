struct VertexUniform {
  viewProjectionMatrix: mat4x4f,
  modelMatrix: mat4x4f,
}

@group(0) @binding(0) var<uniform> vertexUniform: VertexUniform;

struct VertexOutput {
  @builtin(position) position: vec4f,
}

struct VertexInput {
  @location(0) position: vec4f,
}

@vertex
fn vertex(
  input: VertexInput
) -> VertexOutput {
  var output: VertexOutput;
  
  output.position = vertexUniform.viewProjectionMatrix * vertexUniform.modelMatrix * input.position;

  return output;
}

// -------------- //

@group(0) @binding(1) var<uniform> color: vec4f;

@fragment
fn fragment(
  input: VertexOutput
) -> @location(0) vec4f {
  return color;
}
