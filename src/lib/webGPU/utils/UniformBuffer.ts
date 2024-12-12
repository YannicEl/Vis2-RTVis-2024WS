import { queueBufferWrite } from '../helpers/webGpu';

type DataType = 'vec3' | 'vec4' | 'mat4';
export type UniformBufferParams<T extends string> = Record<T, DataType>;

export const DATA_TYPE_SIZES = {
	vec3: 3,
	vec4: 4,
	mat4: 16,
} as const;

export class UniformBuffer<T extends string = any> {
	descriptor: GPUBufferDescriptor;
	value: Float32Array;
	buffer?: GPUBuffer;

	#offsets = {} as Record<T, number>;

	constructor(params: UniformBufferParams<T>, label?: string) {
		let bufferSize = 0;
		for (const key in params) {
			this.#offsets[key] = bufferSize;
			bufferSize += DATA_TYPE_SIZES[params[key]];
		}

		this.value = new Float32Array(bufferSize);

		this.descriptor = {
			label,
			size: this.value.byteLength,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		};
	}

	set(values: Partial<Record<T, ArrayLike<number>>>) {
		for (const key in values) {
			const value = values[key];
			if (value) {
				this.value.set(value, this.#offsets[key]);
			}
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
