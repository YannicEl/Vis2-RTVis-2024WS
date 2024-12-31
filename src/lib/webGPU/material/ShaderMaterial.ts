import { Material } from './Material';

export type ShaderMaterialParams = {
	requiresModelUniforms?: boolean;
};

export class ShaderMaterial extends Material {
	constructor(shader: string, { requiresModelUniforms }: ShaderMaterialParams = {}) {
		super({
			descriptor: {
				label: 'Shader Material Shader',
				code: shader,
			},
			requiresModelUniforms,
		});
	}
}
