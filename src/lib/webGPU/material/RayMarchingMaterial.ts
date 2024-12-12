import type { CssColor } from '../color/Color';
import { Color } from '../color/Color';
import { queueBufferWrite } from '../helpers/webGpu';
import rayMarchingShader from '../shader/ray_marching.wgsl?raw';
import { UniformBuffer } from '../utils/UniformBuffer';
import { Material } from './Material';

export type RayMarchingMaterialParams = {
	fragmentColor: CssColor;
	clearColor: CssColor;
};

export class RayMarchingMaterial extends Material {
	#buffer?: UniformBuffer<'clearColor' | 'fragmentColor'>;

	constructor({ clearColor, fragmentColor }: RayMarchingMaterialParams) {
		const buffer = new UniformBuffer(
			{
				clearColor: 'vec4',
				fragmentColor: 'vec4',
			},
			'Ray Marching Material Buffer'
		);

		buffer.set({
			clearColor: Color.fromCssString(clearColor).value,
			fragmentColor: Color.fromCssString(fragmentColor).value,
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

	update(device: GPUDevice, color: Color) {
		if (this.#buffer) {
			const tempBuffer = device.createBuffer(this.#buffer.descriptor);

			this.#buffer.value.set(color.value, 0);

			queueBufferWrite(device, tempBuffer, this.#buffer.value);
		}
	}
}
