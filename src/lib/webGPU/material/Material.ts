import type { UniformBuffer } from '../utils/UniformBuffer';

export type MaterialBuffer = {
	descriptor: GPUBufferDescriptor;
	value: Float32Array;
};

export type MaterialParams = {
	vertexShader: GPUShaderModuleDescriptor;
	fragmentShader: GPUShaderModuleDescriptor;
	uniformBuffer?: UniformBuffer;
};

export abstract class Material {
	#fragmentShader: GPUShaderModuleDescriptor;
	#vertexShader: GPUShaderModuleDescriptor;

	#uniformBuffer?: UniformBuffer;

	constructor({ vertexShader, fragmentShader, uniformBuffer }: MaterialParams) {
		this.#vertexShader = vertexShader;
		this.#fragmentShader = fragmentShader;
		this.#uniformBuffer = uniformBuffer;
	}

	load(device: GPUDevice) {
		const vertexShaderModule = device.createShaderModule(this.#vertexShader);
		const fragmentShaderModule = device.createShaderModule(this.#fragmentShader);

		if (this.#uniformBuffer) {
			this.#uniformBuffer.load(device);
			this.#uniformBuffer.write(device);
		}

		return {
			vertexShaderModule,
			fragmentShaderModule,
			uniformBuffer: this.#uniformBuffer,
		};
	}
}
