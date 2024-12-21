@group(0) @binding(0) var<storage, read_write> texture: array<u32>;
@group(0) @binding(1) var<storage, read> atoms: array<vec3f>;

override workgroup_size: u32;  
override width: u32; 

const RADIUS = 1;

@compute @workgroup_size(workgroup_size) fn compute(
  @builtin(global_invocation_id) pixel : vec3<u32>,
  @builtin(num_workgroups) dimensions: vec3<u32>
) {
  if(pixel.x >= width) {
    return;
  }

  var hit = false;
  for (var i = 0u; i <= arrayLength(&atoms); i++) {
    let atom = atoms[i];
    let distance = distance(vec3f(pixel), atom);

    if(distance <= RADIUS) {
      hit = true;
      break;
    }
  }

  if(hit) {
    let pixel_index = pixel.x + width * pixel.y + width * dimensions.y * pixel.z;
    texture[pixel_index] = 255; 
  } 
}
