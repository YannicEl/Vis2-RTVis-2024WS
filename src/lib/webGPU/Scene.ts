import type { Camera } from './Camera';
import { SceneObject } from './SceneObject';

export class Scene {
	#children: SceneObject[];

	constructor(children: SceneObject[] = []) {
		this.#children = children;
	}

	add(child: SceneObject | SceneObject[]): void {
		if (!Array.isArray(child)) child = [child];
		this.#children.push(...child);
	}

	load(device: GPUDevice): void {
		for (const child of this.#children) {
			child.load(device);
		}
	}

	render(device: GPUDevice, passEncoder: GPURenderPassEncoder, camera?: Camera): void {
		const { viewProjectionMatrix } = camera ?? {};

		for (const child of this.#children) {
			child.render(device, passEncoder, viewProjectionMatrix);
		}
	}

	update(deltaTime: number): void {
		for (const child of this.#children) {
			child.update(deltaTime);
		}
	}
}
