<script lang="ts">
	import { draw, initWebGPU } from '$lib/webGPU/helpers/webGpu';
	import { onMount } from 'svelte';
	import { ArcballControls } from '$lib/webGPU/controls/ArcballControls';
	import { Camera } from '$lib/webGPU/Camera';
	import { globalState } from '$lib/globalState.svelte';
	import { SphereGeometry } from '$lib/webGPU/geometry/SphereGeometry';
	import { ShaderMaterial } from '$lib/webGPU/material/ShaderMaterial';
	import shader from './instance.wgsl?raw';
	import { Color, CSS_COLORS } from '$lib/webGPU/color/Color';
	import { getSettings } from '$lib/settings.svelte';
	import { UniformBuffer } from '$lib/webGPU/utils/UniformBuffer';
	import { mat4, vec3 } from 'wgpu-matrix';
	import { Texture } from '$lib/webGPU/texture/Texture';

	let canvas = $state<HTMLCanvasElement>();

	const settings = getSettings();

	const instanceCountControl = settings.addControl({
		name: 'Instance count',
		type: 'range',
		value: 100,
		min: 1,
		max: 200_000,
	});

	onMount(async () => {
		try {
			if (!canvas) return;

			const context = canvas.getContext('webgpu');
			if (!context) return;

			const camera = new Camera();

			const controls = new ArcballControls({ eventSource: canvas, camera, distance: 1 });

			const { device } = await initWebGPU();

			const geometry = new SphereGeometry({ radius: 0.1 });
			geometry.load(device);

			const material = new ShaderMaterial(shader);
			const { shaderModule } = material.load(device);

			const modelUniformBuffer = new UniformBuffer(
				{
					viewProjectionMatrix: 'mat4',
					modelMatrix: 'mat4',
					color: 'vec4',
				},
				'SceneObject Model Uniform Buffer'
			);
			modelUniformBuffer.load(device);

			const pipeline = device.createRenderPipeline({
				label: 'SceneObject Render Pipeline',
				layout: 'auto',
				vertex: {
					module: shaderModule,
					buffers: [
						{
							arrayStride: 4 * 3,
							attributes: [
								{
									// position
									shaderLocation: 0,
									offset: 0,
									format: 'float32x3',
								},
							],
						},
						{
							// modelmatrix
							stepMode: 'instance',
							arrayStride: 16 * 4,
							attributes: [
								{
									shaderLocation: 10,
									offset: 0,
									format: 'float32x4',
								},
								{
									shaderLocation: 11,
									offset: 16,
									format: 'float32x4',
								},
								{
									shaderLocation: 12,
									offset: 16 * 2,
									format: 'float32x4',
								},
								{
									shaderLocation: 13,
									offset: 16 * 3,
									format: 'float32x4',
								},
							],
						},
						{
							arrayStride: 6 * 4, // 6 floats, 4 bytes each
							stepMode: 'instance',
							attributes: [
								{ shaderLocation: 1, offset: 0, format: 'float32x4' }, // color
								{ shaderLocation: 2, offset: 16, format: 'float32x2' }, // offset
							],
						},
					],
				},
				fragment: {
					module: shaderModule,
					targets: [
						{
							format: navigator.gpu.getPreferredCanvasFormat(),
						},
					],
				},
				primitive: {
					topology: 'triangle-list',
					cullMode: 'back',
				},
				depthStencil: {
					depthWriteEnabled: true,
					depthCompare: 'less',
					format: 'depth24plus',
				},
			});

			if (!modelUniformBuffer.buffer) throw new Error('buffer not loaded');
			const uniformBindGroup = device.createBindGroup({
				label: 'Uniform Bind Group',
				layout: pipeline.getBindGroupLayout(0),
				entries: [
					{
						binding: 0,
						resource: {
							buffer: modelUniformBuffer.buffer,
						},
					},
				],
			});

			let instanceVertexBuffer = updateBuffer(instanceCountControl.value);

			function updateBuffer(instanceCount: number) {
				const bufferSize = instanceCount * 6 * 4;

				const buffer = device.createBuffer({
					label: 'vertex for objects',
					size: bufferSize,
					usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
				});

				const bufferValues = new Float32Array(bufferSize / 4);

				for (let i = 0; i < instanceCount; i++) {
					const offset = i * 6;

					bufferValues.set(Color.fromCssString(CSS_COLORS[i % CSS_COLORS.length]).value, offset);
					bufferValues.set([rand(-0.9, 0.9), rand(-0.9, 0.9)], offset + 4);
					// bufferValues.set([0, 0], offset + 4);
				}

				device.queue.writeBuffer(buffer, 0, bufferValues);

				return buffer;
			}

			let cameraMatrixBuffer = updateCameraBuffer(instanceCountControl.value);

			function updateCameraBuffer(instanceCount: number) {
				const bufferSize = 4 * 4 * 4 * instanceCount;
				const buffer = device.createBuffer({
					label: 'Camera matrix buffer',
					size: bufferSize,
					usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
				});
				const bufferValues = new Float32Array(bufferSize / 4);

				for (let i = 0; i < instanceCount; i++) {
					const offset = i * 16;

					let modelMatrix = mat4.identity();
					modelMatrix = mat4.translate(modelMatrix, vec3.create(rand(-0.9, 0.9), rand(-0.9, 0.9)));

					bufferValues.set(modelMatrix, offset);
				}

				device.queue.writeBuffer(buffer, 0, bufferValues);

				return buffer;
			}

			instanceCountControl.onChange((instanceCount) => {
				instanceVertexBuffer = updateBuffer(instanceCount);
			});

			const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
			context.configure({
				device,
				format: presentationFormat,
				alphaMode: 'premultiplied',
			});

			const depthTexture = new Texture({
				size: [context.canvas.width, context.canvas.height],
				format: 'depth24plus',
				usage: GPUTextureUsage.RENDER_ATTACHMENT,
			});

			function renderFrame() {
				const commandEncoder = device.createCommandEncoder();
				const renderPassDescriptor: GPURenderPassDescriptor = {
					colorAttachments: [
						{
							view: context!.getCurrentTexture().createView(),
							clearValue: Color.fromCssString('white').value,
							loadOp: 'clear',
							storeOp: 'store',
						},
					],
					depthStencilAttachment: {
						view: depthTexture.createView(device),
						depthClearValue: 1.0,
						depthLoadOp: 'clear',
						depthStoreOp: 'store',
					},
				};

				const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);

				passEncoder.setPipeline(pipeline);
				passEncoder.setBindGroup(0, uniformBindGroup);
				passEncoder.setVertexBuffer(0, geometry.vertexBuffer);
				passEncoder.setVertexBuffer(1, cameraMatrixBuffer);
				passEncoder.setVertexBuffer(2, instanceVertexBuffer);
				passEncoder.setIndexBuffer(geometry.indexBuffer!, 'uint32');

				passEncoder.drawIndexed(geometry.indices.length, instanceCountControl.value);

				passEncoder.end();
				const commandBuffer = commandEncoder.finish();
				device.queue.submit([commandBuffer]);
			}

			draw((deltaTime) => {
				globalState.fps = 1000 / deltaTime;

				controls.update(deltaTime);

				// cameraMatrixBuffer = updateCameraBuffer(instanceCountControl.value);

				const modelmatrix = mat4.identity();

				modelUniformBuffer.set({
					modelMatrix: modelmatrix,
					viewProjectionMatrix: camera.viewProjectionMatrix,
					color: Color.fromCssString('green').value,
				});

				modelUniformBuffer.write(device);

				renderFrame();
			});
		} catch (error) {
			alert(error);
		}
	});

	function rand(min: number, max: number): number {
		return min + Math.random() * (max - min);
	}
</script>

<canvas
	bind:this={canvas}
	width={window.innerWidth}
	height={window.innerHeight}
	class="h-full w-full"
></canvas>
