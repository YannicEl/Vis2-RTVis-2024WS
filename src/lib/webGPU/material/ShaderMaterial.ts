import { Material } from './Material';

export type ShaderMaterialParams = {
	requiresModelUniforms?: boolean;
};

export class ShaderMaterial extends Material {
	constructor(shader: string, { requiresModelUniforms }: ShaderMaterialParams = {}) {
		super({
			vertexShader: {
				label: 'Shader Material Vertex Shader',
				code: shader,
			},
			fragmentShader: {
				label: 'Shader Material Fragment Shader',
				code: shader,
			},
			requiresModelUniforms,
		});
	}
}