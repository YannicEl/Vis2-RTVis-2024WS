import{G as b,T as D,M as C,U as S,f as z}from"./Scene.D-IVrs4_.js";import{g as h}from"./controls.svelte.EJqBkrRw.js";import{g as w}from"./entry.DT83CXea.js";import{g as B}from"./globalState.svelte.CHPqU7Zl.js";class P extends b{constructor(){const e=[-1,1,0,1,1,0,1,-1,0,-1,-1,0],n=[0,3,2,2,1,0];super({vertices:e,indices:n})}}const M=`@group(0) @binding(0) var texture: texture_storage_3d<rgba8snorm, write>;
@group(0) @binding(1) var<storage, read> atoms: array<vec3f>;

override radius: f32;  
override scale: f32;  

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

    value = smin(value, distance - radius, scale);
  }

  textureStore(texture, pixel, vec4f(value, value, value, 1));
}

// https://iquilezles.org/articles/smin/
fn smin(a: f32, b: f32, k: f32) -> f32 {
  let h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}`;async function U({device:t,width:e,height:n,depth:r,radius:i=1,scale:a=1,atoms:u}){const{maxBufferSize:c}=t.limits,o=1;for(;;)if(a+=.1,e*n*r*Math.pow(a,3)*4>c*.3||a>o){a-=.1;break}e=Math.ceil(e*a),n=Math.ceil(n*a),r=Math.ceil(r*a),i=Math.ceil(i*a),console.log(`SDF Texture size: ${e}x${n}x${r}`),u.forEach(s=>(s.setPosition(s.position.map(y=>y*a)),s));const m=new D({format:"rgba8snorm",size:[e,n,r],dimension:"3d",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.STORAGE_BINDING}),g=[e,n,r].map(s=>Math.ceil(s/4)),p=await t.createComputePipelineAsync({label:"compute pipeline",layout:"auto",compute:{module:t.createShaderModule({code:M}),constants:{radius:i,scale:a}}}),f=new Float32Array(u.length*4-1);for(let s=0;s<u.length;s++)f.set(u[s].position,s*4);const _=t.createBuffer({size:f.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST});t.queue.writeBuffer(_,0,f);const x=t.createBindGroup({label:"Compute Bind Group",layout:p.getBindGroupLayout(0),entries:[{binding:0,resource:m.createView(t)},{binding:1,resource:{buffer:_}}]}),d=t.createCommandEncoder({label:"compute builtin encoder"}),l=d.beginComputePass({label:"compute builtin pass"});l.setPipeline(p),l.setBindGroup(0,x),l.dispatchWorkgroups(...g),l.end();const v=d.finish();return t.queue.submit([v]),m}const T=`diagnostic(off, derivative_uniformity);

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
  reflections: i32,
  molecularStructure: i32,
  near: f32,
  far:f32,
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
  if(ray_marching_sample[3] > uniforms.maximumTraceDistance) {
    return ray_marching_sample;
  }

  let pixel = vec2f(input.uv.x, 1 - input.uv.y);

  let molecule_sample = textureSample(molecule_texture, texture_sampler, pixel);

  var mix_factor = 0.0;
  if(uniforms.transparency == 1 && uniforms.molecularStructure == 1) {
    let depth_sample = textureSample(depth_texture, texture_sampler, pixel);
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

      var color = uniforms.fragmentColor.rgb;
      color += subsurface_scattering_factor;

      if(uniforms.reflections == 1) {
        let normal = calculate_normal(current_position);
        let reflect_direction = reflect(ray_direction, normal); 
        let reflection = ray_march_reflection(current_position + normal * 0.4, reflect_direction);
        color += reflection.rgb * uniforms.reflectionFactor;
      }

      return vec4f(color, total_distance_traveled);
    }

    // miss
    if (total_distance_traveled > uniforms.maximumTraceDistance) {
      break;
    }

    // accumulate the distance traveled thus uniforms.far
    total_distance_traveled += distance_to_closest;
  }

  return vec4f(uniforms.clearColor.rgb, total_distance_traveled);
}

fn ray_march_reflection(
  ray_origin: vec3f, 
  ray_direction: vec3f,
) -> vec4f {
  var total_distance_traveled = 0.0;

  for (var i = 0; i < uniforms.numberOfSteps / 8; i++) {
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
    if (total_distance_traveled > uniforms.maximumTraceDistance / 8) {
      break;
    }

    // accumulate the distance traveled thus uniforms.far
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
  return (2.0 * uniforms.near) / (uniforms.far + uniforms.near - value * (uniforms.far - uniforms.near));
}

fn calculate_normal(point: vec3f) -> vec3f {
    let small_step = vec3f(1, 0, 0);

    let gradient_x = atoms_SDF(point + small_step.xyy) - atoms_SDF(point - small_step.xyy);
    let gradient_y = atoms_SDF(point + small_step.yxy) - atoms_SDF(point - small_step.yxy);
    let gradient_z = atoms_SDF(point + small_step.yyx) - atoms_SDF(point - small_step.yyx);

    let normal = vec3f(gradient_x, gradient_y, gradient_z);

    return normalize(normal);
}`;class V extends C{constructor(e){super({descriptor:{label:"Ray Marching Shader",code:T},requiresModelUniforms:!1}),this.uniformBuffer=new S({fragmentColor:"vec4",clearColor:"vec4",cameraPosition:"vec3",projectionMatrixInverse:"mat4",viewMatrixInverse:"mat4",numberOfSteps:"i32",minimumHitDistance:"f32",maximumTraceDistance:"f32",subsurfaceDepth:"f32",maximumTransparencyDepth:"f32",reflectionFactor:"f32",width:"f32",height:"f32",depth:"f32",subsurfaceScattering:"i32",transparency:"i32",reflections:"i32",molecularStructure:"i32",near:"f32",far:"f32"},"Ray Marching Material Buffer"),this.updateBufferValues(e)}updateBufferValues(e){this.uniformBuffer&&Object.entries(e).forEach(([n,r])=>{var a;let i;typeof r=="string"?i=z.fromCssString(r).value:typeof r=="number"?i=[r]:i=r,(a=this.uniformBuffer)==null||a.set({[n]:i})})}update(e,n){this.uniformBuffer&&(this.updateBufferValues(n),this.uniformBuffer.write(e))}}function I(t){const e=h(),n="Ray Marching",r=e.addControl({name:"Clear color",group:n,type:"color",value:"#ffffff"});r.onChange(o=>t.updateBufferValues({clearColor:o}));const i=e.addControl({name:"Fragment color",group:n,type:"color",value:"#0000ff"});i.onChange(o=>t.updateBufferValues({fragmentColor:o}));const a=e.addControl({name:"Number of steps",group:n,type:"range",value:500,min:0,max:5e3});a.onChange(o=>t.updateBufferValues({numberOfSteps:o}));const u=e.addControl({name:"Minimum hit distance",group:n,type:"range",value:.4,step:.01,min:0,max:1});u.onChange(o=>t.updateBufferValues({minimumHitDistance:o}));const c=e.addControl({name:"Maximum trace distance",group:n,type:"range",value:1e3,min:0,max:5e3});return c.onChange(o=>t.updateBufferValues({maximumTraceDistance:o})),{clearColor:r,fragmentColor:i,numberOfSteps:a,minimumHitDistance:u,maximumTraceDistance:c}}function R(){const t=h(),e="Misc",n=t.addControl({name:"Show Fps",group:e,type:"checkbox",value:!0});n.onChange(i=>B.showFps=i);const r=t.addControl({name:"backToLandingPage",group:e,type:"button",label:"Back to landing page",value:!1,onClick:()=>w("/")});return{showFps:n,backToLandingPage:r}}export{P as Q,V as R,I as a,R as b,U as c};
