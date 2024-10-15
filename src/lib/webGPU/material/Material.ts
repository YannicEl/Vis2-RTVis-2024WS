export type MaterialParams = {
	vertexShader: string;
	fragmentShader: string;
};

export abstract class Material {
	#fragmentShader: string;
	#vertexShader: string;

	constructor({ vertexShader, fragmentShader }: MaterialParams) {
		this.#vertexShader = vertexShader;
		this.#fragmentShader = fragmentShader;
	}

	loadShader(device: GPUDevice) {
		const vertexShaderModule = device.createShaderModule({
			code: this.#vertexShader,
		});

		const fragmentShaderModule = device.createShaderModule({
			code: this.#fragmentShader,
		});

		return {
			vertexShaderModule,
			fragmentShaderModule,
		};
	}
}
