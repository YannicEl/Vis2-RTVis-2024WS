@group(0) @binding(1) var<uniform> color2 : vec4f;

@fragment
fn main(
@location(0) color : vec4f
) -> @location(0) vec4f {
  return color2;
}
