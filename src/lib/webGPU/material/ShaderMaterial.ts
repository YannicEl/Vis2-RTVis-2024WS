import { Material } from './Material';

export class ShaderMaterial extends Material {
	constructor(shader: string) {
		super({
			vertexShader: {
				label: 'Shader Material Vertex Shader',
				code: shader,
			},
			fragmentShader: {
				label: 'Shader Material Fragment Shader',
				code: shader,
			},
		});
	}
}
