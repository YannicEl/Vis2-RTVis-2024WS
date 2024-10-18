import { Color, type CssColor } from '../color/Color';
import fragmentShader from '../shader/color.frag.wgsl?raw';
import vertexShader from '../shader/color.vert.wgsl?raw';
import { Material } from './Material.js';

export class ColorMaterial extends Material {
	constructor(cssColor: CssColor) {
		const bufferDescriptor: GPUBufferDescriptor = {
			size: 4 * 16, // 4x4 matrix
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		};

		super({
			vertexShader,
			fragmentShader,
			bufferDescriptor,
			bufferValue: Color.fromCssString(cssColor).value,
		});
	}
}
