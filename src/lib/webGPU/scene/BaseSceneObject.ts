export interface BaseSceneObject {
	load(device: GPUDevice): Promise<void>;

	update(device: GPUDevice, viewProjectionMatrix?: Float32Array): void;

	render(passEncoder: GPURenderPassEncoder | GPURenderBundleEncoder): void;
}
