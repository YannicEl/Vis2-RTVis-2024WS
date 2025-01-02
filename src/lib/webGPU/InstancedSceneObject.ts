import type { Mat4 } from 'wgpu-matrix';
import type { Geometry } from './geometry/Geometry';
import type { Material } from './material/Material';
import { UniformBuffer } from './utils/UniformBuffer';

export class InstancedSceneObject {
	#geometry: Geometry;
	#material: Material;
	#count: number;

	#pipeline?: GPURenderPipeline;
	#uniformBindGroup?: GPUBindGroup;

	#modelMatrixvertexBuffer?: GPUBuffer;
	#cameraUniformBuffer = new UniformBuffer({
		viewProjectionMatrix: 'mat4',
	});

	constructor(geometry: Geometry, material: Material, count: number) {
		this.#geometry = geometry;
		this.#material = material;
		this.#count = count;
	}

	load(device: GPUDevice): void {
		const { shaderModule } = this.#material.load(device);
		this.#geometry.load(device);

		this.#pipeline = device.createRenderPipeline({
			label: 'InstancedSceneObject Render Pipeline',
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

		this.#uniformBindGroup = device.createBindGroup({
			label: 'Uniform Bind Group',
			layout: this.#pipeline.getBindGroupLayout(0),
			entries: [
				{
					binding: 0,
					resource: {
						buffer: this.#cameraUniformBuffer.load(device),
					},
				},
			],
		});
	}

	update(device: GPUDevice, viewProjectionMatrix?: Mat4): void {
		if (this.#cameraUniformBuffer) {
			this.#cameraUniformBuffer.set({
				viewProjectionMatrix,
			});
			this.#cameraUniformBuffer.write(device);
		}
	}

	render(encoder: GPURenderPassEncoder | GPURenderBundleEncoder): void {
		if (!this.#pipeline || !this.#geometry.indexBuffer || !this.#vertexBuffer) {
			throw new Error('SceneObject not loaded');
		}

		encoder.setPipeline(this.#pipeline);
		encoder.setBindGroup(0, this.#uniformBindGroup);
		encoder.setVertexBuffer(0, this.#geometry.vertexBuffer);
		encoder.setVertexBuffer(1, instanceVertexBuffer);
		encoder.setIndexBuffer(this.#geometry.indexBuffer, 'uint32');

		encoder.drawIndexed(this.#geometry.indices.length, this.#count);
	}
}
