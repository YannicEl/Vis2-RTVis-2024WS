import type { Mat4 } from 'wgpu-matrix';
import type { Geometry } from '../geometry/Geometry';
import type { Material } from '../material/Material';
import { Object3D } from '../Object3D';
import { Texture } from '../texture/Texture';
import { UniformBuffer } from '../utils/UniformBuffer';
import type { BaseSceneObject } from './BaseSceneObject';

export class SceneObject extends Object3D implements BaseSceneObject {
	#geometry: Geometry;
	#material: Material;
	textures?: Texture[];

	#pipeline?: GPURenderPipeline;
	#uniformBindGroup?: GPUBindGroup;

	#modelUniformBuffer?: UniformBuffer<'viewProjectionMatrix' | 'modelMatrix'>;

	constructor(geometry: Geometry, material: Material, texture?: Texture[]) {
		super();

		this.#geometry = geometry;
		this.#material = material;
		this.textures = texture;

		if (material.requiresModelUniforms) {
			this.#modelUniformBuffer = new UniformBuffer(
				{
					viewProjectionMatrix: 'mat4',
					modelMatrix: 'mat4',
				},
				'SceneObject Model Uniform Buffer'
			);
		}
	}

	async load(device: GPUDevice, { depth }: { depth?: boolean } = {}): Promise<void> {
		const { shaderModule, uniformBuffer } = this.#material.load(device);
		this.#geometry.load(device);

		this.#modelUniformBuffer?.load(device);

		const pipelineDescriptor: GPURenderPipelineDescriptor = {
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
		};

		if (depth) {
			pipelineDescriptor.depthStencil = {
				depthWriteEnabled: true,
				depthCompare: 'less',
				format: 'depth24plus',
			};
		}

		this.#pipeline = await device.createRenderPipelineAsync(pipelineDescriptor);

		const entries: GPUBindGroupEntry[] = [];

		if (this.#modelUniformBuffer?.buffer) {
			entries.push({
				binding: 0,
				resource: {
					buffer: this.#modelUniformBuffer.buffer,
				},
			});
		}

		if (uniformBuffer?.buffer) {
			entries.push({
				binding: 1,
				resource: {
					buffer: uniformBuffer.buffer,
				},
			});
		}

		if (this.textures) {
			entries.push({
				binding: 2,
				resource: device.createSampler({ magFilter: 'linear' }),
			});

			for (let i = 0; i < this.textures.length; i++) {
				entries.push({
					binding: 3 + i,
					resource: this.textures[i].createView(device),
				});
			}
		}

		const emptyBindGroupLayout = device.createBindGroupLayout({
			entries: [],
		});

		const bindGroupDescriptor: GPUBindGroupDescriptor = {
			label: 'Uniform Bind Group',
			layout: entries.length ? this.#pipeline.getBindGroupLayout(0) : emptyBindGroupLayout,
			entries,
		};

		this.#uniformBindGroup = device.createBindGroup(bindGroupDescriptor);
	}

	update(device: GPUDevice, viewProjectionMatrix?: Mat4): void {
		if (this.#modelUniformBuffer) {
			this.#modelUniformBuffer.set({
				viewProjectionMatrix: viewProjectionMatrix,
				modelMatrix: this.modelMatrix,
			});
			this.#modelUniformBuffer.write(device);
		}
	}

	render(encoder: GPURenderPassEncoder | GPURenderBundleEncoder): void {
		if (
			!this.#pipeline ||
			!this.#uniformBindGroup ||
			!this.#geometry.vertexBuffer ||
			!this.#geometry.indexBuffer
		) {
			throw new Error('SceneObject not loaded');
		}

		encoder.setPipeline(this.#pipeline);
		encoder.setBindGroup(0, this.#uniformBindGroup);
		encoder.setVertexBuffer(0, this.#geometry.vertexBuffer);
		encoder.setIndexBuffer(this.#geometry.indexBuffer, 'uint32');

		encoder.drawIndexed(this.#geometry.indices.length);
	}
}
