import type { Camera } from './Camera';
import { SceneObject } from './SceneObject';

export class Scene {
	#children: SceneObject[] = [];

	constructor(children: SceneObject | SceneObject[] = []) {
		this.add(children);
	}

	add(children: SceneObject | SceneObject[]): void {
		if (!Array.isArray(children)) children = [children];
		this.#children.push(...children);
	}

	load(device: GPUDevice): void {
		for (const child of this.#children) {
			child.load(device);
		}
	}

	render(passEncoder: GPURenderPassEncoder | GPURenderBundleEncoder): void {
		for (const child of this.#children) {
			child.render(passEncoder);
		}
	}

	update(device: GPUDevice, camera?: Camera): void {
		const { viewProjectionMatrix } = camera ?? {};

		for (const child of this.#children) {
			child.update(device, viewProjectionMatrix);
		}
	}
}
