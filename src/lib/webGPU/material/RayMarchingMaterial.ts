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
	projectionMatrixInverse: Mat4;
	viewMatrixInverse: Mat4;
	numberOfSteps: number;
	minimumHitDistance: number;
	maximumTraceDistance: number;
	subsurfaceDepth: number;
};

export class RayMarchingMaterial extends Material {
	constructor(params: RayMarchingMaterialParams) {
		super({
			descriptor: {
				label: 'Ray Marching Shader',
				code: rayMarchingShader,
			},
			requiresModelUniforms: false,
		});

		this.uniformBuffer = new UniformBuffer(
			{
				fragmentColor: 'vec4',
				clearColor: 'vec4',
				cameraPosition: 'vec3',
				projectionMatrixInverse: 'mat4',
				viewMatrixInverse: 'mat4',
				numberOfSteps: 'i32',
				minimumHitDistance: 'f32',
				maximumTraceDistance: 'f32',
				subsurfaceDepth: 'f32',
			},
			'Ray Marching Material Buffer'
		);

		this.updateBufferValues(params);
	}

	private updateBufferValues(params: Partial<RayMarchingMaterialParams>): void {
		if (!this.uniformBuffer) return;
		Object.entries(params).forEach(([key, value]) => {
			let newValue: ArrayLike<number>;
			if (typeof value === 'string') {
				newValue = Color.fromCssString(value).value;
			} else if (typeof value === 'number') {
				newValue = [value];
			} else {
				newValue = value;
			}

			this.uniformBuffer?.set({ [key]: newValue });
		});
	}

	update(device: GPUDevice, params: Partial<RayMarchingMaterialParams>) {
		if (!this.uniformBuffer) return;

		this.updateBufferValues(params);
		this.uniformBuffer.write(device);
	}
}
