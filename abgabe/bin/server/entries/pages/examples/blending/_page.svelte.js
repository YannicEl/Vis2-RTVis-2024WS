import { b as attr } from "../../../../chunks/attributes.js";
import { c as pop, p as push } from "../../../../chunks/index2.js";
import { g as globalState } from "../../../../chunks/globalState.svelte.js";
import "pdb-parser-js";
import { g as getControls, C as Camera, a as addGeneralControls, b as addCameraControls } from "../../../../chunks/cameraControls.js";
import { R as RayMarchingMaterial, a as addRayMarchingControls, b as addMiscControls } from "../../../../chunks/miscControls.svelte.js";
import { g as goto } from "../../../../chunks/client2.js";
function addEffectsControls(material) {
  const controls = getControls();
  let group = "Subsurface scattering";
  const subsurfaceScattering = controls.addControl({
    name: "Enable",
    group,
    type: "checkbox",
    value: true
  });
  const subsurfaceDepth = controls.addControl({
    name: "Subsurface depth",
    group,
    type: "range",
    value: 4,
    step: 0.1,
    min: 0,
    max: 50
  });
  group = "Transparency";
  const transparency = controls.addControl({
    name: "Enable",
    group,
    type: "checkbox",
    value: true
  });
  const maximumTransparencyDepth = controls.addControl({
    name: "Maximum transparency depth",
    group,
    type: "range",
    value: 0.2,
    min: 0,
    max: 1,
    step: 0.01
  });
  group = "Reflection";
  const reflections = controls.addControl({
    name: "Enable",
    group,
    type: "checkbox",
    value: true
  });
  const reflectionFactor = controls.addControl({
    name: "Reflection factor",
    group,
    type: "range",
    value: 0.05,
    min: 0,
    max: 1,
    step: 0.01
  });
  return {
    subsurfaceScattering,
    subsurfaceDepth,
    transparency,
    maximumTransparencyDepth,
    reflections,
    reflectionFactor
  };
}
function _page($$payload, $$props) {
  push();
  if (!navigator.gpu) {
    alert("Your browser doesn't support WebGPU. Please use Chrome/Edge 113 or newer.");
    goto();
  }
  const camera = new Camera();
  globalState.camera = camera;
  const controls = getControls();
  new RayMarchingMaterial({
    clearColor: "white",
    fragmentColor: "blue",
    cameraPosition: camera.position,
    projectionMatrixInverse: camera.projectionMatrixInverse,
    viewMatrixInverse: camera.viewMatrixInverse,
    numberOfSteps: 500,
    minimumHitDistance: 0.4,
    maximumTraceDistance: 1e3,
    subsurfaceDepth: 4,
    maximumTransparencyDepth: 0.2,
    reflectionFactor: 0.05,
    subsurfaceScattering: 1,
    transparency: 1,
    reflections: 1,
    molecularStructure: 1,
    near: camera.near,
    far: camera.far
  });
  addGeneralControls();
  addEffectsControls();
  addRayMarchingControls();
  addCameraControls(camera);
  addMiscControls();
  controls.addControl({
    name: "Grid size",
    type: "number",
    value: 256,
    max: 1024
  });
  controls.addControl({ name: "Radius", type: "number", value: 5 });
  $$payload.out += `<canvas${attr("width", window.innerWidth)}${attr("height", window.innerHeight)} class="h-full w-full"></canvas>`;
  pop();
}
export {
  _page as default
};
