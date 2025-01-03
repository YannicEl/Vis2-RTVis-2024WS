import type { Mat4 } from 'wgpu-matrix';
import type { Geometry } from './geometry/Geometry';
import type { Material } from './material/Material';
import { Object3D } from './Object3D';
import { UniformBuffer } from './utils/UniformBuffer';

export class InstancedSceneObject {
	#geometry: Geometry;
	#material: Material;

	readonly count: number;
	readonly instances: Object3D[];

	#pipeline?: GPURenderPipeline;
	#uniformBindGroup?: GPUBindGroup;

	#modelMatrixvertexBuffer?: GPUBuffer;
	#modelMatrixvertexBufferValues: Float32Array;

	#cameraUniformBuffer = new UniformBuffer(
		{
			viewProjectionMatrix: 'mat4',
		},
		'InstancedSceneObject Camera Uniform Buffer'
	);

	constructor(geometry: Geometry, material: Material, count: number) {
		this.#geometry = geometry;
		this.#material = material;
		this.count = count;

		this.instances = [];
		for (let i = 0; i < count; i++) {
			this.instances.push(new Object3D());
		}

		this.#modelMatrixvertexBufferValues = new Float32Array(this.count * 16);
	}

	getInstance(index: number): Object3D {
		return this.instances[index];
	}

	load(device: GPUDevice): void {
		const { shaderModule, uniformBuffer } = this.#material.load(device);
		this.#geometry.load(device);

		const bufferSize = this.count * 16 * 4;
		this.#modelMatrixvertexBuffer = device.createBuffer({
			label: 'Model Matrix Vertex Buffer',
			size: bufferSize,
			usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
		});
		device.queue.writeBuffer(this.#modelMatrixvertexBuffer, 0, this.#modelMatrixvertexBufferValues);

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

		const entries: GPUBindGroupEntry[] = [
			{
				binding: 0,
				resource: {
					buffer: this.#cameraUniformBuffer.load(device),
				},
			},
		];

		if (uniformBuffer?.buffer) {
			entries.push({
				binding: 1,
				resource: {
					buffer: uniformBuffer.buffer,
				},
			});
		}

		this.#uniformBindGroup = device.createBindGroup({
			label: 'Uniform Bind Group',
			layout: this.#pipeline.getBindGroupLayout(0),
			entries,
		});
	}

	update(device: GPUDevice, viewProjectionMatrix?: Mat4): void {
		if (this.#cameraUniformBuffer) {
			this.#cameraUniformBuffer.set({
				viewProjectionMatrix,
			});
			this.#cameraUniformBuffer.write(device);
		}

		if (this.#modelMatrixvertexBuffer) {
			for (let i = 0; i < this.instances.length; i++) {
				const instance = this.instances[i];
				const matrix = instance.modelMatrix;
				this.#modelMatrixvertexBufferValues.set(matrix, i * 16);
			}
			device.queue.writeBuffer(
				this.#modelMatrixvertexBuffer,
				0,
				this.#modelMatrixvertexBufferValues
			);
		}
	}

	render(encoder: GPURenderPassEncoder | GPURenderBundleEncoder): void {
		if (!this.#pipeline || !this.#geometry.indexBuffer) {
			throw new Error('SceneObject not loaded');
		}

		encoder.setPipeline(this.#pipeline);
		encoder.setBindGroup(0, this.#uniformBindGroup);
		encoder.setVertexBuffer(0, this.#geometry.vertexBuffer);
		encoder.setVertexBuffer(1, this.#modelMatrixvertexBuffer);
		encoder.setIndexBuffer(this.#geometry.indexBuffer, 'uint32');

		encoder.drawIndexed(this.#geometry.indices.length, this.count);
	}
}
