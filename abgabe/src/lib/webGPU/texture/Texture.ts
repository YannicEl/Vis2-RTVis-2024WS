export type TextureData = BufferSource | SharedArrayBuffer;

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export class Texture {
	#width: number;
	#height?: number;
	#depthOrArrayLayers?: number;
	descriptor: GPUTextureDescriptor;
	#loaded: WeakMap<GPUDevice, GPUTexture> = new WeakMap();
	#views: WeakMap<GPUDevice, GPUTextureView> = new WeakMap();

	constructor(descriptor: Optional<GPUTextureDescriptor, 'usage'>) {
		this.descriptor = {
			usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
			...descriptor,
		};

		const { width, height, depthOrArrayLayers } = this.getDimension(this.descriptor.size);
		this.#width = width;
		this.#height = height;
		this.#depthOrArrayLayers = depthOrArrayLayers;
	}

	load(device: GPUDevice): GPUTexture {
		let texture = this.#loaded.get(device);
		if (!texture) {
			texture = device.createTexture(this.descriptor);
			this.#loaded.set(device, texture);
		}

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
		let view = this.#views.get(device);
		if (!view) {
			view = texture.createView();
			this.#views.set(device, view);
		}
		return view;
	}

	updateSize(size: GPUExtent3DStrict): void {
		this.descriptor.size = size;

		const { width, height, depthOrArrayLayers } = this.getDimension(this.descriptor.size);
		this.#width = width;
		this.#height = height;
		this.#depthOrArrayLayers = depthOrArrayLayers;

		this.#loaded = new WeakMap();
		this.#views = new WeakMap();
	}

	private getDimension(size: GPUExtent3DStrict): {
		width: number;
		height?: number;
		depthOrArrayLayers?: number;
	} {
		if ('width' in size) {
			const { width, height, depthOrArrayLayers } = size;
			return { width, height, depthOrArrayLayers };
		} else {
			const [width, height, depthOrArrayLayers] = [...size];
			return { width, height, depthOrArrayLayers };
		}
	}
}
