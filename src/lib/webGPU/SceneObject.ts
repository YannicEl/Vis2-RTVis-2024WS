import type { Mat4 } from 'wgpu-matrix';
import { mat4 } from 'wgpu-matrix';
import type { Geometry } from './geometry/Geometry.js';
import { queueBufferWrite } from './helpers/webGpu.js';
import type { Material } from './material/Material.js';

export class SceneObject {
	#geometry: Geometry;
	#material: Material;

	#pipeline: GPURenderPipeline | null = null;
	#uniformBindGroup: GPUBindGroup | null = null;

	#vertexBuffer: GPUBuffer | null = null;
	#viewProjectionMatrixBuffer: GPUBuffer | null = null;
	#modelMatrixBuffer: GPUBuffer | null = null;
	#materialBuffer: GPUBuffer | null = null;

	#modelMatrix: Mat4;

	constructor(geometry: Geometry, material: Material) {
		this.#geometry = geometry;
		this.#material = material;

		// prettier-ignore
		this.#modelMatrix = mat4.identity()
	}

	load(device: GPUDevice): void {
		const { vertexShaderModule, fragmentShaderModule, materialBuffer } =
			this.#material.load(device);
		const { vertexBuffer } = this.#geometry.load(device);

		this.#vertexBuffer = vertexBuffer;
		this.#materialBuffer = materialBuffer;

		this.#viewProjectionMatrixBuffer = device.createBuffer({
			size: 4 * 16, // 4x4 matrix
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		});

		this.#modelMatrixBuffer = device.createBuffer({
			size: 4 * 16, // 4x4 matrix
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		});

		this.#pipeline = device.createRenderPipeline({
			layout: 'auto',
			vertex: {
				module: vertexShaderModule,
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
						buffer: this.#viewProjectionMatrixBuffer,
					},
				},
				{
					binding: 1,
					resource: {
						buffer: this.#modelMatrixBuffer,
					},
				},
				{
					binding: 2,
					resource: {
						buffer: this.#materialBuffer,
					},
				},
			],
		});
	}

	update(): void {
		throw new Error('Method not implemented.');
	}

	render(device: GPUDevice, encoder: GPURenderPassEncoder, viewProjectionMatrix: Mat4): void {
		if (
			!this.#pipeline ||
			!this.#uniformBindGroup ||
			!this.#vertexBuffer ||
			!this.#viewProjectionMatrixBuffer ||
			!this.#modelMatrixBuffer ||
			!this.#materialBuffer
		) {
			throw new Error('SceneObject not loaded');
		}

		queueBufferWrite(device, this.#viewProjectionMatrixBuffer, viewProjectionMatrix);
		queueBufferWrite(device, this.#modelMatrixBuffer, this.#modelMatrix);

		encoder.setPipeline(this.#pipeline);
		encoder.setBindGroup(0, this.#uniformBindGroup);
		encoder.setVertexBuffer(0, this.#vertexBuffer);
		encoder.draw(this.#geometry.vertices.length / 3);
	}

	rotateY(angle: number): void {
		this.#modelMatrix = mat4.rotateY(this.#modelMatrix, angle);
	}

	rotateX(angle: number): void {
		this.#modelMatrix = mat4.rotateX(this.#modelMatrix, angle);
	}

	moveX(distance: number): void {
		this.#modelMatrix = mat4.translate(this.#modelMatrix, [distance, 0, 0]);
	}

	setPosition(x: number, y: number, z: number): void {
		this.#modelMatrix = mat4.setTranslation(this.#modelMatrix, [x, y, z]);
	}
}
