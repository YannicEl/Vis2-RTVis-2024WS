import type { CssColor } from '../color/Color';
import { Color } from '../color/Color';
import rayMarchingShader from '../shader/ray_marching.wgsl?raw';
import type { MaterialBuffer } from './Material';
import { Material } from './Material';

export type RayMarchingMaterialParams = {
	clearColor: CssColor;
};

export class RayMarchingMaterial extends Material {
	constructor({ clearColor }: RayMarchingMaterialParams) {
		const buffer: MaterialBuffer = {
			descriptor: {
				size: 4 * 16, // 4x4 matrix
				usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
			},
			value: Color.fromCssString(clearColor).value,
		};

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
