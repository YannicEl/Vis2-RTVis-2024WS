export abstract class Geometry {
	protected vertexBuffer: GPUBuffer | null = null;

	constructor() {}

	abstract load(device: GPUDevice): {
		vertexBuffer: GPUBuffer;
		viewProjectionMatrixBuffer: GPUBuffer;
	};
}
