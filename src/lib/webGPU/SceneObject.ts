import type { Mat4 } from 'wgpu-matrix';
import type { Geometry } from './geometry/Geometry';
import type { Material } from './material/Material';
import { Object3D } from './Object3D';
import { Texture } from './texture/Texture';
import { UniformBuffer } from './utils/UniformBuffer';

export class SceneObject extends Object3D {
	#geometry: Geometry;
	#material: Material;
	#texture?: Texture;

	#pipeline?: GPURenderPipeline;
	#uniformBindGroup?: GPUBindGroup;

	#vertexUniformBuffer: UniformBuffer<'viewProjectionMatrix' | 'modelMatrix'>;

	constructor(geometry: Geometry, material: Material, texture?: Texture) {
		super();

		this.#geometry = geometry;
		this.#material = material;
		this.#texture = texture;
		this.#vertexUniformBuffer = new UniformBuffer(
			{
				viewProjectionMatrix: 'mat4',
				modelMatrix: 'mat4',
			},
			'SceneObject Vertex Uniform Buffer'
		);
	}

	load(device: GPUDevice): void {
		const { vertexShaderModule, fragmentShaderModule, uniformBuffer } = this.#material.load(device);
		this.#geometry.load(device);

		this.#vertexUniformBuffer.load(device);

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
						buffer: this.#vertexUniformBuffer.buffer!,
					},
				},
			],
		} satisfies GPUBindGroupDescriptor;

		if (uniformBuffer?.buffer) {
			bindGroupDescriptor.entries.push({
				binding: 1,
				resource: {
					buffer: uniformBuffer.buffer,
				},
			});
		}

		if (this.#texture) {
			const gpuTexture = this.#texture.load(device);

			bindGroupDescriptor.entries.push({
				binding: 2,
				resource: gpuTexture.createView(),
			});
			bindGroupDescriptor.entries.push({
				binding: 3,
				resource: device.createSampler(),
			});
		}

		this.#uniformBindGroup = device.createBindGroup(bindGroupDescriptor);
	}

	update(deltaTime: number): void {}

	render(device: GPUDevice, encoder: GPURenderPassEncoder, viewProjectionMatrix: Mat4): void {
		if (
			!this.#pipeline ||
			!this.#uniformBindGroup ||
			!this.#vertexUniformBuffer ||
			!this.#geometry.vertexBuffer ||
			!this.#geometry.indexBuffer
		) {
			throw new Error('SceneObject not loaded');
		}

		this.#vertexUniformBuffer.set({
			viewProjectionMatrix: viewProjectionMatrix,
			modelMatrix: this.modelMatrix,
		});
		this.#vertexUniformBuffer.write(device);

		encoder.setPipeline(this.#pipeline);
		encoder.setBindGroup(0, this.#uniformBindGroup);
		encoder.setVertexBuffer(0, this.#geometry.vertexBuffer);
		encoder.setIndexBuffer(this.#geometry.indexBuffer, 'uint32');

		encoder.drawIndexed(this.#geometry.indices.length);
	}
}
