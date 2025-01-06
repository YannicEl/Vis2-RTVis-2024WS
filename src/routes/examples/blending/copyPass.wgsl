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
  output.texcoord = vec2f(output.texcoord.x, 1.0 - output.texcoord.y);

  return output;
}

//-------------- //

@group(0) @binding(2) var ourSampler : sampler;
@group(0) @binding(3) var ourTexture1 : texture_2d<f32>;
@group(0) @binding(4) var ourTexture2 : texture_2d<f32>;

@fragment
fn fragment(
input : VertexOutput
) -> @location(0) vec4f {
  let sample = textureSample(ourTexture1, ourSampler, input.texcoord);
  let sample2 = textureSample(ourTexture2, ourSampler, input.texcoord);

  // background "removal"
  // if (sample.r == 0.0 && sample.g == 0.0 && sample.b == 0.0) {
  //   return vec4f(1.0, 0.0, 0.0, 1.0);
  // }

  return sample2;
  // return mix(sample, sample2, 0.5);
}
