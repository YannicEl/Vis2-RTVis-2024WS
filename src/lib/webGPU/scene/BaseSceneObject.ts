export interface BaseSceneObject {
	load(device: GPUDevice, params: { depth?: boolean }): Promise<void>;

	update(device: GPUDevice, viewProjectionMatrix?: Float32Array): void;

	render(passEncoder: GPURenderPassEncoder | GPURenderBundleEncoder): void;
}
