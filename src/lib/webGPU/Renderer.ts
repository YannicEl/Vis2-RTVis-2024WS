import type { Camera } from './Camera.js';
import { Color, type CssColor } from './color/Color.js';
import type { Scene } from './Scene.js';

export type RendererParams = {
	context: GPUCanvasContext;
	device: GPUDevice;
	clearColor?: CssColor | Color;
};

export class Renderer {
	#context: GPUCanvasContext;
	#device: GPUDevice;
	#clearColor: Color;

	constructor({ context, device, clearColor = 'black' }: RendererParams) {
		this.#device = device;
		this.#context = context;

		const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
		context.configure({
			device,
			format: presentationFormat,
			alphaMode: 'opaque',
		});

		if (typeof clearColor === 'string') {
			this.#clearColor = Color.fromCssString(clearColor);
		} else {
			this.#clearColor = clearColor;
		}
	}

	render(scene: Scene, camera: Camera): void {
		const commandEncoder = this.#device.createCommandEncoder();
		const renderPassDescriptor: GPURenderPassDescriptor = {
			colorAttachments: [
				{
					view: this.#context.getCurrentTexture().createView(),
					clearValue: this.#clearColor.value,
					loadOp: 'clear',
					storeOp: 'store',
				},
			],
		};

		const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);

		scene.render(this.#device, passEncoder, camera);

		passEncoder.end();

		const commandBuffer = commandEncoder.finish();
		this.#device.queue.submit([commandBuffer]);
	}
}
