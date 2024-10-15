import type { mat4 } from 'gl-matrix';
import type { Geometry } from './geometry/Geometry.js';
import { queueBufferWrite } from './helpers/webGpu.js';
import type { Material } from './material/Material.js';

export class SceneObject {
	#geometry: Geometry;
	#material: Material;

	#vertexBuffer: GPUBuffer | null = null;
	#pipeline: GPURenderPipeline | null = null;

	#uniformBindGroup: GPUBindGroup | null = null;
	#projectionMatrixBuffer: GPUBuffer | null = null;
	#viewMatrixBuffer: GPUBuffer | null = null;

	constructor(geometry: Geometry, material: Material) {
		this.#geometry = geometry;
		this.#material = material;
	}

	load(device: GPUDevice): void {
		const { vertexShaderModule, fragmentShaderModule } = this.#material.loadShader(device);
		const { vertexBuffer, viewMatrixBuffer, projectionMatrixBuffer } = this.#geometry.load(device);

		this.#vertexBuffer = vertexBuffer;
		this.#viewMatrixBuffer = viewMatrixBuffer;
		this.#projectionMatrixBuffer = projectionMatrixBuffer;

		this.#pipeline = device.createRenderPipeline({
			layout: 'auto',
			vertex: {
				module: vertexShaderModule,
				buffers: [
					{
						arrayStride: 4 * 7,
						attributes: [
							{
								// position
								shaderLocation: 0,
								offset: 0,
								format: 'float32x3',
							},
							{
								// color
								shaderLocation: 1,
								offset: 4 * 3,
								format: 'float32x4',
							},
						],
					},
				],
			},
			fragment: {
				module: fragmentShaderModule,
				targets: [
					{
						format: navigator.gpu.getPreferredCanvasFormat(),
					},
				],
			},
			primitive: {
				topology: 'triangle-list',
			},
		});

		this.#uniformBindGroup = device.createBindGroup({
			layout: this.#pipeline.getBindGroupLayout(0),
			entries: [
				{
					binding: 0,
					resource: {
						buffer: this.#viewMatrixBuffer,
					},
				},
				{
					binding: 1,
					resource: {
						buffer: this.#projectionMatrixBuffer,
					},
				},
			],
		});
	}

	update(): void {
		throw new Error('Method not implemented.');
	}

	render(
		device: GPUDevice,
		encoder: GPURenderPassEncoder,
		projectionMatrix: mat4,
		viewMatrix: mat4
	): void {
		if (
			!this.#pipeline ||
			!this.#uniformBindGroup ||
			!this.#vertexBuffer ||
			!this.#viewMatrixBuffer ||
			!this.#projectionMatrixBuffer
		) {
			throw new Error('SceneObject not loaded');
		}

		queueBufferWrite(device, this.#viewMatrixBuffer, viewMatrix as Float32Array);
		queueBufferWrite(device, this.#projectionMatrixBuffer, projectionMatrix as Float32Array);

		encoder.setPipeline(this.#pipeline);
		encoder.setBindGroup(0, this.#uniformBindGroup);
		encoder.setVertexBuffer(0, this.#vertexBuffer);
		encoder.draw(3, 1, 0, 0);
	}
}
