import fragmentShader from '../shader/ray_marching.frag.wgsl?raw';
import vertexShader from '../shader/ray_marching.vert.wgsl?raw';
import { Material } from './Material.js';

export class RayMarchingMaterial extends Material {
	constructor() {
		const bufferDescriptor: GPUBufferDescriptor = {
			size: 4 * 16, // 4x4 matrix
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		};

		super({
			vertexShader,
			fragmentShader,
			bufferDescriptor,
			bufferValue: new Float32Array(16),
		});
	}
}
