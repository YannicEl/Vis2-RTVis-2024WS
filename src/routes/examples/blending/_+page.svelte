<script lang="ts">
	import { onMount } from 'svelte';
	import shaderRed from './red.wgsl?raw';
	import shaderBlend from './blend.wgsl?raw';
	let canvas = $state<HTMLCanvasElement>();

	onMount(async () => {
		if (!canvas) return;

		const adapter = await navigator.gpu?.requestAdapter();
		const device = await adapter?.requestDevice();
		if (!device) {
			console.error('need a browser that supports WebGPU');
			return;
		}

		const context = canvas.getContext('webgpu');
		if (!context) return;

		console.log('we good');
		// LFG

		const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
		context.configure({
			device,
			format: presentationFormat,
			alphaMode: 'premultiplied',
		});

		const module1 = device.createShaderModule({
			code: shaderRed,
		});

		const pipeline1 = device.createRenderPipeline({
			label: 'our hardcoded red triangle pipeline',
			layout: 'auto',
			vertex: {
				entryPoint: 'vs',
				module: module1,
			},
			fragment: {
				entryPoint: 'fs',
				module: module1,
				targets: [{ format: presentationFormat }],
				blend: {
					color: {
						srcFactor: 'one',
						dstFactor: 'one-minus-src-alpha',
					},
					alpha: {
						srcFactor: 'one',
						dstFactor: 'one-minus-src-alpha',
					},
				},
			},
		});

		const renderPassDescriptor1 = {
			label: 'our basic canvas renderPass',
			colorAttachments: [
				{
					// view: <- to be filled out when we render
					clearValue: [0.3, 0.3, 0.3, 1],
					loadOp: 'clear',
					storeOp: 'store',
				},
			],
		};

		function render1() {
			// Get the current texture from the canvas context and
			// set it as the texture to render to.
			renderPassDescriptor1.colorAttachments[0].view = context.getCurrentTexture().createView();

			// make a command encoder to start encoding commands
			const encoder1 = device.createCommandEncoder({ label: 'our encoder' });

			// make a render pass encoder to encode render specific commands
			const pass1 = encoder1.beginRenderPass(renderPassDescriptor1);
			pass1.setPipeline(pipeline1);
			pass1.draw(6); // call our vertex shader 3 times
			pass1.end();

			const commandBuffer1 = encoder1.finish();
			device.queue.submit([commandBuffer1]);
		}

		render1();

		// BLEND
		const module2 = device.createShaderModule({
			code: shaderBlend,
		});

		const pipeline2 = device.createRenderPipeline({
			label: 'our hardcoded red triangle pipeline',
			layout: 'auto',
			vertex: {
				entryPoint: 'vs',
				module: module2,
			},
			fragment: {
				entryPoint: 'fs',
				module: module2,
				targets: [{ format: presentationFormat }],
				blend: {
					color: {
						srcFactor: 'one',
						dstFactor: 'one-minus-src-alpha',
					},
					alpha: {
						srcFactor: 'one',
						dstFactor: 'one-minus-src-alpha',
					},
				},
			},
		});

		const renderPassDescriptor2 = {
			label: 'our basic canvas renderPass',
			colorAttachments: [
				{
					// view: <- to be filled out when we render
					clearValue: [0.3, 0.3, 0.3, 1],
					loadOp: 'load',
					storeOp: 'store',
				},
			],
		};

		function render2() {
			// Get the current texture from the canvas context and
			// set it as the texture to render to.
			renderPassDescriptor2.colorAttachments[0].view = context.getCurrentTexture().createView();

			// make a command encoder to start encoding commands
			const encoder2 = device.createCommandEncoder({ label: 'our encoder' });

			// make a render pass encoder to encode render specific commands
			const pass2 = encoder2.beginRenderPass(renderPassDescriptor2);
			pass2.setPipeline(pipeline2);
			pass2.draw(3); // call our vertex shader 3 times
			pass2.end();

			const commandBuffer2 = encoder2.finish();
			device.queue.submit([commandBuffer2]);
		}

		render2();

		function createTextureFromSource(device, source, options = {}) {
			const texture = device.createTexture({
				format: 'rgba8unorm',
				size: [source.width, source.height],
				usage:
					GPUTextureUsage.TEXTURE_BINDING |
					GPUTextureUsage.COPY_DST |
					GPUTextureUsage.RENDER_ATTACHMENT,
			});

			device.queue.copyExternalImageToTexture(
				{ source: source },
				{ texture: texture, premultipliedAlpha: true },
				{ width: source.width, height: source.height }
			);

			return texture;
		}
	});
</script>

<canvas bind:this={canvas} class="h-full w-full"></canvas>
