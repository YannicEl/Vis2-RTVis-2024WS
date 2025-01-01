import type { CssColor } from '../color/Color';
import { Color } from '../color/Color';
import colorShader from '../shader/color.wgsl?raw';
import { UniformBuffer } from '../utils/UniformBuffer';
import { Material } from './Material';

export class ColorMaterial extends Material {
	static #cache = new Map<CssColor, ColorMaterial>();

	constructor(cssColor: CssColor) {
		if (ColorMaterial.#cache.has(cssColor)) return ColorMaterial.#cache.get(cssColor)!;

		super({
			descriptor: {
				label: 'Color Shader',
				code: colorShader,
			},
		});

		this.uniformBuffer = new UniformBuffer(
			{
				color: 'vec4',
			},
			'Color Material Buffer'
		);

		this.uniformBuffer.set({ color: Color.fromCssString(cssColor).value });

		ColorMaterial.#cache.set(cssColor, this);
	}
}
