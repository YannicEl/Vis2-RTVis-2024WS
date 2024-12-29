struct VertexUniform {
  viewProjectionMatrix: mat4x4f,
  modelMatrix: mat4x4f,
}

@group(0) @binding(0) var<uniform> vertexUniform: VertexUniform;

struct VertexInput {
  @location(0) position: vec4f,
}

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) texcoord: vec2f,
}

@vertex
fn vertex(
  input: VertexInput,
  @builtin(vertex_index) vertexIndex : u32
) -> VertexOutput {
  var output: VertexOutput;

  // Die Zeile ist wichtig sonst geht es nicht. Man muss viewProjectionMatrix und modelMatrix irgendwo verwenden.
  let lol = vertexUniform.viewProjectionMatrix * vertexUniform.modelMatrix;

  output.position = input.position;
  output.texcoord = vec2f((input.position.x + 1) / 2, (input.position.y + 1) / 2);

  return output;
}

// -------------- //

@fragment
fn fragment(
  input: VertexOutput
) -> @location(0) vec4f {
  return vec4f(0, 1, 0, 1);
}