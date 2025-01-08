import { b as attr } from "../../../../chunks/attributes.js";
import { c as pop, p as push } from "../../../../chunks/index2.js";
import { C as Camera, a as addGeneralControls, b as addCameraControls } from "../../../../chunks/cameraControls.js";
import { g as globalState } from "../../../../chunks/globalState.svelte.js";
import { R as RayMarchingMaterial, a as addRayMarchingControls, b as addMiscControls } from "../../../../chunks/miscControls.svelte.js";
import "pdb-parser-js";
function _page($$payload, $$props) {
  push();
  const camera = new Camera();
  globalState.camera = camera;
  new RayMarchingMaterial({
    clearColor: "white",
    fragmentColor: "blue",
    cameraPosition: camera.position,
    projectionMatrixInverse: camera.projectionMatrixInverse,
    viewMatrixInverse: camera.viewMatrixInverse,
    numberOfSteps: 500,
    minimumHitDistance: 1e-3,
    maximumTraceDistance: 1e3,
    subsurfaceDepth: 2
  });
  addRayMarchingControls();
  addGeneralControls();
  addCameraControls(camera);
  addMiscControls();
  $$payload.out += `<canvas${attr("width", window.innerWidth)}${attr("height", window.innerHeight)} class="h-full w-full"></canvas>`;
  pop();
}
export {
  _page as default
};
