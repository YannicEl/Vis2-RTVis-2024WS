<script lang="ts">
	import { getWebGPUAdapter, getWebGPUDevice } from '$lib/webGPU/helpers/webGpu';
	import { onMount } from 'svelte';
	import { vec3 } from 'wgpu-matrix';
	import { compute3DTexture } from '$lib/computeShader';
	import { SceneObject } from '$lib/webGPU/SceneObject';
	import { ColorMaterial } from '$lib/webGPU/material/ColorMaterial';
	import { SphereGeometry } from '$lib/webGPU/geometry/SphereGeometry';

	let canvas = $state<HTMLCanvasElement>();

	onMount(async () => {
		try {
			if (!canvas) return;

			const context = canvas.getContext('webgpu');
			if (!context) return;

			console.time('Compute');

			const adapter = await getWebGPUAdapter({});

			const hasBGRA8unormStorage = adapter.features.has('bgra8unorm-storage');
			const requiredFeatures: GPUFeatureName[] = [];
			if (hasBGRA8unormStorage) {
				requiredFeatures.push('bgra8unorm-storage');
			}

			const device = await getWebGPUDevice(adapter, {
				requiredFeatures,
				requiredLimits: {
					maxBufferSize: adapter.limits.maxBufferSize,
				},
			});

			const material = new ColorMaterial('white');
			const geometry = new SphereGeometry();

			const atom1 = new SceneObject(geometry, material);
			atom1.setPosition(vec3.create(0, 0, 0));

			const atom2 = new SceneObject(geometry, material);
			atom2.setPosition(vec3.create(4, 4, 0));

			const atom3 = new SceneObject(geometry, material);
			atom3.setPosition(vec3.create(15, 15, 0));

			const atom4 = new SceneObject(geometry, material);
			atom4.setPosition(vec3.create(10, 2, 0));

			const atoms = [atom1, atom2, atom3, atom4];

			console.time();
			const texture = await compute3DTexture({
				device,
				width: 16,
				height: 16,
				depth: 1,
				atoms,
				log: false,
			});
			console.timeEnd();

			// Get a WebGPU context from the canvas and configure it
			const presentationFormat = hasBGRA8unormStorage
				? navigator.gpu.getPreferredCanvasFormat()
				: 'rgba8unorm';
			context.configure({
				device,
				format: presentationFormat,
			});

			const module = device.createShaderModule({
				label: 'our hardcoded textured quad shaders',
				code: `
      struct OurVertexShaderOutput {
        @builtin(position) position: vec4f,
        @location(0) texcoord: vec2f,
      };

      @vertex fn vs(
        @builtin(vertex_index) vertexIndex : u32
      ) -> OurVertexShaderOutput {
        let pos = array(
          vec2f(0.0, 0.0),
          vec2f(1.0, 0.0),
          vec2f(0.0, 1.0),
          vec2f(0.0, 1.0),
          vec2f(1.0, 0.0),
          vec2f(1.0, 1.0),
        );

        var vsOutput: OurVertexShaderOutput;
        let xy = pos[vertexIndex];
        vsOutput.position = vec4f((xy - 0.5) * 2, 0.0, 1.0);
        vsOutput.texcoord = vec2f(xy.x, 1.0 - xy.y);
        return vsOutput;
      }

      @group(0) @binding(0) var ourSampler: sampler;
      @group(0) @binding(1) var ourTexture: texture_3d<f32>;

      @fragment fn fs(fsInput: OurVertexShaderOutput) -> @location(0) vec4f {
        let color = textureSample(ourTexture, ourSampler, vec3f(fsInput.texcoord, 1));
        return color;
        }
    `,
			});

			const pipeline = device.createRenderPipeline({
				label: 'hardcoded textured quad pipeline',
				layout: 'auto',
				vertex: {
					module,
				},
				fragment: {
					module,
					targets: [{ format: presentationFormat }],
				},
			});

			const sampler = device.createSampler({
				magFilter: 'nearest',
			});
			const bindGroup = device.createBindGroup({
				layout: pipeline.getBindGroupLayout(0),
				entries: [
					{ binding: 0, resource: sampler },
					{ binding: 1, resource: texture.createView() },
				],
			});

			const renderPassDescriptor: GPURenderPassDescriptor = {
				label: 'our basic canvas renderPass',
				colorAttachments: [
					{
						view: context.getCurrentTexture().createView(),
						clearValue: [0, 0, 0, 1],
						loadOp: 'clear',
						storeOp: 'store',
					},
				],
			};

			const encoder = device.createCommandEncoder({
				label: 'render quad encoder',
			});
			const pass = encoder.beginRenderPass(renderPassDescriptor);
			pass.setPipeline(pipeline);
			pass.setBindGroup(0, bindGroup);
			pass.draw(6);
			pass.end();

			const commandBuffer = encoder.finish();
			device.queue.submit([commandBuffer]);
		} catch (error) {
			alert(error);
		}
	});
</script>

<canvas
	bind:this={canvas}
	width={window.innerWidth}
	height={window.innerHeight}
	class="h-full w-full"
></canvas>
