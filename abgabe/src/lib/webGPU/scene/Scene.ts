import type { Camera } from '../Camera';
import type { BaseSceneObject } from './BaseSceneObject';

export class Scene {
	children: BaseSceneObject[] = [];
	#depth: boolean;

	constructor(
		children: BaseSceneObject | BaseSceneObject[] = [],
		{ depth = true }: { depth?: boolean } = {}
	) {
		this.add(children);
		this.#depth = depth;
	}

	add(children: BaseSceneObject | BaseSceneObject[]): void {
		if (!Array.isArray(children)) children = [children];
		this.children.push(...children);
	}

	remove(child: BaseSceneObject): void {
		const index = this.children.indexOf(child);
		if (index >= 0) this.children.splice(index, 1);
	}

	async load(device: GPUDevice): Promise<void> {
		const promises: Promise<void>[] = [];
		for (const child of this.children) {
			promises.push(child.load(device, { depth: this.#depth }));
		}

		await Promise.all(promises);
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
