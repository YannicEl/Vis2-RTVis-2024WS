import type { Camera } from './Camera.js';
import type { Scene } from './Scene.js';

export class Renderer {
	#ctx: GPUCanvasContext;
	#device: GPUDevice;

	constructor(canvas: HTMLCanvasElement, device: GPUDevice) {
		this.#device = device;

		const ctx = canvas.getContext('webgpu');
		if (!ctx) throw new Error('Error requesting WebPU context');
		this.#ctx = ctx;

		const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
		ctx.configure({
			device,
			format: presentationFormat,
			alphaMode: 'opaque',
		});

		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				if (entry.target instanceof HTMLCanvasElement) {
					const width = entry.contentBoxSize[0]!.inlineSize;
					const height = entry.contentBoxSize[0]!.blockSize;
					canvas.width = Math.max(1, Math.min(width, device.limits.maxTextureDimension2D));
					canvas.height = Math.max(1, Math.min(height, device.limits.maxTextureDimension2D));
				}
			}
		});
		resizeObserver.observe(canvas);
	}

	render(scene: Scene, camera: Camera): void {
		const commandEncoder = this.#device.createCommandEncoder();
		const renderPassDescriptor: GPURenderPassDescriptor = {
			colorAttachments: [
				{
					view: this.#ctx.getCurrentTexture().createView(),
					clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
					loadOp: 'clear',
					storeOp: 'store',
				},
			],
		};

		const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);

		scene.render(this.#device, passEncoder, camera);

		passEncoder.end();

		this.#device.queue.submit([commandEncoder.finish()]);
	}
}
