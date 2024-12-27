export type TextureData = BufferSource | SharedArrayBuffer;

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export class Texture {
	#width: number;
	#height?: number;
	#depthOrArrayLayers?: number;
	#descriptor: GPUTextureDescriptor;
	#loaded: Map<GPUDevice, GPUTexture> = new Map();

	constructor(descriptor: Optional<GPUTextureDescriptor, 'usage'>) {
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
		if (this.#loaded.has(device)) {
			return this.#loaded.get(device)!;
		}

		const texture = device.createTexture(this.#descriptor);
		this.#loaded.set(device, texture);

		return texture;
	}

	write(device: GPUDevice, data: TextureData): void {
		const texture = this.load(device);

		device.queue.writeTexture(
			{ texture },
			data,
			{ bytesPerRow: this.#width, rowsPerImage: this.#height },
			{ width: this.#width, height: this.#height, depthOrArrayLayers: this.#depthOrArrayLayers }
		);
	}

	createView(device: GPUDevice): GPUTextureView {
		const texture = this.load(device);
		return texture.createView();
	}
}
