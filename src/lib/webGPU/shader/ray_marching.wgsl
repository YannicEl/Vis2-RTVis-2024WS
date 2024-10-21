// https://michaelwalczyk.com/blog-ray-marching.html

@group(0) @binding(0) var<uniform> viewProjectionMatrix : mat4x4f;
@group(0) @binding(1) var<uniform> modelMatrix : mat4x4f;

struct VertexOutput {
  @builtin(position) position : vec4f,
  @location(2) uv: vec2f,
}

struct VertexInput {
  @location(0) position : vec4f,
}

@vertex
fn vertex(
  input: VertexInput
) -> VertexOutput {
  var output : VertexOutput;

  output.position = viewProjectionMatrix * modelMatrix * input.position;

  output.uv = input.position.xy;

  return output;
}

// -------------- //

@group(0) @binding(2) var<uniform> clearColor : vec4f;

@fragment
fn fragment(
  input: VertexOutput
) -> @location(0) vec4f {
  let camera_position = vec3f(0, 0, -5);
  let ray_origin = camera_position;
  let ray_diretion = vec3f(input.uv, 1);

  return ray_march(ray_origin, ray_diretion);
}

const NUMBER_OF_STEPS = 32;
const MINIMUM_HIT_DISTANCE = 0.001;
const MAXIMUM_TRACE_DISTANCE = 1000.0;

fn ray_march(ray_origin: vec3f, ray_diretion: vec3f) -> vec4f {
  var total_distance_traveled: f32 = 0.0;

  for (var i = 0; i < NUMBER_OF_STEPS; i++) {
    // Calculate our current position along the ray
    let current_position: vec3f = ray_origin + total_distance_traveled * ray_diretion;

    // We wrote this function earlier in the tutorial -
    // assume that the sphere is centered at the origin
    // and has unit radius
    let distance_to_closest: f32 = sphere_SDF(current_position, vec3(0.0), 1.0);

    // hit
    if (distance_to_closest < MINIMUM_HIT_DISTANCE) {
      return vec4f(1.0, 0.0, 0.0, 0.0);
    }

    // miss
    if (total_distance_traveled > MAXIMUM_TRACE_DISTANCE) {
      break;
    }

    // accumulate the distance traveled thus far
    total_distance_traveled += distance_to_closest;
  }

  return clearColor;
}

fn sphere_SDF(position: vec3f, center: vec3f, radius: f32) -> f32 {
  return length(position - center) - radius;
}