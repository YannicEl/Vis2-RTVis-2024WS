@group(0) @binding(2) var texture_sampler: sampler;
@group(0) @binding(3) var depth_texture: texture_depth_2d;

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

// -------------- //

@fragment
fn fragment(
  input: VertexOutput
) -> @location(0) vec4f {
  let sample = textureSample(depth_texture, texture_sampler, input.uv);
  let normalized = normalize_lol(sample, 0.9468, 1);

  let near = 1.0;
  let far = 100.0;
  let ndcDepth = (2.0 * input.position.z - near - far) / (far - near);
  // input.position.z = ndcDepth;
  let clipDepth = ndcDepth / input.uv.y;

  return vec4f(clipDepth, clipDepth, clipDepth, 1); 
}

fn normalize_lol(value: f32, min: f32, max: f32) -> f32 {
  return (value - min) / (max - min);
}