import rayMarchingShader from '../shader/ray_marching.wgsl?raw';
import { Material } from './Material';

export class RayMarchingMaterial extends Material {
	constructor() {
		super({
			vertexShader: {
				label: 'Ray Marching Vertex Shader',
				code: rayMarchingShader,
			},
			fragmentShader: {
				label: 'Ray Marching Fragment Shader',
				code: rayMarchingShader,
			},
		});
	}
}
