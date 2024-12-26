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

@fragment fn fs(
  input: VertexOutput
) -> @location(0) vec4f {
  let camera_position = vec3f(0, 0, -16);
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
      let normal = calculate_normal(current_position);

      let light_position = vec3f(2.0, 0, 3.0);
      let direction_to_light = normalize(current_position - light_position);

      let diffuse_intensity = max(0.0, dot(normal, direction_to_light) + 0.5);

      return vec4f(1, 0, 0, 0) * diffuse_intensity;
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
  let height: f32 = 16;
  let width: f32 = 16;
  let depth: f32 = 2;

  let sample = textureSample(ourTexture, ourSampler, vec3f(position.x / width, position.y / height, position.z / depth));
  if(
    position.x >= 0 && position.x <= width &&
    position.y >= 0 && position.y <= height &&
    position.z >= 0 && position.z <= depth
  ) {
    return sample.r;
  } else {
    return 1;
  }
}

fn calculate_normal(point: vec3f) -> vec3f {
  let small_step = vec3f(0.001, 0.0, 0.0);

  let gradient_x = atoms_SDF(point + small_step.xyy) - atoms_SDF(point - small_step.xyy);
  let gradient_y = atoms_SDF(point + small_step.yxy) - atoms_SDF(point - small_step.yxy);
  let gradient_z = atoms_SDF(point + small_step.yyx) - atoms_SDF(point - small_step.yyx);

  let normal = vec3f(gradient_x, gradient_y, gradient_z);

  return normalize(normal);
}