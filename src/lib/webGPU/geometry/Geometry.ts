export abstract class Geometry {
	#vertexBuffer: GPUBuffer | null = null;

	constructor() {}

	abstract load(device: GPUDevice): {
		vertexBuffer: GPUBuffer;
		viewMatrixBuffer: GPUBuffer;
		projectionMatrixBuffer: GPUBuffer;
	};
}
