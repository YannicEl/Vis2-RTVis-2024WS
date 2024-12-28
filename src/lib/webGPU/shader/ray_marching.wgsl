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
  output.texcoord = vec2f((input.position.x + 1) / 2, (input.position.y + 1) / 2);
  // output.texcoord.x *= fragmentUniform.aspectRatio;

  return output;
}

// -------------- //

struct FragmentUniform {
  clearColor: vec4f,
  fragmentColor: vec4f,
  cameraPosition: vec3f,
  projectionMatrixInverse: mat4x4f,
  cameraToWorldMatrix: mat4x4f,
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
  let ray_origin = vec3f(0, 0, -10);
  let ray_direction = vec3f(input.texcoord, 1);
  // var ray_direction = (fragmentUniform.projectionMatrixInverse * vec4f(input.texcoord * 2. - 1., 0, 1)).xyz;
  // ray_direction = (fragmentUniform.cameraToWorldMatrix * vec4(ray_direction, 0)).xyz;
  // ray_direction = normalize(ray_direction);

  ray_march(ray_origin, ray_direction);
  return ray_march_2(ray_origin, ray_direction);


  // return vec4f(input.texcoord, 0, 1);
  // return vec4f(ray_direction.xyz, 1);
}

const NUMBER_OF_STEPS = 100;
const MINIMUM_HIT_DISTANCE = 0.001;
const MAXIMUM_TRACE_DISTANCE = 1000.0;

fn ray_march_2(ray_origin: vec3f, ray_direction: vec3f) -> vec4f {
  let distance_travelled = rayMarch(ray_origin, ray_direction);

  let hit_position = ray_origin + distance_travelled * ray_direction;

  if(distance_travelled > MAXIMUM_TRACE_DISTANCE) {
    return vec4f(1, 1, 1, 1,);
  } else {
    return vec4f(1, 0, 0, 1);
  }
}

fn rayMarch(ray_origin: vec3f, ray_direction: vec3f) -> f32 {
    var total_distance: f32 = 0; // total distance travelled
    var current_distance: f32 = 0; // current scene distance
    var current_position: vec3f; // current position of ray

    for (var i = 0; i < NUMBER_OF_STEPS; i++) { // main loop
        current_position = ray_origin + current_distance * ray_direction; // calculate new position
        current_distance = scene(current_position); // get scene distance
        
        // if we have hit anything or our distance is too big, break loop
        if (current_distance < MINIMUM_HIT_DISTANCE || total_distance >= MAXIMUM_TRACE_DISTANCE) {
          break;
        }

        // otherwise, add new scene distance to total distance
        total_distance += current_distance;
    }

    return total_distance; // finally, return scene distance
}

fn scene(position: vec3f) -> f32 {
  // distance to sphere 1
  let sphere1Dis = distance(position, vec3(5, 5, 0)) - 1.;
  return sphere1Dis;

  // // distance to sphere 2
  // let sphere2Dis = distance(position, vec3(0, 0, 0)) - 0.75;

  // // return the minimum distance between the two spheres smoothed by 0.5
  // // return smin(sphere1Dis, sphere2Dis, 0.5);
  // return min(sphere1Dis, sphere2Dis);
}

fn smin(a: f32, b: f32, k: f32) -> f32 {
  let h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

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
