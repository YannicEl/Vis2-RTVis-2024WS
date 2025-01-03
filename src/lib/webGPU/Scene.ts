import type { Camera } from './Camera';
import type { InstancedSceneObject } from './InstancedSceneObject';
import { SceneObject } from './SceneObject';

type Child = SceneObject | InstancedSceneObject;

export class Scene {
	children: Child[] = [];

	constructor(children: Child | Child[] = []) {
		this.add(children);
	}

	add(children: Child | Child[]): void {
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
