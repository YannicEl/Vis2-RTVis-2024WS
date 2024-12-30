diagnostic(off, derivative_uniformity);

struct Uniforms {
  fragmentColor: vec4f,
  clearColor: vec4f,
  cameraPosition: vec3f,
  inverseProjectionMatrix: mat4x4f,
  cameraToWorldMatrix: mat4x4f,
  aspectRatio: f32,
  numberOfSteps: i32,
  minimumHitDistance: f32,
  maximumTraceDistance: f32,
}

@group(0) @binding(1) var<uniform> uniforms: Uniforms;
@group(0) @binding(2) var sdf_sampler: sampler;
@group(0) @binding(3) var sdf_texture: texture_3d<f32>;

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


// https://michaelwalczyk.com/blog-ray-marching.html
fn ray_march(
  ray_origin: vec3f, 
  ray_direction: vec3f,
) -> vec4f {
  var total_distance_traveled = 0.0;

  for (var i = 0; i < uniforms.numberOfSteps; i++) {
    // Calculate our current position along the ray
    let current_position = ray_origin + total_distance_traveled * ray_direction;

    // We wrote this function earlier in the tutorial -
    // assume that the sphere is centered at the origin
    // and has unit radius
    let distance_to_closest: f32 = atoms_SDF(current_position);

    // hit
    if (distance_to_closest < uniforms.minimumHitDistance) {
      // pre-multiply alpha to the color. https://stackoverflow.com/a/12290551
      // let alpha = 1.0 - total_distance_traveled / maximumTraceDistance;


      let alpha = 0.5;
      let color = vec4f(uniforms.fragmentColor.rgb * alpha, alpha);
      return color;
      // return uniforms.fragmentColor;
    }

    // miss
    if (total_distance_traveled > uniforms.maximumTraceDistance) {
      break;
    }

    // accumulate the distance traveled thus far
    total_distance_traveled += distance_to_closest;
  }

  return uniforms.clearColor;
}

fn atoms_SDF(position: vec3f) -> f32 {
  // TODO: no hardcoded values
  let height: f32 = 64;
  let width: f32 = 64;
  let depth: f32 = 64;

  if(
    position.x >= -width && position.x <= width &&
    position.y >= -height && position.y <= height &&
    position.z >= -depth && position.z <= depth
  ) {
    let pixel = vec3f(
      normalize_lol(position.x, -width, width), 
      normalize_lol(position.y, -height, height), 
      normalize_lol(position.z, -depth, depth),
    );
    let sample = textureSample(sdf_texture, sdf_sampler, pixel);
    return sample.r;
  } else {
    // TODO should be shortest distance between position and texture cube
    return 1;
  }
}

fn normalize_lol(value: f32, min: f32, max: f32) -> f32 {
  return (value - min) / (max - min);
}