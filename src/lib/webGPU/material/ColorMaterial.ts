import fragmentShader from '../shader/color.frag.wgsl?raw';
import vertexShader from '../shader/color.vert.wgsl?raw';
import { Material } from './Material.js';

type Color = [red: number, green: number, blue: number, alpha: number];

export class ColorMaterial extends Material {
	constructor(color: Color) {
		const bufferDescriptor: GPUBufferDescriptor = {
			size: 4 * 16, // 4x4 matrix
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		};

		super({
			vertexShader,
			fragmentShader,
			bufferDescriptor,
			bufferValue: new Float32Array(color),
		});
	}
}
