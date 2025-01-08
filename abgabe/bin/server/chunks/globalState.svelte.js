import { m as current_component } from "./index2.js";
function onDestroy(fn) {
  var context = (
    /** @type {Component} */
    current_component
  );
  (context.d ??= []).push(fn);
}
let globalState = { showFps: true, fps: 0 };
export {
  globalState as g,
  onDestroy as o
};
