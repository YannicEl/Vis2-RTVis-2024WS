<script lang="ts">
	import { onMount } from 'svelte';
	import shaderRed from './red.wgsl?raw';
	import shaderTexture from './renderTexture.wgsl?raw';

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

		const module = device.createShaderModule({
			code: shaderRed,
		});

		const pipeline = device.createRenderPipeline({
			label: 'our hardcoded red triangle pipeline',
			layout: 'auto',
			vertex: {
				entryPoint: 'vs',
				module: module,
			},
			fragment: {
				entryPoint: 'fs',
				module: module,
				targets: [{ format: presentationFormat }],
			},
		});

		const renderPassDescriptor = {
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

		const texture = device.createTexture({
			format: 'bgra8unorm',
			size: [canvas.width, canvas.height],
			usage:
				GPUTextureUsage.TEXTURE_BINDING |
				GPUTextureUsage.COPY_DST |
				GPUTextureUsage.RENDER_ATTACHMENT,
		});

		console.log('texture', texture.createView());
		console.log(
			'context.getCurrentTexture().createView()',
			context.getCurrentTexture().createView()
		);
		console.log('presentationFormat', presentationFormat);

		function render() {
			// Get the current texture from the canvas context and
			// set it as the texture to render to.
			renderPassDescriptor.colorAttachments[0].view = texture.createView();

			// make a command encoder to start encoding commands
			const encoder = device.createCommandEncoder({ label: 'our encoder' });

			// make a render pass encoder to encode render specific commands
			const pass = encoder.beginRenderPass(renderPassDescriptor);
			pass.setPipeline(pipeline);
			pass.draw(6); // call our vertex shader 3 times
			pass.end();

			const commandBuffer1 = encoder.finish();
			device.queue.submit([commandBuffer1]);
		}

		render();

		// RENDER PASS 2

		const module2 = device.createShaderModule({
			code: shaderTexture,
		});

		const pipeline2 = device.createRenderPipeline({
			label: 'our hardcoded texture render pipeline',
			layout: 'auto',
			vertex: {
				entryPoint: 'vs',
				module: module2,
			},
			fragment: {
				entryPoint: 'fs',
				module: module2,
				targets: [{ format: presentationFormat }],
			},
		});

		const sampler = device.createSampler();
		const bindGroup2 = device.createBindGroup({
			layout: pipeline2.getBindGroupLayout(0),
			entries: [
				{ binding: 0, resource: sampler },
				{ binding: 1, resource: texture.createView() },
			],
		});

		const renderPassDescriptor2 = {
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

		function render2() {
			// Get the current texture from the canvas context and
			// set it as the texture to render to.
			renderPassDescriptor2.colorAttachments[0].view = context.getCurrentTexture().createView();

			const encoder = device.createCommandEncoder({
				label: 'render quad encoder',
			});
			const pass = encoder.beginRenderPass(renderPassDescriptor2);
			pass.setPipeline(pipeline2);
			pass.setBindGroup(0, bindGroup2);
			pass.draw(6); // call our vertex shader 6 times
			pass.end();

			const commandBuffer = encoder.finish();
			device.queue.submit([commandBuffer]);
		}
	});
</script>

<canvas bind:this={canvas} class="h-full w-full"></canvas>
