import { queueBufferWrite } from '../helpers/webGpu';

type DataType = 'i32' | 'f32' | 'vec3' | 'vec4' | 'mat4';
export type UniformBufferParams<T extends string> = Record<T, DataType>;

type TypedArrayConstructor = Float32ArrayConstructor | Int32ArrayConstructor;

export const DATA_TYPE_SIZES: Record<
	DataType,
	{ size: number; type: TypedArrayConstructor; align?: number }
> = {
	f32: { size: 4, type: Float32Array },
	i32: { size: 4, type: Int32Array },
	vec3: { size: 12, align: 16, type: Float32Array },
	vec4: { size: 16, type: Float32Array },
	mat4: { size: 64, align: 16, type: Float32Array },
} as const;

export class UniformBuffer<T extends string = any> {
	descriptor: GPUBufferDescriptor;
	value: ArrayBuffer;
	buffer?: GPUBuffer;

	offsets = {} as Record<T, { type: TypedArrayConstructor; byteOffset: number; length: number }>;

	constructor(params: UniformBufferParams<T>, label?: string) {
		let currentOffset = 0;
		for (const key in params) {
			const { size, align, type } = DATA_TYPE_SIZES[params[key]];

			let padding = 0;
			if (align) {
				const modulo = currentOffset % align;
				if (modulo > 0) {
					padding = align - modulo;
				}
			}

			this.offsets[key] = {
				type,
				byteOffset: currentOffset + padding,
				length: size / 4,
			};
			currentOffset += size + padding;
		}

		this.value = new ArrayBuffer(currentOffset);

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
				const { type, byteOffset, length } = this.offsets[key];
				const view = new type(this.value, byteOffset, length);
				view.set(value);
			}
		}
	}

	load(device: GPUDevice): GPUBuffer {
		this.buffer = device.createBuffer(this.descriptor);
		return this.buffer;
	}

	write(device: GPUDevice) {
		const buffer = this.buffer ? this.buffer : this.load(device);
		queueBufferWrite(device, buffer, this.value);
	}
}
