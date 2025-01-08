struct ModelUniforms {
  viewProjectionMatrix: mat4x4f,
  modelMatrix: mat4x4f,
}

struct Uniforms {
  color: vec4f
}

@group(0) @binding(0) var<uniform> modelUniforms: ModelUniforms;
@group(0) @binding(1) var<uniform> uniforms: Uniforms;

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
  
  output.position = modelUniforms.viewProjectionMatrix * modelUniforms.modelMatrix * input.position;

  return output;
}

// -------------- //

@fragment
fn fragment(
  input: VertexOutput
) -> @location(0) vec4f {
  return uniforms.color;
}
