export type GeometryParams = {
	vertices: Float32Array;
	indices: Uint32Array;
};

export abstract class Geometry {
	public vertices: Float32Array;
	public vertexBuffer: GPUBuffer | null = null;

	public indices: Uint32Array;
	public indexBuffer: GPUBuffer | null = null;

	constructor({ vertices, indices }: GeometryParams) {
		this.vertices = vertices;
		this.indices = indices;
	}

	load(device: GPUDevice): void {
		this.vertexBuffer = device.createBuffer({
			label: 'Vertex Buffer',
			size: this.vertices.byteLength,
			usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
		});
		device.queue.writeBuffer(this.vertexBuffer, 0, this.vertices);

		this.indexBuffer = device.createBuffer({
			label: 'Index Buffer',
			size: this.indices.byteLength,
			usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
		});
		device.queue.writeBuffer(this.indexBuffer, 0, this.indices);
	}
}
