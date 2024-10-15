import type { Camera } from './Camera.js';
import { SceneObject } from './SceneObject.js';

export class Scene {
	#children: SceneObject[];

	constructor(children: SceneObject[] = []) {
		this.#children = children;
	}

	add(child: SceneObject) {
		this.#children.push(child);
	}

	load(device: GPUDevice) {
		for (const child of this.#children) {
			child.load(device);
		}
	}

	render(device: GPUDevice, passEncoder: GPURenderPassEncoder, camera: Camera): void {
		const { viewProjectionMatrix } = camera;

		for (const child of this.#children) {
			child.render(device, passEncoder, viewProjectionMatrix);
		}
	}
}
