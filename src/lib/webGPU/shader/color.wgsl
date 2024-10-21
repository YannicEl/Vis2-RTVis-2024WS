@group(0) @binding(0) var<uniform> viewProjectionMatrix: mat4x4f;
@group(0) @binding(1) var<uniform> modelMatrix: mat4x4f;

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
  
  output.position = viewProjectionMatrix * modelMatrix * input.position;

  return output;
}

// -------------- //

@group(0) @binding(2) var<uniform> color: vec4f;

@fragment
fn fragment(
  input: VertexOutput
) -> @location(0) vec4f {
  return color;
}
