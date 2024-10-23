import type { Camera } from './Camera';
import { Color, type CssColor } from './color/Color';
import type { Scene } from './Scene';

export type RendererParams = {
	context: GPUCanvasContext;
	device: GPUDevice;
	clearColor?: CssColor | Color;
};

export class Renderer {
	#context: GPUCanvasContext;
	#device: GPUDevice;
	#clearColor: Color;
	#depthTexture: GPUTexture;

	constructor({ context, device, clearColor = 'black' }: RendererParams) {
		this.#device = device;
		this.#context = context;
		this.#depthTexture = this.#device.createTexture({
			size: [context.canvas.width, context.canvas.height],
			format: 'depth24plus',
			usage: GPUTextureUsage.RENDER_ATTACHMENT,
		});

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

	onCanvasResized(width: number, height: number) {
		this.#depthTexture = this.#device.createTexture({
			size: [width, height],
			format: 'depth24plus',
			usage: GPUTextureUsage.RENDER_ATTACHMENT,
		});
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
			depthStencilAttachment: {
				view: this.#depthTexture.createView(),
				depthClearValue: 1.0,
				depthLoadOp: 'clear',
				depthStoreOp: 'store',
			},
		};

		const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);

		scene.render(this.#device, passEncoder, camera);

		passEncoder.end();

		const commandBuffer = commandEncoder.finish();
		this.#device.queue.submit([commandBuffer]);
	}
}
