export type TextureData = BufferSource | SharedArrayBuffer;

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type TextureParams = {
	data: TextureData;
	descriptor: Optional<GPUTextureDescriptor, 'usage'>;
};

export class Texture {
	#data: TextureData;
	#width: number;
	#height?: number;
	#depthOrArrayLayers?: number;
	#descriptor: GPUTextureDescriptor;

	constructor({ data, descriptor }: TextureParams) {
		this.#data = data;

		this.#descriptor = {
			usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
			...descriptor,
		};

		if ('width' in descriptor.size) {
			this.#width = descriptor.size.width;
			this.#height = descriptor.size.height;
			this.#depthOrArrayLayers = descriptor.size.depthOrArrayLayers;
		} else {
			const [width, height, depthOrArrayLayers] = [...descriptor.size];
			this.#width = width;
			this.#height = height;
			this.#depthOrArrayLayers = depthOrArrayLayers;
		}
	}

	load(device: GPUDevice): GPUTexture {
		const texture = device.createTexture(this.#descriptor);

		device.queue.writeTexture(
			{ texture },
			this.#data,
			{ bytesPerRow: this.#width, rowsPerImage: this.#height },
			{ width: this.#width, height: this.#height, depthOrArrayLayers: this.#depthOrArrayLayers }
		);

		return texture;
	}
}
