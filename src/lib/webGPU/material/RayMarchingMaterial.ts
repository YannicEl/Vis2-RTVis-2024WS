import { type Vec4 } from 'wgpu-matrix';
import type { CssColor } from '../color/Color';
import { Color } from '../color/Color';
import rayMarchingShader from '../shader/ray_marching.wgsl?raw';
import { UniformBuffer } from '../utils/UniformBuffer';
import { Material } from './Material';

export type RayMarchingMaterialParams = {
	fragmentColor: CssColor;
	clearColor: CssColor;
	cameraPosition: Vec4;
};

export class RayMarchingMaterial extends Material {
	#buffer?: UniformBuffer<keyof RayMarchingMaterialParams>;

	constructor({ clearColor, fragmentColor, cameraPosition }: RayMarchingMaterialParams) {
		const buffer = new UniformBuffer(
			{
				clearColor: 'vec4',
				fragmentColor: 'vec4',
				cameraPosition: 'vec4',
			},
			'Ray Marching Material Buffer'
		);

		console.log({ cameraPosition });

		buffer.set({
			clearColor: Color.fromCssString(clearColor).value,
			fragmentColor: Color.fromCssString(fragmentColor).value,
			cameraPosition: cameraPosition,
		});

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

		this.#buffer = buffer;
	}

	update(device: GPUDevice, { cameraPosition }: Partial<RayMarchingMaterialParams>) {
		if (this.#buffer) {
			console.log({ cameraPosition: cameraPosition?.toString() });
			this.#buffer.set({
				// clearColor: Color.fromCssString(params.clearColor).value,
				// fragmentColor: Color.fromCssString(params.fragmentColor).value,
				cameraPosition,
			});
			this.#buffer.write(device);
		}
	}
}
