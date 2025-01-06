struct VertexInput {
  @location(0) position: vec4f,
}

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
}

@vertex
fn vertex(
input: VertexInput,
) -> VertexOutput {
  var output: VertexOutput;

  output.position = input.position;
  output.uv = vec2f((input.position.x + 1) / 2, (input.position.y + 1) / 2);
  output.uv.y = 1.0 - output.uv.y;

  return output;
}

//-------------- //

@group(0) @binding(2) var texture_sampler: sampler;
@group(0) @binding(3) var texture: texture_2d<f32>;

@fragment
fn fragment(
input: VertexOutput
) -> @location(0) vec4f {
  let sample = textureSample(texture, texture_sampler, input.uv);

  return sample;
}
