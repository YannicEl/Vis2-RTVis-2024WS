diagnostic(off, derivative_uniformity);

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) texcoord: vec2f,
};

@vertex fn vs(
  @builtin(vertex_index) vertexIndex : u32
) -> VertexOutput {
  let pos = array(
    vec2f(0.0, 0.0),
    vec2f(1.0, 0.0),
    vec2f(0.0, 1.0),
    vec2f(0.0, 1.0),
    vec2f(1.0, 0.0),
    vec2f(1.0, 1.0),
  );

  var output: VertexOutput;

  let xy = pos[vertexIndex];
  output.position = vec4f((xy - 0.5) * 2, 0.0, 1.0);
  output.texcoord = vec2f(xy.x, 1.0 - xy.y);

  return output;
}

@group(0) @binding(0) var ourSampler: sampler;
@group(0) @binding(1) var ourTexture: texture_3d<f32>;
@group(0) @binding(2) var<uniform> camera_position: vec3f;

@fragment fn fs(
  input: VertexOutput
) -> @location(0) vec4f {
  let ray_origin = camera_position;
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
      return vec4f(1, 0, 0, 0);
    }

    // miss
    if (total_distance_traveled > MAXIMUM_TRACE_DISTANCE) {
      break;
    }

    // accumulate the distance traveled thus far
    total_distance_traveled += distance_to_closest;
  }

  return vec4f(1, 1, 1, 1);
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
