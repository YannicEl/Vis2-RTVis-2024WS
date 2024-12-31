import { type Mat4, type Vec4 } from 'wgpu-matrix';
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
	projectionMatrixInverse: Mat4;
	viewMatrixInverse: Mat4;
	numberOfSteps: number;
	minimumHitDistance: number;
	maximumTraceDistance: number;
};

export class RayMarchingMaterial extends Material {
	#buffer?: UniformBuffer<keyof RayMarchingMaterialParams>;

	constructor(params: RayMarchingMaterialParams) {
		const buffer = new UniformBuffer(
			{
				fragmentColor: 'vec4',
				clearColor: 'vec4',
				cameraPosition: 'vec3',
				projectionMatrixInverse: 'mat4',
				viewMatrixInverse: 'mat4',
				aspectRatio: 'f32',
				numberOfSteps: 'i32',
				minimumHitDistance: 'f32',
				maximumTraceDistance: 'f32',
			},
			'Ray Marching Material Buffer'
		);

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
			requiresModelUniforms: false,
		});

		this.#buffer = buffer;
		this.updateBufferValues(params);
	}

	private updateBufferValues(params: Partial<RayMarchingMaterialParams>): void {
		if (!this.#buffer) return;
		Object.entries(params).forEach(([key, value]) => {
			let newValue: ArrayLike<number>;
			if (typeof value === 'string') {
				newValue = Color.fromCssString(value).value;
			} else if (typeof value === 'number') {
				newValue = [value];
			} else {
				newValue = value;
			}

			this.#buffer?.set({ [key]: newValue });
		});
	}

	update(device: GPUDevice, params: Partial<RayMarchingMaterialParams>) {
		if (!this.#buffer) return;
		this.updateBufferValues(params);

		this.#buffer.write(device);
	}
}
