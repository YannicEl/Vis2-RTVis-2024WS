import { vec3, quat, mat4 } from "wgpu-matrix";
import "pdb-parser-js";
import { o as onDestroy } from "./globalState.svelte.js";
let controls = [];
function getControls() {
  function addControl(params) {
    let value = params;
    controls.push(value);
    value.value;
    function remove() {
      const index = controls.indexOf(value);
      controls.splice(index, 1);
    }
    onDestroy(remove);
    return {
      get value() {
        return value.value;
      },
      set value(newValue) {
        value.value = newValue;
      },
      set params(params2) {
        value = params2;
      },
      get params() {
        return params;
      },
      onChange: (callback) => {
      },
      remove
    };
  }
  return {
    get controls() {
      return controls;
    },
    addControl
  };
}
const degToRad = (degree) => {
  return degree * (Math.PI / 180);
};
class Object3D {
  position;
  scale;
  quaternion;
  constructor() {
    this.position = vec3.create();
    this.scale = vec3.create(1, 1, 1);
    this.quaternion = quat.identity();
  }
  // TODO: don't recompute matrix every time
  get modelMatrix() {
    let matrix = mat4.identity();
    const { axis, angle } = quat.toAxisAngle(this.quaternion);
    matrix = mat4.translate(matrix, this.position);
    matrix = mat4.rotate(matrix, axis, angle);
    matrix = mat4.scale(matrix, this.scale);
    return matrix;
  }
  reset() {
    this.position = vec3.create();
    this.scale = vec3.create(1, 1, 1);
    this.quaternion = quat.identity();
  }
  rotateX(angle) {
    this.quaternion = quat.rotateX(this.quaternion, degToRad(angle));
  }
  rotateY(angle) {
    this.quaternion = quat.rotateY(this.quaternion, degToRad(angle));
  }
  rotateZ(angle) {
    this.quaternion = quat.rotateZ(this.quaternion, degToRad(angle));
  }
  translate(value) {
    this.position = vec3.add(this.position, value);
  }
  setPosition(value) {
    this.position = value;
  }
  setRotation(angle, axis) {
    this.quaternion = quat.fromAxisAngle(axis, degToRad(angle));
  }
  scaleX(value) {
    this.scale[0] = value;
  }
  scaleY(value) {
    this.scale[1] = value;
  }
  scaleZ(value) {
    this.scale[2] = value;
  }
  scaleAll(value) {
    const [x, y, z] = value;
    this.scaleX(x);
    this.scaleY(y);
    this.scaleZ(z);
  }
}
class Camera extends Object3D {
  fov;
  aspect;
  near;
  far;
  front = vec3.create(0, 0, -1);
  up = vec3.create(0, 1, 0);
  right = vec3.create();
  constructor({ fov = 60, aspect = 1, near = 0.1, far = 1e3 } = {}) {
    super();
    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
    this.position = vec3.create(0, 0, 3);
  }
  get viewMatrix() {
    this.right = vec3.normalize(vec3.cross(this.front, this.up));
    this.up = vec3.normalize(vec3.cross(this.right, this.front));
    return mat4.lookAt(this.position, vec3.add(this.position, this.front), this.up);
  }
  get viewMatrixInverse() {
    return mat4.inverse(this.viewMatrix);
  }
  get projectionMatrix() {
    return mat4.perspective(degToRad(this.fov), this.aspect, this.near, this.far);
  }
  get projectionMatrixInverse() {
    return mat4.inverse(this.projectionMatrix);
  }
  get viewProjectionMatrix() {
    return mat4.multiply(this.projectionMatrix, this.viewMatrix);
  }
}
const LOCAL_PDB_FILES = [
  "example",
  "1jjj",
  "AF_AFB5EZH0F1",
  "MA_MACOFFESLACC104963G1I1",
  "AF-U7Q5H6-F1-model_v4",
  "AF-Q6LA55-F1-model_v4",
  "4v4l"
];
function addGeneralControls(material) {
  const controls2 = getControls();
  const molecule = controls2.addControl({
    name: "Molecule",
    type: "select",
    value: "example",
    options: [
      ...LOCAL_PDB_FILES.map((file) => {
        return {
          label: file === "example" ? "Example" : file.toUpperCase(),
          value: file
        };
      })
    ]
  });
  const showMoleculeSurface = controls2.addControl({
    name: "Show molecule surface",
    type: "checkbox",
    value: true
  });
  const showMoleculeStructure = controls2.addControl({
    name: "Show molecule structure",
    type: "checkbox",
    value: true
  });
  return {
    molecule,
    showMoleculeSurface,
    showMoleculeStructure
  };
}
function addCameraControls(camera, material) {
  const controls2 = getControls();
  const group = "Camera";
  const fov = controls2.addControl({
    name: "Field of view",
    group,
    type: "range",
    value: camera.fov,
    min: 0,
    max: 180
  });
  const near = controls2.addControl({
    name: "Near",
    group,
    type: "range",
    value: camera.near,
    min: 0,
    max: 1,
    step: 0.01
  });
  const far = controls2.addControl({
    name: "Far",
    group,
    type: "range",
    value: camera.far,
    min: 0,
    max: 1e4
  });
  const frictionCoefficient = controls2.addControl({
    name: "Friction coefficient",
    group,
    type: "range",
    value: 0.01,
    min: 0,
    max: 0.1,
    step: 1e-3
  });
  const distance = controls2.addControl({
    name: "Distance",
    group,
    type: "range",
    value: 80,
    min: 0,
    max: 400
  });
  return {
    fov,
    near,
    far,
    frictionCoefficient,
    distance
  };
}
export {
  Camera as C,
  addGeneralControls as a,
  addCameraControls as b,
  getControls as g
};
