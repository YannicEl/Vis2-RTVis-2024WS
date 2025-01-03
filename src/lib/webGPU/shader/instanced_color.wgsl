struct ModelUniforms {
  viewProjectionMatrix: mat4x4f,
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
  @location(10) model_matrix_row_1: vec4f,
  @location(11) model_matrix_row_2: vec4f,
  @location(12) model_matrix_row_3: vec4f,
  @location(13) model_matrix_row_4: vec4f,
}

@vertex
fn vertex(
  input: VertexInput
) -> VertexOutput {
  var output: VertexOutput;
  
  let modelMatrix = mat4x4f(
    input.model_matrix_row_1,
    input.model_matrix_row_2,
    input.model_matrix_row_3,
    input.model_matrix_row_4,
  );

  output.position = modelUniforms.viewProjectionMatrix * modelMatrix * input.position;

  return output;
}

// -------------- //

@fragment
fn fragment(
  input: VertexOutput
) -> @location(0) vec4f {
  return uniforms.color;
}
