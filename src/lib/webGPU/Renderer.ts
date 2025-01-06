import type { Camera } from './Camera';
import { Color, type CssColor } from './color/Color';
import type { Scene } from './scene/Scene';
import { Texture } from './texture/Texture';

export type RendererParams = {
	context: GPUCanvasContext;
	device: GPUDevice;
	clearColor?: CssColor | Color;
};

export class Renderer {
	#context: GPUCanvasContext;
	#device: GPUDevice;
	#clearColor: Color;
	depthTexture: Texture;
	#renderBundles: WeakMap<Scene, GPURenderBundle> = new WeakMap();

	constructor({ context, device, clearColor = 'white' }: RendererParams) {
		this.#device = device;
		this.#context = context;
		this.depthTexture = new Texture({
			label: 'Depth Texture',
			size: [context.canvas.width, context.canvas.height],
			format: 'depth24plus',
			usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
		});

		const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
		context.configure({
			device,
			format: presentationFormat,
			alphaMode: 'premultiplied',
		});

		if (typeof clearColor === 'string') {
			this.#clearColor = Color.fromCssString(clearColor);
		} else {
			this.#clearColor = clearColor;
		}
	}

	onCanvasResized(width: number, height: number) {
		this.depthTexture.updateSize({ width, height });
	}

	load(scene: Scene): void {
		const bundleEncoder = this.#device.createRenderBundleEncoder({
			colorFormats: [navigator.gpu.getPreferredCanvasFormat()],
			depthStencilFormat: 'depth24plus',
		});

		scene.render(bundleEncoder);

		this.#renderBundles.set(scene, bundleEncoder.finish());
	}

	render(
		scene: Scene,
		{
			camera,
			view,
			depth = true,
		}: Partial<{ camera: Camera; view: GPUTextureView; depth: boolean }> = {}
	): void {
		scene.update(this.#device, camera);

		const commandEncoder = this.#device.createCommandEncoder();
		const renderPassDescriptor: GPURenderPassDescriptor = {
			colorAttachments: [
				{
					view: view ? view : this.#context.getCurrentTexture().createView(),
					clearValue: this.#clearColor.value,
					loadOp: 'clear',
					storeOp: 'store',
				},
			],
		};

		if (depth) {
			renderPassDescriptor.depthStencilAttachment = {
				view: this.depthTexture.createView(this.#device),
				depthClearValue: 1.0,
				depthLoadOp: 'clear',
				depthStoreOp: 'store',
			};
		}

		const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);

		const renderBundle = this.#renderBundles.get(scene);
		if (renderBundle) {
			passEncoder.executeBundles([renderBundle]);
		} else {
			scene.render(passEncoder);
		}

		passEncoder.end();
		const commandBuffer = commandEncoder.finish();
		this.#device.queue.submit([commandBuffer]);
	}
}
