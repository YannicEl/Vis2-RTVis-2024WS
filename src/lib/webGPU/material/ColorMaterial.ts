import type { CssColor } from '../color/Color';
import { Color } from '../color/Color';
import colorSchader from '../shader/color.wgsl?raw';
import { UniformBuffer } from '../utils/UniformBuffer';
import { Material } from './Material';

export class ColorMaterial extends Material {
	constructor(cssColor: CssColor) {
		const buffer = new UniformBuffer(
			{
				color: 'vec4',
			},
			'Color Material Buffer'
		);

		buffer.set({ color: Color.fromCssString(cssColor).value });

		super({
			vertexShader: {
				label: 'Color Vertex Shader',
				code: colorSchader,
			},
			fragmentShader: {
				label: 'Color Fragment Shader',
				code: colorSchader,
			},
			uniformBuffer: buffer,
		});
	}
}
