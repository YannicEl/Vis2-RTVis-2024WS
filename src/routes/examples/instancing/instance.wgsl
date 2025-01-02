struct VertexInput {
  @location(0) position: vec3f,
  @location(1) color: vec4f,
  @location(2) offset: vec2f,
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

  output.position = vec4f(input.position.xy + input.offset, 0.0, 1.0);
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