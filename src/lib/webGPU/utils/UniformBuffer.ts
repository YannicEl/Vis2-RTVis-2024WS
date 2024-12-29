import { queueBufferWrite } from '../helpers/webGpu';

type DataType = 'f32' | 'vec3' | 'vec4' | 'mat4';
export type UniformBufferParams<T extends string> = Record<T, DataType>;

export const DATA_TYPE_SIZES: Record<DataType, { size: number; align?: number }> = {
	f32: { size: 4 },
	vec3: { size: 12, align: 16 },
	vec4: { size: 16 },
	mat4: { size: 64, align: 16 },
} as const;

export class UniformBuffer<T extends string = any> {
	descriptor: GPUBufferDescriptor;
	value: Float32Array;
	buffer?: GPUBuffer;

	offsets = {} as Record<T, number>;

	constructor(params: UniformBufferParams<T>, label?: string) {
		let currentOffset = 0;
		for (const key in params) {
			const { size, align } = DATA_TYPE_SIZES[params[key]];

			let padding = 0;
			if (align) {
				const modulo = currentOffset % align;
				if (modulo > 0) {
					padding = align - modulo;
				}
			}

			this.offsets[key] = (currentOffset + padding) / 4;
			currentOffset += size + padding;
		}

		let bufferSize = currentOffset / 4;

		// if (bufferSize * 4 < 16) bufferSize = 4;
		// if (bufferSize > 16 && bufferSize < 128) bufferSize = 128;
		this.value = new Float32Array(bufferSize);

		this.descriptor = {
			label,
			size: this.value.byteLength,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		};
	}

	set(values: Partial<Record<T, ArrayLike<number>>>) {
		for (const key in values) {
			if (!(key in this.offsets)) continue;

			const value = values[key];
			if (value) {
				this.value.set(value, this.offsets[key]);
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
