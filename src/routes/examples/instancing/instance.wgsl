@group(0) @binding(0) var<uniform> modelUniforms: ModelUniforms;

struct ModelUniforms {
  viewProjectionMatrix: mat4x4f,
  modelMatrix: mat4x4f,
  color: vec4f,
}

struct VertexInput {
  @location(0) position: vec4f,
  @location(1) color: vec4f,
  @location(2) offset: vec2f,
  @location(10) mat_row_1: vec4f,
  @location(11) mat_row_2: vec4f,
  @location(12) mat_row_3: vec4f,
  @location(13) mat_row_4: vec4f,
}

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) color: vec4f,
}

@vertex
fn vertex(
  input: VertexInput,
) -> VertexOutput {
  var output: VertexOutput;

  let modelMatrix = mat4x4f(
    input.mat_row_1,
    input.mat_row_2,
    input.mat_row_3,
    input.mat_row_4,
  );

  output.position = modelUniforms.viewProjectionMatrix * modelMatrix * input.position;
  output.position.x += input.offset.x;
  output.position.y += input.offset.y;

  output.color = input.color;

  return output;
}

// -------------- //

@fragment
fn fragment(
  input: VertexOutput
) -> @location(0) vec4f {
  return input.color;
}