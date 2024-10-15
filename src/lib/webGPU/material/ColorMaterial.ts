import fragmentShader from '../shader/color.frag.wgsl?raw';
import vertexShader from '../shader/color.vert.wgsl?raw';
import { Material } from './Material.js';

export class ColorMaterial extends Material {
	constructor(color: string) {
		super({
			vertexShader,
			fragmentShader,
		});
	}
}
