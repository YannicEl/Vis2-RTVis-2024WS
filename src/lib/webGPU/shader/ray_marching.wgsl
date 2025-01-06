diagnostic(off, derivative_uniformity);

struct Uniforms {
  fragmentColor: vec4f,
  clearColor: vec4f,
  cameraPosition: vec3f,
  projectionMatrixInverse: mat4x4f,
  viewMatrixInverse: mat4x4f,
  numberOfSteps: i32,
  minimumHitDistance: f32,
  maximumTraceDistance: f32,
  subsurfaceDepth: f32,
  maximumTransparencyDepth: f32,
  reflectionFactor: f32,
  width: f32,
  height: f32,
  depth: f32,
  subsurfaceScattering: i32,
  transparency: i32,
}

@group(0) @binding(1) var<uniform> uniforms: Uniforms;
@group(0) @binding(2) var texture_sampler: sampler;
@group(0) @binding(3) var sdf_texture: texture_3d<f32>;
@group(0) @binding(4) var depth_texture: texture_depth_2d;
@group(0) @binding(5) var molecule_texture: texture_2d<f32>;

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
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
  output.uv = vec2f((input.position.x + 1) / 2, (input.position.y + 1) / 2);
  
  return output;
}

// -------------- //

@fragment
fn fragment(
  input: VertexOutput
) -> @location(0) vec4f {
  let ray_origin = uniforms.cameraPosition;

  // the following three lines are from: https://codepen.io/NabilNYMansour/pen/JjqoLJe?editors=0010
  var ray_direction =  (uniforms.projectionMatrixInverse * vec4f(input.uv * 2 - 1, 0, 1)).xyz;
  ray_direction = (uniforms.viewMatrixInverse * vec4f(ray_direction, 0)).xyz;
  ray_direction = normalize(ray_direction);

  let ray_marching_sample = ray_march(ray_origin, ray_direction);

  let pixel = vec2f(input.uv.x, 1 - input.uv.y);
  let depth_sample = textureSample(depth_texture, texture_sampler, pixel);
  let molecule_sample = textureSample(molecule_texture, texture_sampler, pixel);

  var mix_factor = 0.0;
  if(uniforms.transparency == 1) {
  let depth_normalized = normalize_depth(depth_sample);
  let ray_marching_normalized = normalize_lol(ray_marching_sample[3], 0, uniforms.maximumTraceDistance);

  let distance_max = uniforms.maximumTransparencyDepth;
  let sigma = (depth_normalized - ray_marching_normalized) / distance_max;

  mix_factor = pow(2.71828182846, -5 * sigma);
  }

  // let value = sigma;
  // return vec4f(value, value, value, 1);
  return mix(ray_marching_sample, molecule_sample, mix_factor); 
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

      var subsurface_scattering_factor = 0.0;
      if(uniforms.subsurfaceScattering == 1) {
        let subsurface_position = ray_origin + (total_distance_traveled + uniforms.subsurfaceDepth) * ray_direction;
        let distance_to_surface = atoms_SDF(subsurface_position);
        subsurface_scattering_factor = 1 - (uniforms.subsurfaceDepth - distance_to_surface) / (2 * uniforms.subsurfaceDepth);
      }

      let normal = calculate_normal(current_position);
      let reflect_direction = reflect(ray_direction, normal); 
      let reflection = ray_march_reflection(current_position + normal * 0.4, reflect_direction);

      var color = uniforms.fragmentColor.rgb;
      color += subsurface_scattering_factor;
      color += reflection.rgb * uniforms.reflectionFactor;


      return vec4f(color, total_distance_traveled);
    }

    // miss
    if (total_distance_traveled > uniforms.maximumTraceDistance) {
      break;
    }

    // accumulate the distance traveled thus far
    total_distance_traveled += distance_to_closest;
  }

  return vec4f(uniforms.clearColor.rgb, total_distance_traveled);
}

fn ray_march_reflection(
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
      var subsurface_scattering_factor = 0.0;
      if(uniforms.subsurfaceScattering == 1) {
        let subsurface_position = ray_origin + (total_distance_traveled + uniforms.subsurfaceDepth) * ray_direction;
        let distance_to_surface = atoms_SDF(subsurface_position);
        subsurface_scattering_factor = 1 - (uniforms.subsurfaceDepth - distance_to_surface) / (2 * uniforms.subsurfaceDepth);
      }

      var color = vec4f(uniforms.fragmentColor.rgb + subsurface_scattering_factor, total_distance_traveled);
      return color;
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
  let width = uniforms.width;
  let height = uniforms.height;
  let depth = uniforms.depth;

  if(
    position.x >= -(width / 2) && position.x <= width / 2 &&
    position.y >= -(height / 2) && position.y <= height / 2 &&
    position.z >= -(depth / 2) && position.z <= depth / 2 
  ) {
    let pixel = vec3f(
      normalize_lol(position.x, -width / 2, width / 2), 
      normalize_lol(position.y, -height / 2, height / 2), 
      normalize_lol(position.z, -depth / 2, depth / 2),
    );
    let sample = textureSample(sdf_texture, texture_sampler, pixel);
    return sample.r;
  } else {
    // TODO should be shortest distance between position and texture cube
    // Currently approximating the cube with a shere
    let center = vec3f(0, 0, 0);
    let radius = sqrt(pow(width, 2) + pow(height, 2) + pow(depth, 2));
    let distance_from_center = distance(center, position);
      
    let padding = 0.4;
    if(distance_from_center > radius + padding) {
      return distance_from_center - radius;
    } else {
      return 1;
    }
  }
}

fn normalize_lol(value: f32, min: f32, max: f32) -> f32 {
  return (value - min) / (max - min);
}

fn normalize_depth(value: f32) -> f32 {
  let near = 0.1;
  let far = 1000.0;
  return (2.0 * near) / (far + near - value * (far - near));
}

fn calculate_normal(point: vec3f) -> vec3f {
    let small_step = vec3f(1, 0, 0);

    let gradient_x = atoms_SDF(point + small_step.xyy) - atoms_SDF(point - small_step.xyy);
    let gradient_y = atoms_SDF(point + small_step.yxy) - atoms_SDF(point - small_step.yxy);
    let gradient_z = atoms_SDF(point + small_step.yyx) - atoms_SDF(point - small_step.yyx);

    let normal = vec3f(gradient_x, gradient_y, gradient_z);

    return normalize(normal);
}