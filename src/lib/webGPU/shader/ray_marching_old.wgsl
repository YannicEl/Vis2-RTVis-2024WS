// https://michaelwalczyk.com/blog-ray-marching.html

struct VertexUniform {
  viewProjectionMatrix: mat4x4f,
  modelMatrix: mat4x4f,
}

@group(0) @binding(0) var<uniform> vertexUniform: VertexUniform;

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(2) uv: vec2f,
}

struct VertexInput {
  @location(0) position: vec4f,
}

@vertex
fn vertex(
  input: VertexInput
) -> VertexOutput {
  var output: VertexOutput;

  output.position = vertexUniform.viewProjectionMatrix * vertexUniform.modelMatrix * input.position;

  output.uv = input.position.xy;
  output.uv.x *= fragmentUniform.aspectRatio;

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
@group(0) @binding(2) var ourTexture: texture_3d<f32>;
@group(0) @binding(3) var ourSampler: sampler;

@fragment
fn fragment(
  input: VertexOutput
) -> @location(0) vec4f {
  var camera_position = vec3f(fragmentUniform.cameraPosition);
  camera_position.z = camera_position.z * -1;

  let ray_origin = camera_position;
  let ray_direction = vec3f(input.uv, 1);

  let color = textureSample(ourTexture, ourSampler, vec3(input.uv, fragmentUniform.depth));
  return vec4f(color.r, color.r, color.r, 1);
  
  // return ray_march(ray_origin, ray_direction) * textureSample(ourTexture, ourSampler, input.uv);
}

const NUMBER_OF_STEPS = 32;
const MINIMUM_HIT_DISTANCE = 0.001;
const MAXIMUM_TRACE_DISTANCE = 1000.0;

fn ray_march(ray_origin: vec3f, ray_direction: vec3f) -> vec4f {
  var total_distance_traveled: f32 = 0.0;

  for (var i = 0; i < NUMBER_OF_STEPS; i++) {
    // Calculate our current position along the ray
    let current_position: vec3f = ray_origin + total_distance_traveled * ray_direction;

    // We wrote this function earlier in the tutorial -
    // assume that the sphere is centered at the origin
    // and has unit radius
    let distance_to_closest: f32 = sphere_SDF(current_position);

    // hit
    if (distance_to_closest < MINIMUM_HIT_DISTANCE) {
      let normal = calculate_normal(current_position);
      
      let light_position = vec3f(2.0, -5.0, 3.0);
      let direction_to_light = normalize(current_position - light_position);

      let diffuse_intensity = max(0.0, dot(normal, direction_to_light));

      return fragmentUniform.fragmentColor * diffuse_intensity;
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

fn calculate_normal(point: vec3f) -> vec3f {
    let small_step = vec3f(0.001, 0.0, 0.0);

    let gradient_x = sphere_SDF(point + small_step.xyy) - sphere_SDF(point - small_step.xyy);
    let gradient_y = sphere_SDF(point + small_step.yxy) - sphere_SDF(point - small_step.yxy);
    let gradient_z = sphere_SDF(point + small_step.yyx) - sphere_SDF(point - small_step.yyx);

    let normal = vec3f(gradient_x, gradient_y, gradient_z);

    return normalize(normal);
}

fn sphere_SDF(position: vec3f) -> f32 {
  let displacement = sin(5.0 * position.x) * sin(5.0 * position.y) * sin(5.0 * position.z) * 0.25;
  return length(position - vec3(0.0)) - 1.0 + displacement;
}