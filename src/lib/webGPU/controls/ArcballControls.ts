import { mat4, vec3 } from 'wgpu-matrix';
import type { Camera } from '../Camera';

export type ArcballControlsParams = {
	camera: Camera;
	rotationSpeed?: number;
	zoomSpeed?: number;
	frictionCoefficient?: number;
};

export type Input = {
	touching: boolean;
	zoom: number;
	x: number;
	y: number;
};

// https://webgpu.github.io/webgpu-samples/?sample=cameras#camera.ts
export class ArcballControls {
	#camera: Camera;
	#input: Input = {
		touching: false,
		zoom: 0,
		x: 0,
		y: 0,
	};

	#distance = 5;
	#rotationSpeed = 0.0005;
	#zoomSpeed = 0.1;
	#angularVelocity = 0;
	#frictionCoefficient = 0.001;

	#axis = vec3.create();

	constructor({ camera }: ArcballControlsParams) {
		this.#camera = camera;

		document.onpointermove = (event) => {
			// Nicht mein code simon. Nicht böse sein bitte
			this.#input.touching = event.pointerType == 'mouse' ? (event.buttons & 1) !== 0 : true;
			if (this.#input.touching) {
				this.#input.x += event.movementX;
				this.#input.y += event.movementY;
			}
		};

		document.onwheel = (event) => {
			this.#input.zoom += Math.sign(event.deltaY);
		};
	}

	update(deltaTime: number) {
		const epsilon = 0.0000001;

		if (this.#input.touching) {
			// Currently being dragged.
			this.#angularVelocity = 0;
		} else {
			// Dampen any existing angular velocity
			this.#angularVelocity *= Math.pow(1 - this.#frictionCoefficient, deltaTime);
		}

		// Calculate the movement vector
		const movement = vec3.create();
		vec3.addScaled(movement, this.#camera.right, -this.#input.x, movement);
		vec3.addScaled(movement, this.#camera.up, this.#input.y, movement);

		// Cross the movement vector with the view direction to calculate the rotation axis x magnitude
		const crossProduct = vec3.cross(movement, this.#camera.front);

		// Calculate the magnitude of the drag
		const magnitude = vec3.len(crossProduct);

		if (magnitude > epsilon) {
			// Normalize the crossProduct to get the rotation axis
			this.#axis = vec3.scale(crossProduct, 1 / magnitude);

			// Remember the current angular velocity. This is used when the touch is released for a fling.
			this.#angularVelocity = magnitude * this.#rotationSpeed;
		}

		// The rotation around this.axis to apply to the camera matrix this update
		const rotationAngle = this.#angularVelocity * deltaTime;
		if (rotationAngle > epsilon) {
			// Rotate the matrix around axis
			// Note: The rotation is not done as a matrix-matrix multiply as the repeated multiplications
			// will quickly introduce substantial error into the matrix.
			this.#camera.front = vec3.normalize(
				vec3.transformMat4Upper3x3(this.#camera.front, mat4.rotation(this.#axis, rotationAngle))
			);
		}

		// recalculate `this.position` from `this.front` considering zoom
		if (this.#input.zoom !== 0) {
			this.#distance *= 1 + this.#input.zoom * this.#zoomSpeed;
		}

		this.#camera.position = vec3.scale(this.#camera.front, -this.#distance);

		this.#input.x = 0;
		this.#input.y = 0;
		this.#input.zoom = 0;
		this.#input.touching = false;
	}
}
