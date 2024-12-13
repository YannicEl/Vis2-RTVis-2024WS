import { mat4, vec3, vec4 } from 'wgpu-matrix';
import type { Camera } from '../Camera';

export type ArcballControlsParams = {
	eventSource: HTMLElement;
	camera: Camera;
	distance?: number;
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

// https://asliceofrendering.com/camera/2019/11/30/ArcballCamera/
export class ArcballControls2 {
	#camera: Camera;
	public input: Input = {
		touching: false,
		zoom: 0,
		x: 0,
		y: 0,
	};

	#distance: number;
	#rotationSpeed: number;
	#zoomSpeed: number;
	#frictionCoefficient: number;

	#angularVelocity = 0;

	#axis = vec3.create();

	constructor({
		eventSource,
		camera,
		distance = 5,
		rotationSpeed = 0.0005,
		zoomSpeed = 0.1,
		frictionCoefficient = 0.001,
	}: ArcballControlsParams) {
		this.#camera = camera;
		this.#distance = distance;
		this.#rotationSpeed = rotationSpeed;
		this.#zoomSpeed = zoomSpeed;
		this.#frictionCoefficient = frictionCoefficient;

		eventSource.onpointermove = (event) => {
			// Nicht mein code simon. Nicht böse sein bitte
			this.input.touching = event.pointerType == 'mouse' ? (event.buttons & 1) !== 0 : true;
			if (this.input.touching) {
				this.input.x += event.movementX;
				this.input.y += event.movementY;
			}
		};

		eventSource.onwheel = (event) => {
			this.input.zoom += Math.sign(event.deltaY);
		};
	}

	update(deltaTime: number) {
		let position = vec4.create(...this.#camera.position, 1);
		const pivot = vec4.create(0, 0, 0, 1);

		const epsilon = 0.01;
		const angle = {
			x: this.input.x * -epsilon,
			y: this.input.y * -epsilon,
		};

		const rotationMatrixX = mat4.rotationX(angle.y);
		position = vec4.add(vec4.transformMat4(vec4.subtract(position, pivot), rotationMatrixX), pivot);

		const rotationMatrixY = mat4.rotationY(angle.x);
		position = vec4.add(vec4.transformMat4(vec4.subtract(position, pivot), rotationMatrixY), pivot);

		// this.#camera.position = vec3.scale(this.#camera.front, -this.#distance);
		this.#camera.position = position;

		this.#camera.translate(vec3.create(0, 0, this.input.zoom * this.#zoomSpeed));

		this.input.x = 0;
		this.input.y = 0;
		this.input.zoom = 0;
		this.input.touching = false;
	}
}
