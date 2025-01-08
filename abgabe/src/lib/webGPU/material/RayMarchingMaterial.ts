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
	maximumTransparencyDepth: number;
	reflectionFactor: number;
	width?: number;
	height?: number;
	depth?: number;
	subsurfaceScattering: number;
	transparency: number;
	reflections: number;
	molecularStructure: number;
	near: number;
	far: number;
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
				maximumTransparencyDepth: 'f32',
				reflectionFactor: 'f32',
				width: 'f32',
				height: 'f32',
				depth: 'f32',
				subsurfaceScattering: 'i32',
				transparency: 'i32',
				reflections: 'i32',
				molecularStructure: 'i32',
				near: 'f32',
				far: 'f32',
			},
			'Ray Marching Material Buffer'
		);

		this.updateBufferValues(params);
	}

	updateBufferValues(params: Partial<RayMarchingMaterialParams>): void {
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
