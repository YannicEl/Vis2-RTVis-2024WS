import { vec4 } from "wgpu-matrix";
import { g as getControls } from "./cameraControls.js";
import { g as goto } from "./client2.js";
const queueBufferWrite = (device, buffer, data) => {
  device.queue.writeBuffer(buffer, 0, data);
};
class Color {
  value;
  constructor(params) {
    if (Array.isArray(params)) {
      this.value = vec4.fromValues(...params);
    } else {
      const { red, green, blue, alpha } = params;
      this.value = vec4.fromValues(red, green, blue, alpha);
    }
  }
  static fromCssString(cssColor) {
    const canvas = new OffscreenCanvas(1, 1);
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("Could not get 2d context");
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = cssColor;
    ctx.fillRect(0, 0, 1, 1);
    const [red, green, blue, alpha] = ctx.getImageData(0, 0, 1, 1).data;
    return new Color([red / 255, green / 255, blue / 255, alpha / 255]);
  }
}
const DATA_TYPE_SIZES = {
  f32: { size: 4, type: Float32Array },
  i32: { size: 4, type: Int32Array },
  vec3: { size: 12, align: 16, type: Float32Array },
  vec4: { size: 16, type: Float32Array },
  mat4: { size: 64, align: 16, type: Float32Array }
};
class UniformBuffer {
  descriptor;
  value;
  buffer;
  offsets = {};
  constructor(params, label) {
    let currentOffset = 0;
    for (const key in params) {
      const { size, align, type } = DATA_TYPE_SIZES[params[key]];
      let padding = 0;
      if (align) {
        const modulo = currentOffset % align;
        if (modulo > 0) {
          padding = align - modulo;
        }
      }
      this.offsets[key] = {
        type,
        byteOffset: currentOffset + padding,
        length: size / 4
      };
      currentOffset += size + padding;
    }
    const byteLength = currentOffset + (16 - currentOffset % 16);
    this.value = new ArrayBuffer(byteLength);
    this.descriptor = {
      label,
      size: this.value.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    };
  }
  set(values) {
    for (const key in values) {
      const value = values[key];
      if (value) {
        const { type, byteOffset, length } = this.offsets[key];
        const view = new type(this.value, byteOffset, length);
        view.set(value);
      }
    }
  }
  load(device) {
    if (this.buffer) return this.buffer;
    this.buffer = device.createBuffer(this.descriptor);
    return this.buffer;
  }
  write(device) {
    const buffer = this.load(device);
    queueBufferWrite(device, buffer, this.value);
  }
}
class Material {
  #shaderDescriptor;
  #shaderModules = /* @__PURE__ */ new WeakMap();
  uniformBuffer;
  requiresModelUniforms;
  constructor({ descriptor, requiresModelUniforms = true }) {
    this.#shaderDescriptor = descriptor;
    this.requiresModelUniforms = requiresModelUniforms;
  }
  load(device) {
    let shaderModule = this.#shaderModules.get(device);
    if (!shaderModule) {
      shaderModule = device.createShaderModule(this.#shaderDescriptor);
      this.#shaderModules.set(device, shaderModule);
    }
    if (this.uniformBuffer) this.uniformBuffer.write(device);
    return {
      shaderModule,
      uniformBuffer: this.uniformBuffer
    };
  }
}
const rayMarchingShader = "diagnostic(off, derivative_uniformity);\n\nstruct Uniforms {\n  fragmentColor: vec4f,\n  clearColor: vec4f,\n  cameraPosition: vec3f,\n  projectionMatrixInverse: mat4x4f,\n  viewMatrixInverse: mat4x4f,\n  numberOfSteps: i32,\n  minimumHitDistance: f32,\n  maximumTraceDistance: f32,\n  subsurfaceDepth: f32,\n  maximumTransparencyDepth: f32,\n  reflectionFactor: f32,\n  width: f32,\n  height: f32,\n  depth: f32,\n  subsurfaceScattering: i32,\n  transparency: i32,\n  reflections: i32,\n  molecularStructure: i32,\n  near: f32,\n  far:f32,\n}\n\n@group(0) @binding(1) var<uniform> uniforms: Uniforms;\n@group(0) @binding(2) var texture_sampler: sampler;\n@group(0) @binding(3) var sdf_texture: texture_3d<f32>;\n@group(0) @binding(4) var depth_texture: texture_depth_2d;\n@group(0) @binding(5) var molecule_texture: texture_2d<f32>;\n\nstruct VertexOutput {\n  @builtin(position) position: vec4f,\n  @location(0) uv: vec2f,\n}\n\nstruct VertexInput {\n  @location(0) position: vec4f,\n}\n\n@vertex\nfn vertex(\n  input: VertexInput,\n) -> VertexOutput {\n  var output: VertexOutput;\n\n  output.position = input.position;\n  output.uv = vec2f((input.position.x + 1) / 2, (input.position.y + 1) / 2);\n  \n  return output;\n}\n\n// -------------- //\n\n@fragment\nfn fragment(\n  input: VertexOutput\n) -> @location(0) vec4f {\n  let ray_origin = uniforms.cameraPosition;\n\n  // the following three lines are from: https://codepen.io/NabilNYMansour/pen/JjqoLJe?editors=0010\n  var ray_direction =  (uniforms.projectionMatrixInverse * vec4f(input.uv * 2 - 1, 0, 1)).xyz;\n  ray_direction = (uniforms.viewMatrixInverse * vec4f(ray_direction, 0)).xyz;\n  ray_direction = normalize(ray_direction);\n\n  let ray_marching_sample = ray_march(ray_origin, ray_direction);\n  if(ray_marching_sample[3] > uniforms.maximumTraceDistance) {\n    return ray_marching_sample;\n  }\n\n  let pixel = vec2f(input.uv.x, 1 - input.uv.y);\n\n  let molecule_sample = textureSample(molecule_texture, texture_sampler, pixel);\n\n  var mix_factor = 0.0;\n  if(uniforms.transparency == 1 && uniforms.molecularStructure == 1) {\n    let depth_sample = textureSample(depth_texture, texture_sampler, pixel);\n    let depth_normalized = normalize_depth(depth_sample);\n    let ray_marching_normalized = normalize_lol(ray_marching_sample[3], 0, uniforms.maximumTraceDistance);\n\n    let distance_max = uniforms.maximumTransparencyDepth;\n    let sigma = (depth_normalized - ray_marching_normalized) / distance_max;\n\n    mix_factor = pow(2.71828182846, -5 * sigma);\n  }\n\n  // let value = sigma;\n  // return vec4f(value, value, value, 1);\n  return mix(ray_marching_sample, molecule_sample, mix_factor); \n}\n\n// https://michaelwalczyk.com/blog-ray-marching.html\nfn ray_march(\n  ray_origin: vec3f, \n  ray_direction: vec3f,\n) -> vec4f {\n  var total_distance_traveled = 0.0;\n\n  for (var i = 0; i < uniforms.numberOfSteps; i++) {\n    // Calculate our current position along the ray\n    let current_position = ray_origin + total_distance_traveled * ray_direction;\n\n    // We wrote this function earlier in the tutorial -\n    // assume that the sphere is centered at the origin\n    // and has unit radius\n    let distance_to_closest: f32 = atoms_SDF(current_position);\n\n    // hit\n    if (distance_to_closest < uniforms.minimumHitDistance) {\n      // pre-multiply alpha to the color. https://stackoverflow.com/a/12290551\n      // let alpha = 1.0 - total_distance_traveled / maximumTraceDistance;\n\n      var subsurface_scattering_factor = 0.0;\n      if(uniforms.subsurfaceScattering == 1) {\n        let subsurface_position = ray_origin + (total_distance_traveled + uniforms.subsurfaceDepth) * ray_direction;\n        let distance_to_surface = atoms_SDF(subsurface_position);\n        subsurface_scattering_factor = 1 - (uniforms.subsurfaceDepth - distance_to_surface) / (2 * uniforms.subsurfaceDepth);\n      }\n\n      var color = uniforms.fragmentColor.rgb;\n      color += subsurface_scattering_factor;\n\n      if(uniforms.reflections == 1) {\n        let normal = calculate_normal(current_position);\n        let reflect_direction = reflect(ray_direction, normal); \n        let reflection = ray_march_reflection(current_position + normal * 0.4, reflect_direction);\n        color += reflection.rgb * uniforms.reflectionFactor;\n      }\n\n      return vec4f(color, total_distance_traveled);\n    }\n\n    // miss\n    if (total_distance_traveled > uniforms.maximumTraceDistance) {\n      break;\n    }\n\n    // accumulate the distance traveled thus uniforms.far\n    total_distance_traveled += distance_to_closest;\n  }\n\n  return vec4f(uniforms.clearColor.rgb, total_distance_traveled);\n}\n\nfn ray_march_reflection(\n  ray_origin: vec3f, \n  ray_direction: vec3f,\n) -> vec4f {\n  var total_distance_traveled = 0.0;\n\n  for (var i = 0; i < uniforms.numberOfSteps / 8; i++) {\n    // Calculate our current position along the ray\n    let current_position = ray_origin + total_distance_traveled * ray_direction;\n\n    // We wrote this function earlier in the tutorial -\n    // assume that the sphere is centered at the origin\n    // and has unit radius\n    let distance_to_closest: f32 = atoms_SDF(current_position);\n\n    // hit\n    if (distance_to_closest < uniforms.minimumHitDistance) {\n      var subsurface_scattering_factor = 0.0;\n      if(uniforms.subsurfaceScattering == 1) {\n        let subsurface_position = ray_origin + (total_distance_traveled + uniforms.subsurfaceDepth) * ray_direction;\n        let distance_to_surface = atoms_SDF(subsurface_position);\n        subsurface_scattering_factor = 1 - (uniforms.subsurfaceDepth - distance_to_surface) / (2 * uniforms.subsurfaceDepth);\n      }\n\n      var color = vec4f(uniforms.fragmentColor.rgb + subsurface_scattering_factor, total_distance_traveled);\n      return color;\n    }\n\n    // miss\n    if (total_distance_traveled > uniforms.maximumTraceDistance / 8) {\n      break;\n    }\n\n    // accumulate the distance traveled thus uniforms.far\n    total_distance_traveled += distance_to_closest;\n  }\n\n  return uniforms.clearColor;\n}\n\nfn atoms_SDF(position: vec3f) -> f32 {\n  let width = uniforms.width;\n  let height = uniforms.height;\n  let depth = uniforms.depth;\n\n  if(\n    position.x >= -(width / 2) && position.x <= width / 2 &&\n    position.y >= -(height / 2) && position.y <= height / 2 &&\n    position.z >= -(depth / 2) && position.z <= depth / 2 \n  ) {\n    let pixel = vec3f(\n      normalize_lol(position.x, -width / 2, width / 2), \n      normalize_lol(position.y, -height / 2, height / 2), \n      normalize_lol(position.z, -depth / 2, depth / 2),\n    );\n    let sample = textureSample(sdf_texture, texture_sampler, pixel);\n    return sample.r;\n  } else {\n    // TODO should be shortest distance between position and texture cube\n    // Currently approximating the cube with a shere\n    let center = vec3f(0, 0, 0);\n    let radius = sqrt(pow(width, 2) + pow(height, 2) + pow(depth, 2));\n    let distance_from_center = distance(center, position);\n      \n    let padding = 0.4;\n    if(distance_from_center > radius + padding) {\n      return distance_from_center - radius;\n    } else {\n      return 1;\n    }\n  }\n}\n\nfn normalize_lol(value: f32, min: f32, max: f32) -> f32 {\n  return (value - min) / (max - min);\n}\n\nfn normalize_depth(value: f32) -> f32 {\n  return (2.0 * uniforms.near) / (uniforms.far + uniforms.near - value * (uniforms.far - uniforms.near));\n}\n\nfn calculate_normal(point: vec3f) -> vec3f {\n    let small_step = vec3f(1, 0, 0);\n\n    let gradient_x = atoms_SDF(point + small_step.xyy) - atoms_SDF(point - small_step.xyy);\n    let gradient_y = atoms_SDF(point + small_step.yxy) - atoms_SDF(point - small_step.yxy);\n    let gradient_z = atoms_SDF(point + small_step.yyx) - atoms_SDF(point - small_step.yyx);\n\n    let normal = vec3f(gradient_x, gradient_y, gradient_z);\n\n    return normalize(normal);\n}";
class RayMarchingMaterial extends Material {
  constructor(params) {
    super({
      descriptor: {
        label: "Ray Marching Shader",
        code: rayMarchingShader
      },
      requiresModelUniforms: false
    });
    this.uniformBuffer = new UniformBuffer(
      {
        fragmentColor: "vec4",
        clearColor: "vec4",
        cameraPosition: "vec3",
        projectionMatrixInverse: "mat4",
        viewMatrixInverse: "mat4",
        numberOfSteps: "i32",
        minimumHitDistance: "f32",
        maximumTraceDistance: "f32",
        subsurfaceDepth: "f32",
        maximumTransparencyDepth: "f32",
        reflectionFactor: "f32",
        width: "f32",
        height: "f32",
        depth: "f32",
        subsurfaceScattering: "i32",
        transparency: "i32",
        reflections: "i32",
        molecularStructure: "i32",
        near: "f32",
        far: "f32"
      },
      "Ray Marching Material Buffer"
    );
    this.updateBufferValues(params);
  }
  updateBufferValues(params) {
    if (!this.uniformBuffer) return;
    Object.entries(params).forEach(([key, value]) => {
      let newValue;
      if (typeof value === "string") {
        newValue = Color.fromCssString(value).value;
      } else if (typeof value === "number") {
        newValue = [value];
      } else {
        newValue = value;
      }
      this.uniformBuffer?.set({ [key]: newValue });
    });
  }
  update(device, params) {
    if (!this.uniformBuffer) return;
    this.updateBufferValues(params);
    this.uniformBuffer.write(device);
  }
}
function addRayMarchingControls(material) {
  const controls = getControls();
  const group = "Ray Marching";
  const clearColor = controls.addControl({
    name: "Clear color",
    group,
    type: "color",
    value: "#ffffff"
  });
  const fragmentColor = controls.addControl({
    name: "Fragment color",
    group,
    type: "color",
    value: "#0000ff"
  });
  const numberOfSteps = controls.addControl({
    name: "Number of steps",
    group,
    type: "range",
    value: 500,
    min: 0,
    max: 5e3
  });
  const minimumHitDistance = controls.addControl({
    name: "Minimum hit distance",
    group,
    type: "range",
    value: 0.4,
    step: 0.01,
    min: 0,
    max: 1
  });
  const maximumTraceDistance = controls.addControl({
    name: "Maximum trace distance",
    group,
    type: "range",
    value: 1e3,
    min: 0,
    max: 5e3
  });
  return {
    clearColor,
    fragmentColor,
    numberOfSteps,
    minimumHitDistance,
    maximumTraceDistance
  };
}
function addMiscControls() {
  const controls = getControls();
  const group = "Misc";
  const showFps = controls.addControl({
    name: "Show Fps",
    group,
    type: "checkbox",
    value: true
  });
  const backToLandingPage = controls.addControl({
    name: "backToLandingPage",
    group,
    type: "button",
    label: "Back to landing page",
    value: false,
    onClick: () => goto()
  });
  return { showFps, backToLandingPage };
}
export {
  RayMarchingMaterial as R,
  addRayMarchingControls as a,
  addMiscControls as b
};
