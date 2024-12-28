@group(0) @binding(0) var texture: texture_storage_3d<rgba8snorm, write>;
@group(0) @binding(1) var<storage, read> atoms: array<vec3f>;

override radius: f32;  

@compute @workgroup_size(4, 4, 4) fn compute(
  @builtin(global_invocation_id) pixel : vec3<u32>,
  @builtin(num_workgroups) dimensions: vec3<u32>
) {
  let size = textureDimensions(texture);
  if(pixel.x >= size.x || pixel.y >= size.y || pixel.z >= size.z) {
    return;
  }

  var value = 1.0;
  for (var i = 0u; i <= arrayLength(&atoms); i++) {
    let atom = atoms[i];
    let distance = distance(vec3f(pixel), atom);

    value = smin(value, distance - radius, 0.5);
  }

  textureStore(texture, pixel, vec4f(value, value, value, 1));
}

// https://iquilezles.org/articles/smin/
fn smin(a: f32, b: f32, k: f32) -> f32 {
  let h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}