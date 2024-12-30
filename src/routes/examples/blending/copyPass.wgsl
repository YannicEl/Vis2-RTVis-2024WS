struct VertexInput {
  @location(0) position : vec4f,
}

struct VertexOutput {
  @builtin(position) position : vec4f,
  @location(0) texcoord : vec2f,
}

@vertex
fn vertex(
input : VertexInput,
) -> VertexOutput {
  var output : VertexOutput;

  output.position = input.position;
  output.texcoord = vec2f((input.position.x + 1) / 2, (input.position.y + 1) / 2);

  return output;
}

//-------------- //

@group(0) @binding(2) var ourSampler : sampler;
@group(0) @binding(3) var ourTexture : texture_2d<f32>;

@fragment
fn fragment(
input : VertexOutput
) -> @location(0) vec4f {
  let sample = textureSample(ourTexture, ourSampler, input.texcoord);

  // background "removal"
  if (sample.r == 0.0 && sample.g == 0.0 && sample.b == 0.0) {
    return vec4<f32>(1.0, 0.0, 0.0, 1.0);
  }

  return mix(sample, vec4f(0, 0, 1, 1), 0.5);
}
