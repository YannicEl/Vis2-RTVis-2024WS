import type { Mat4 } from 'wgpu-matrix';
import { mat4 } from 'wgpu-matrix';
import type { Geometry } from './geometry/Geometry';
import { queueBufferWrite } from './helpers/webGpu';
import type { Material } from './material/Material';

export class SceneObject {
	#geometry: Geometry;
	#material: Material;

	#pipeline?: GPURenderPipeline;
	#uniformBindGroup?: GPUBindGroup;

	#viewProjectionMatrixBuffer?: GPUBuffer;
	#modelMatrixBuffer?: GPUBuffer;

	#modelMatrix: Mat4;

	constructor(geometry: Geometry, material: Material) {
		this.#geometry = geometry;
		this.#material = material;
		this.#modelMatrix = mat4.identity();
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

	update(): void {
		throw new Error('Method not implemented.');
	}

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
		queueBufferWrite(device, this.#modelMatrixBuffer, this.#modelMatrix);

		encoder.setPipeline(this.#pipeline);
		encoder.setBindGroup(0, this.#uniformBindGroup);
		encoder.setVertexBuffer(0, this.#geometry.vertexBuffer);
		encoder.setIndexBuffer(this.#geometry.indexBuffer, 'uint32');

		encoder.drawIndexed(this.#geometry.indices.length);
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
