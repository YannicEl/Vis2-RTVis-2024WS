@group(0) @binding(0) var texture: texture_storage_3d<rgba8unorm, write>;
@group(0) @binding(1) var<storage, read> atoms: array<vec3f>;

override workgroup_size: u32;  

const RADIUS = 1;

@compute @workgroup_size(workgroup_size) fn compute(
  @builtin(global_invocation_id) pixel : vec3<u32>,
  @builtin(num_workgroups) dimensions: vec3<u32>
) {
  let size = textureDimensions(texture);
  if(pixel.x >= size.x) {
    return;
  }

  for (var i = 0u; i <= arrayLength(&atoms); i++) {
    let atom = atoms[i];
    let distance = distance(vec3f(pixel), atom);

    if(distance <= RADIUS) {
      textureStore(texture, pixel, vec4f(1, 1, 1, 1));
      break;
    }
  }
}
