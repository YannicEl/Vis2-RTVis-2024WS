diagnostic(off, derivative_uniformity);

// https://michaelwalczyk.com/blog-ray-marching.html

struct VertexUniform {
  viewProjectionMatrix: mat4x4f,
  modelMatrix: mat4x4f,
}

@group(0) @binding(0) var<uniform> vertexUniform: VertexUniform;

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

  let lol = vertexUniform.viewProjectionMatrix * vertexUniform.modelMatrix;

  output.position = input.position;
  output.texcoord = vec2f(input.position.x + 1.0, 1.0 - input.position.y);
  output.texcoord.x *= fragmentUniform.aspectRatio;

  return output;
}

// -------------- //

struct FragmentUniform {
  clearColor: vec4f,
  fragmentColor: vec4f,
  cameraPosition: vec3f,
  aspectRatio: f32,
  depth: f32,
}

@group(0) @binding(1) var<uniform> fragmentUniform: FragmentUniform;
@group(0) @binding(2) var ourSampler: sampler;
@group(0) @binding(3) var ourTexture: texture_3d<f32>;

@fragment
fn fragment(
  input: VertexOutput
) -> @location(0) vec4f {
  let ray_origin = fragmentUniform.cameraPosition;
  let ray_direction = vec3f(input.texcoord, 1);

  return ray_march(ray_origin, ray_direction);
}

const NUMBER_OF_STEPS = 32;
const MINIMUM_HIT_DISTANCE = 0.001;
const MAXIMUM_TRACE_DISTANCE = 1000.0;

fn ray_march(
  ray_origin: vec3f, 
  ray_direction: vec3f,
) -> vec4f {
  var total_distance_traveled: f32 = 0.0;

  for (var i = 0; i < NUMBER_OF_STEPS; i++) {
    // Calculate our current position along the ray
    let current_position: vec3f = ray_origin + total_distance_traveled * ray_direction;

    // We wrote this function earlier in the tutorial -
    // assume that the sphere is centered at the origin
    // and has unit radius
    let distance_to_closest: f32 = atoms_SDF(current_position);

    // hit
    if (distance_to_closest < MINIMUM_HIT_DISTANCE) {
      return fragmentUniform.fragmentColor;
    }

    // miss
    if (total_distance_traveled > MAXIMUM_TRACE_DISTANCE) {
      break;
    }

    // accumulate the distance traveled thus far
    total_distance_traveled += distance_to_closest;
  }

  return fragmentUniform.clearColor;
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
