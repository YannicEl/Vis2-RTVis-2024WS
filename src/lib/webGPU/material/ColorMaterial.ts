import type { CssColor } from '../color/Color';
import { Color } from '../color/Color';
import colorSchader from '../shader/color.wgsl?raw';
import type { MaterialBuffer } from './Material';
import { Material } from './Material';

export class ColorMaterial extends Material {
	constructor(cssColor: CssColor) {
		const buffer: MaterialBuffer = {
			descriptor: {
				size: 4 * 4, // vec3
				usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
			},
			value: Color.fromCssString(cssColor).value,
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
			buffer,
		});
	}
}
