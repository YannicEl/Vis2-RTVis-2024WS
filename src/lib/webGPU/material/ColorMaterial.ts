import { Color, type CssColor } from '../color/Color';
import colorSchader from '../shader/color.wgsl?raw';
import { Material } from './Material';

export class ColorMaterial extends Material {
	constructor(cssColor: CssColor) {
		const bufferDescriptor: GPUBufferDescriptor = {
			size: 4 * 16, // 4x4 matrix
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		};

		super({
			vertexShader: {
				label: 'Color Vertex Shader',
				code: colorSchader,
			},
			fragmentShader: {
				label: 'Color Fragment Shader',
				code: colorSchader,
			},
			buffer: {
				descriptor: bufferDescriptor,
				value: Color.fromCssString(cssColor).value,
			},
		});
	}
}
