import type { CssColor } from '../color/Color';
import { Color } from '../color/Color';
import rayMarchingShader from '../shader/ray_marching.wgsl?raw';
import { createUniformBuffer } from '../utils/buffer';
import { Material } from './Material';

export type RayMarchingMaterialParams = {
	fragmentColor: CssColor;
	clearColor: CssColor;
};

export class RayMarchingMaterial extends Material {
	constructor({ clearColor, fragmentColor }: RayMarchingMaterialParams) {
		const buffer = createUniformBuffer({
			clearColor: 'vec4',
			fragmentColor: 'vec4',
		});

		buffer.set('fragmentColor', Color.fromCssString(fragmentColor).value);
		buffer.set('clearColor', Color.fromCssString(clearColor).value);

		super({
			vertexShader: {
				label: 'Ray Marching Vertex Shader',
				code: rayMarchingShader,
			},
			fragmentShader: {
				label: 'Ray Marching Fragment Shader',
				code: rayMarchingShader,
			},
			buffer: buffer.value,
		});
	}
}
