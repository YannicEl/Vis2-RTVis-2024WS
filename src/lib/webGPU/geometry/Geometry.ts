export type GeometryParams = {
	vertices: number[];
	indices: number[];
};

export abstract class Geometry {
	public vertices: Float32Array;
	public vertexBuffer?: GPUBuffer;

	public indices: Uint32Array;
	public indexBuffer?: GPUBuffer;

	constructor({ vertices, indices }: GeometryParams) {
		this.vertices = new Float32Array(vertices);
		this.indices = new Uint32Array(indices);
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
