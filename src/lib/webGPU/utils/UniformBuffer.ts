import { queueBufferWrite } from '../helpers/webGpu';

type BufferSize = 'vec4' | 'mat4';
export type UniformBufferParams<T extends string> = Record<T, BufferSize>;

export class UniformBuffer<T extends string = any> {
	descriptor: GPUBufferDescriptor;
	value: Float32Array;
	buffer?: GPUBuffer;

	#offsets = {} as Record<T, number>;

	constructor(params: UniformBufferParams<T>, label?: string) {
		let bufferSize = 0;
		for (const key in params) {
			this.#offsets[key] = bufferSize;
			bufferSize += params[key] === 'vec4' ? 4 : 16;
		}

		this.value = new Float32Array(bufferSize);

		this.descriptor = {
			label,
			size: this.value.byteLength,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		};
	}

	set(values: Record<T, ArrayLike<number>>) {
		for (const key in values) {
			const value = values[key];
			console.log();
			this.value.set(value, this.#offsets[key]);
		}
	}

	load(device: GPUDevice) {
		this.buffer = device.createBuffer(this.descriptor);
	}

	write(device: GPUDevice) {
		if (!this.buffer) throw new Error('Buffer not loaded');
		queueBufferWrite(device, this.buffer, this.value);
	}
}
