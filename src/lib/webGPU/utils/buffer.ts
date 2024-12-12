export type UniformBuffer = {
	descriptor: GPUBufferDescriptor;
	value: Float32Array;
};

type BufferSize = 'vec4' | 'mat4';
export type UniformBufferParams<T extends string> = Record<T, BufferSize>;

export function createUniformBuffer<T extends string>(params: UniformBufferParams<T>) {
	let bufferSize = 0;
	for (const key in params) {
		bufferSize += params[key] === 'vec4' ? 4 : 16;
	}

	const buffer: UniformBuffer = {
		descriptor: {
			size: bufferSize,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		},
		value: new Float32Array(bufferSize),
	};

	function set(values: Record<T, ArrayLike<number>>) {
		for (const key in values) {
			const value = values[key];

			let offset = 0;
			for (const key in params) {
				const value = values[key];
				if (_key === key) break;
				offset += params[_key] === 'vec4' ? 4 : 16;
			}
		}

		buffer.value.set(value, offset);
	}

	return {
		value: buffer,
		set,
	};
}
