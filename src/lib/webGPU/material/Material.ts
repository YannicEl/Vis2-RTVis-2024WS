import { queueBufferWrite } from '../helpers/webGpu';

export type MaterialParams = {
	vertexShader: string;
	fragmentShader: string;
	bufferDescriptor: GPUBufferDescriptor;
	bufferValue: Float32Array;
};

export abstract class Material {
	#fragmentShader: string;
	#vertexShader: string;

	#bufferDescriptor: GPUBufferDescriptor;
	#bufferValue: Float32Array;

	constructor({ vertexShader, fragmentShader, bufferDescriptor, bufferValue }: MaterialParams) {
		this.#vertexShader = vertexShader;
		this.#fragmentShader = fragmentShader;
		this.#bufferDescriptor = bufferDescriptor;
		this.#bufferValue = bufferValue;
	}

	load(device: GPUDevice) {
		const vertexShaderModule = device.createShaderModule({
			code: this.#vertexShader,
		});

		const fragmentShaderModule = device.createShaderModule({
			code: this.#fragmentShader,
		});

		const materialBuffer = device.createBuffer(this.#bufferDescriptor);
		queueBufferWrite(device, materialBuffer, this.#bufferValue);

		return {
			vertexShaderModule,
			fragmentShaderModule,
			materialBuffer,
		};
	}
}
