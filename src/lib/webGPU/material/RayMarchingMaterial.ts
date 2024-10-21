import type { CssColor } from '../color/Color';
import { Color } from '../color/Color';
import rayMarchingShader from '../shader/ray_marching.wgsl?raw';
import type { MaterialBuffer } from './Material';
import { Material } from './Material';

export type RayMarchingMaterialParams = {
	fragmentColor: CssColor;
	clearColor: CssColor;
};

export class RayMarchingMaterial extends Material {
	constructor({ clearColor, fragmentColor }: RayMarchingMaterialParams) {
		const bufferSize = 4 * 4 + 4 * 4; // 2 x vec4

		const buffer: MaterialBuffer = {
			descriptor: {
				size: bufferSize,
				usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
			},
			value: new Float32Array(bufferSize / 4),
		};

		buffer.value.set(Color.fromCssString(clearColor).value, 0);
		buffer.value.set(Color.fromCssString(fragmentColor).value, 4);

		super({
			vertexShader: {
				label: 'Ray Marching Vertex Shader',
				code: rayMarchingShader,
			},
			fragmentShader: {
				label: 'Ray Marching Fragment Shader',
				code: rayMarchingShader,
			},
			buffer,
		});
	}
}
