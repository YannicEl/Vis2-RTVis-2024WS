import { Geometry } from './Geometry.js';

export class TriangleGeometry extends Geometry {
	constructor() {
		super();
	}

	load(device: GPUDevice) {
		// prettier-ignore
		const triangleVertices = new Float32Array([
        // position
        0,  1,  0, 
        1,  -1, 0, 
        -1, -1, 0, 
      ])

		const vertexBuffer = device.createBuffer({
			size: triangleVertices.byteLength,
			usage: GPUBufferUsage.VERTEX,
			mappedAtCreation: true,
		});
		new Float32Array(vertexBuffer.getMappedRange()).set(triangleVertices);
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