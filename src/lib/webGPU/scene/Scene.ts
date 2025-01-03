import type { Camera } from '../Camera';
import type { BaseSceneObject } from './BaseSceneObject';

export class Scene {
	children: BaseSceneObject[] = [];

	constructor(children: BaseSceneObject | BaseSceneObject[] = []) {
		this.add(children);
	}

	add(children: BaseSceneObject | BaseSceneObject[]): void {
		if (!Array.isArray(children)) children = [children];
		this.children.push(...children);
	}

	load(device: GPUDevice): void {
		for (const child of this.children) {
			child.load(device);
		}
	}

	render(passEncoder: GPURenderPassEncoder | GPURenderBundleEncoder): void {
		for (const child of this.children) {
			child.render(passEncoder);
		}
	}

	update(device: GPUDevice, camera?: Camera): void {
		const { viewProjectionMatrix } = camera ?? {};

		for (const child of this.children) {
			child.update(device, viewProjectionMatrix);
		}
	}
}
