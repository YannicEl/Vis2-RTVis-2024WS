diagnostic(off, derivative_uniformity);

struct Uniforms {
  fragmentColor: vec4f,
  clearColor: vec4f,
  cameraPosition: vec3f,
  aspectRatio: f32,
  inverseProjectionMatrix: mat4x4f,
  cameraToWorldMatrix: mat4x4f,
}

@group(0) @binding(1) var<uniform> uniforms: Uniforms;
@group(0) @binding(2) var ourSampler: sampler;
@group(0) @binding(3) var ourTexture: texture_3d<f32>;

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) texcoord: vec2f,
}

struct VertexInput {
  @location(0) position: vec4f,
}

@vertex
fn vertex(
  input: VertexInput,
  @builtin(vertex_index) vertexIndex : u32
) -> VertexOutput {
  var output: VertexOutput;

  output.position = input.position;
  output.texcoord = vec2f((input.position.x + 1) / 2, (input.position.y + 1) / 2);
  output.texcoord.x *= uniforms.aspectRatio;

  return output;
}

// -------------- //

@fragment
fn fragment(
  input: VertexOutput
) -> @location(0) vec4f {
  let ray_origin = uniforms.cameraPosition;

  // the following three lines are from: https://codepen.io/NabilNYMansour/pen/JjqoLJe?editors=0010
  var ray_direction =  (uniforms.inverseProjectionMatrix * vec4f(input.texcoord * 2. - 1., 0, 1)).xyz;
  ray_direction = (uniforms.cameraToWorldMatrix * vec4f(ray_direction, 0)).xyz;
  ray_direction = normalize(ray_direction);

  return ray_march(ray_origin, ray_direction);

}

const NUMBER_OF_STEPS = 100;
const MINIMUM_HIT_DISTANCE = 0.001;
const MAXIMUM_TRACE_DISTANCE = 1000.0;

// https://michaelwalczyk.com/blog-ray-marching.html
fn ray_march(
  ray_origin: vec3f, 
  ray_direction: vec3f,
) -> vec4f {
  var total_distance_traveled = 0.0;

  for (var i = 0; i < NUMBER_OF_STEPS; i++) {
    // Calculate our current position along the ray
    let current_position = ray_origin + total_distance_traveled * ray_direction;

    // We wrote this function earlier in the tutorial -
    // assume that the sphere is centered at the origin
    // and has unit radius
    let distance_to_closest: f32 = atoms_SDF(current_position);

    // hit
    if (distance_to_closest < MINIMUM_HIT_DISTANCE) {
      return uniforms.fragmentColor;
    }

    // miss
    if (total_distance_traveled > MAXIMUM_TRACE_DISTANCE) {
      break;
    }

    // accumulate the distance traveled thus far
    total_distance_traveled += distance_to_closest;
  }

  return uniforms.clearColor;
}

fn atoms_SDF(position: vec3f) -> f32 {
  // TODO: no hardcoded values
  let height: f32 = 16;
  let width: f32 = 16;
  let depth: f32 = 16;

  if(
    position.x >= 0 && position.x <= width &&
    position.y >= 0 && position.y <= height &&
    position.z >= 0 && position.z <= depth
  ) {
    let sample = textureSample(ourTexture, ourSampler, vec3f(position.x / width, position.y / height, position.z / depth));
    return sample.r;
  } else {
    // TODO should be shortest distance between position and texture cube
    return 1;
  }
}
