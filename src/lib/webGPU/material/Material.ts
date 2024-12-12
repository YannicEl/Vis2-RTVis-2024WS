import type { UniformBuffer } from '../utils/UniformBuffer';

export type MaterialBuffer = {
	descriptor: GPUBufferDescriptor;
	value: Float32Array;
};

export type MaterialParams = {
	vertexShader: GPUShaderModuleDescriptor;
	fragmentShader: GPUShaderModuleDescriptor;
	buffer?: UniformBuffer;
};

export abstract class Material {
	#fragmentShader: GPUShaderModuleDescriptor;
	#vertexShader: GPUShaderModuleDescriptor;

	#buffer?: UniformBuffer;

	constructor({ vertexShader, fragmentShader, buffer }: MaterialParams) {
		this.#vertexShader = vertexShader;
		this.#fragmentShader = fragmentShader;
		this.#buffer = buffer;
	}

	load(device: GPUDevice) {
		const vertexShaderModule = device.createShaderModule(this.#vertexShader);
		const fragmentShaderModule = device.createShaderModule(this.#fragmentShader);

		if (this.#buffer) {
			this.#buffer.load(device);
			this.#buffer.write(device);
		}

		return {
			vertexShaderModule,
			fragmentShaderModule,
			materialBuffer: this.#buffer,
		};
	}
}
