@group(0) @binding(0) var<uniform> viewProjectionMatrix : mat4x4f;

struct VertexOutput {
  @builtin(position) position : vec4f,
}

@vertex
fn main(
@location(0) position : vec4f,
) -> VertexOutput {
  var output : VertexOutput;
  output.position = viewProjectionMatrix * position;
  return output;
}