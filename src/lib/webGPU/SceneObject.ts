import type { Mat4 } from 'wgpu-matrix';
import type { Geometry } from './geometry/Geometry';
import { queueBufferWrite } from './helpers/webGpu';
import type { Material } from './material/Material';
import { Object3D } from './Object3D';

export class SceneObject extends Object3D {
	#geometry: Geometry;
	#material: Material;

	#pipeline?: GPURenderPipeline;
	#uniformBindGroup?: GPUBindGroup;

	#viewProjectionMatrixBuffer?: GPUBuffer;
	#modelMatrixBuffer?: GPUBuffer;

	constructor(geometry: Geometry, material: Material) {
		super();

		this.#geometry = geometry;
		this.#material = material;
	}

	load(device: GPUDevice): void {
		const { vertexShaderModule, fragmentShaderModule, materialBuffer } =
			this.#material.load(device);
		this.#geometry.load(device);

		this.#viewProjectionMatrixBuffer = device.createBuffer({
			label: 'View Projection Matrix Buffer',
			size: 4 * 16, // 4x4 matrix
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		});

		this.#modelMatrixBuffer = device.createBuffer({
			label: 'Model Matrix Buffer',
			size: 4 * 16, // 4x4 matrix
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		});

		this.#pipeline = device.createRenderPipeline({
			label: 'SceneObject Render Pipeline',
			layout: 'auto',
			vertex: {
				module: vertexShaderModule,
				entryPoint: 'vertex',
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
				],
			},
			fragment: {
				module: fragmentShaderModule,
				entryPoint: 'fragment',
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

		const bindGroupDescriptor = {
			label: 'Uniform Bind Group',
			layout: this.#pipeline.getBindGroupLayout(0),
			entries: [
				{
					binding: 0,
					resource: {
						buffer: this.#viewProjectionMatrixBuffer,
					},
				},
				{
					binding: 1,
					resource: {
						buffer: this.#modelMatrixBuffer,
					},
				},
			],
		} satisfies GPUBindGroupDescriptor;

		if (materialBuffer) {
			bindGroupDescriptor.entries.push({
				binding: 2,
				resource: {
					buffer: materialBuffer,
				},
			});
		}

		this.#uniformBindGroup = device.createBindGroup(bindGroupDescriptor);
	}

	update(deltaTime: number): void {}

	render(device: GPUDevice, encoder: GPURenderPassEncoder, viewProjectionMatrix: Mat4): void {
		if (
			!this.#pipeline ||
			!this.#uniformBindGroup ||
			!this.#viewProjectionMatrixBuffer ||
			!this.#modelMatrixBuffer ||
			!this.#geometry.vertexBuffer ||
			!this.#geometry.indexBuffer
		) {
			throw new Error('SceneObject not loaded');
		}

		queueBufferWrite(device, this.#viewProjectionMatrixBuffer, viewProjectionMatrix);
		queueBufferWrite(device, this.#modelMatrixBuffer, this.modelMatrix);

		encoder.setPipeline(this.#pipeline);
		encoder.setBindGroup(0, this.#uniformBindGroup);
		encoder.setVertexBuffer(0, this.#geometry.vertexBuffer);
		encoder.setIndexBuffer(this.#geometry.indexBuffer, 'uint32');

		encoder.drawIndexed(this.#geometry.indices.length);
	}
}
