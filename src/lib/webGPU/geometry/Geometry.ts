export type GeometryParams = {
	vertices: Float32Array;
};

export abstract class Geometry {
	public vertices: Float32Array;

	constructor({ vertices }: GeometryParams) {
		this.vertices = vertices;
	}

	load(device: GPUDevice) {
		const vertexBuffer = device.createBuffer({
			size: this.vertices.byteLength,
			usage: GPUBufferUsage.VERTEX,
			mappedAtCreation: true,
		});
		new Float32Array(vertexBuffer.getMappedRange()).set(this.vertices);
		vertexBuffer.unmap();

		return {
			vertexBuffer,
		};
	}
}
