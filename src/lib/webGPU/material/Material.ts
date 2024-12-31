import type { UniformBuffer } from '../utils/UniformBuffer';

export type MaterialParams = {
	descriptor: GPUShaderModuleDescriptor;
	requiresModelUniforms?: boolean;
};

export abstract class Material {
	#shaderDescriptor: GPUShaderModuleDescriptor;
	#shaderModules: Map<GPUDevice, GPUShaderModule> = new Map();

	protected uniformBuffer?: UniformBuffer;

	requiresModelUniforms: boolean;

	constructor({ descriptor, requiresModelUniforms = true }: MaterialParams) {
		this.#shaderDescriptor = descriptor;
		this.requiresModelUniforms = requiresModelUniforms;
	}

	load(device: GPUDevice) {
		let shaderModule = this.#shaderModules.get(device);
		if (!shaderModule) {
			shaderModule = device.createShaderModule(this.#shaderDescriptor);
			this.#shaderModules.set(device, shaderModule);
		}

		if (this.uniformBuffer) this.uniformBuffer.write(device);

		return {
			shaderModule,
			uniformBuffer: this.uniformBuffer,
		};
	}
}
