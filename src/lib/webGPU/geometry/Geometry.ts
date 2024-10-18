export type GeometryParams = {
	vertices: Float32Array;
};

export abstract class Geometry {
	#vertices: Float32Array;

	constructor({ vertices }: GeometryParams) {
		this.#vertices = vertices;
	}

	load(device: GPUDevice) {
		const vertexBuffer = device.createBuffer({
			size: this.#vertices.byteLength,
			usage: GPUBufferUsage.VERTEX,
			mappedAtCreation: true,
		});
		new Float32Array(vertexBuffer.getMappedRange()).set(this.#vertices);
		vertexBuffer.unmap();

		const viewProjectionMatrixBuffer = device.createBuffer({
			size: 4 * 16, // 4x4 matrix
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		});

		return {
			vertexBuffer,
			viewProjectionMatrixBuffer,
		};
	}
}
