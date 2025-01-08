import { c as pop, p as push } from "../../../../chunks/index2.js";
import "pdb-parser-js";
import { a as addGeneralControls, C as Camera, b as addCameraControls, g as getControls } from "../../../../chunks/cameraControls.js";
import { g as globalState } from "../../../../chunks/globalState.svelte.js";
function _page($$payload, $$props) {
  push();
  const controls = getControls();
  addGeneralControls();
  controls.addControl({ name: "Search", type: "text", value: "" });
  controls.addControl({
    name: "load",
    label: "Load (Online)",
    type: "button",
    value: "load"
  });
  const camera = new Camera();
  globalState.camera = camera;
  const cameraControls = addCameraControls(camera);
  cameraControls.distance.value = 20;
  $$payload.out += `<canvas class="h-full w-full"></canvas>`;
  pop();
}
export {
  _page as default
};
