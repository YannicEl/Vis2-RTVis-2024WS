export type TextureData = BufferSource | SharedArrayBuffer;

export type TextureParams = {
	data: TextureData;
	width: number;
	height: number;
	format: GPUTextureFormat;
};

export class Texture {
	#data: TextureData;
	#width: number;
	#height: number;
	#format: GPUTextureFormat;

	constructor({ data, width, height, format }: TextureParams) {
		this.#data = data;
		this.#width = width;
		this.#height = height;
		this.#format = format;
	}

	load(device: GPUDevice): GPUTexture {
		const texture = device.createTexture({
			label: 'Texture',
			size: [this.#width, this.#height],
			format: this.#format,
			usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
		});

		device.queue.writeTexture(
			{ texture },
			this.#data,
			{ bytesPerRow: this.#width * 4 },
			{ width: this.#width, height: this.#height }
		);

		return texture;
	}
}
