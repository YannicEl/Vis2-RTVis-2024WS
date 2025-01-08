import type { CssColor } from '../color/Color';
import { Color } from '../color/Color';
import colorShader from '../shader/color.wgsl?raw';
import instancedColorShader from '../shader/instanced_color.wgsl?raw';
import { UniformBuffer } from '../utils/UniformBuffer';
import { Material } from './Material';

export class ColorMaterial extends Material {
	constructor(cssColor: CssColor, { instanced = false }: { instanced?: boolean } = {}) {
		super({
			descriptor: {
				label: 'Color Shader',
				code: instanced ? instancedColorShader : colorShader,
			},
		});

		this.uniformBuffer = new UniformBuffer(
			{
				color: 'vec4',
			},
			'Color Material Buffer'
		);

		this.uniformBuffer.set({ color: Color.fromCssString(cssColor).value });
	}
}
