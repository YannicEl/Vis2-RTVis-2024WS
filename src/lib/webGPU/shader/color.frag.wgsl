@group(0) @binding(1) var<uniform> color : vec4f;

@fragment
fn main() -> @location(0) vec4f {
  return color;
}
