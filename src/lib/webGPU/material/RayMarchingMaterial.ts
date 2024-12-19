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
	aspectRatio: number;
	depth: number;
};

export class RayMarchingMaterial extends Material {
	#buffer?: UniformBuffer<keyof RayMarchingMaterialParams>;

	constructor({
		clearColor,
		fragmentColor,
		cameraPosition,
		aspectRatio,
		depth,
	}: RayMarchingMaterialParams) {
		const buffer = new UniformBuffer(
			{
				clearColor: 'vec4',
				fragmentColor: 'vec4',
				cameraPosition: 'vec3',
				aspectRatio: 'f32',
				depth: 'f32',
			},
			'Ray Marching Material Buffer'
		);

		buffer.set({
			clearColor: Color.fromCssString(clearColor).value,
			fragmentColor: Color.fromCssString(fragmentColor).value,
			cameraPosition,
			aspectRatio: [aspectRatio],
			depth: [depth],
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
			uniformBuffer: buffer,
		});

		this.#buffer = buffer;
	}

	update(
		device: GPUDevice,
		{
			clearColor,
			fragmentColor,
			cameraPosition,
			aspectRatio,
			depth,
		}: Partial<RayMarchingMaterialParams>
	) {
		if (this.#buffer) {
			if (clearColor) this.#buffer.set({ clearColor: Color.fromCssString(clearColor).value });
			if (fragmentColor)
				this.#buffer.set({ fragmentColor: Color.fromCssString(fragmentColor).value });
			if (cameraPosition) this.#buffer.set({ cameraPosition });
			if (aspectRatio) this.#buffer.set({ aspectRatio: [aspectRatio] });
			if (depth) this.#buffer.set({ depth: [depth] });

			this.#buffer.write(device);
		}
	}
}
