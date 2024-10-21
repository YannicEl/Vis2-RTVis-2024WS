import { queueBufferWrite } from '../helpers/webGpu';

export type MaterialBuffer = {
	descriptor: GPUBufferDescriptor;
	value: Float32Array;
};

export type MaterialParams = {
	vertexShader: GPUShaderModuleDescriptor;
	fragmentShader: GPUShaderModuleDescriptor;
	buffer?: MaterialBuffer;
};

export abstract class Material {
	#fragmentShader: GPUShaderModuleDescriptor;
	#vertexShader: GPUShaderModuleDescriptor;

	#buffer?: MaterialBuffer;

	constructor({ vertexShader, fragmentShader, buffer }: MaterialParams) {
		this.#vertexShader = vertexShader;
		this.#fragmentShader = fragmentShader;
		this.#buffer = buffer;
	}

	load(device: GPUDevice) {
		const vertexShaderModule = device.createShaderModule(this.#vertexShader);
		const fragmentShaderModule = device.createShaderModule(this.#fragmentShader);

		let materialBuffer: GPUBuffer | undefined;
		if (this.#buffer) {
			materialBuffer = device.createBuffer(this.#buffer.descriptor);
			queueBufferWrite(device, materialBuffer, this.#buffer.value);
		}

		return {
			vertexShaderModule,
			fragmentShaderModule,
			materialBuffer,
		};
	}
}
