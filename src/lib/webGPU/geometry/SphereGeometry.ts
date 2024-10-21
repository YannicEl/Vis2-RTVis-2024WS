import { Geometry } from './Geometry.js';

export type SphereGeometryParams = {
	radius?: number;
	widthSegments?: number;
	heightSegments?: number;
	phiStart?: number;
	phiLength?: number;
	thetaStart?: number;
	thetaLength?: number;
};

export class SphereGeometry extends Geometry {
	constructor({
		radius = 1,
		widthSegments = 16,
		heightSegments = 8,
		phiStart = 0,
		phiLength = Math.PI * 2,
		thetaStart = 0,
		thetaLength = Math.PI,
	}: SphereGeometryParams = {}) {
		widthSegments = Math.max(3, Math.floor(widthSegments));
		heightSegments = Math.max(2, Math.floor(heightSegments));
		const thetaEnd = Math.min(thetaStart + thetaLength, Math.PI);

		let index = 0;
		const grid = [];

		// buffers
		const vertices = new Float32Array((widthSegments + 1) * (heightSegments + 1) * 3);
		// we do not know how many indices we will need yet
		const indicesTemp = [];

		// generate sphere vertices
		for (let iy = 0; iy <= heightSegments; iy++) {
			const verticesRow = [];
			const v = iy / heightSegments;
			for (let ix = 0; ix <= widthSegments; ix++) {
				const u = ix / widthSegments;
				const x =
					-radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
				const y = radius * Math.cos(thetaStart + v * thetaLength);
				const z =
					radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);

				vertices[index * 3] = x;
				vertices[index * 3 + 1] = y;
				vertices[index * 3 + 2] = z;

				verticesRow.push(index++);
			}

			grid.push(verticesRow);
		}

		for (let iy = 0; iy < heightSegments; iy++) {
			for (let ix = 0; ix < widthSegments; ix++) {
				const a = grid[iy][ix + 1];
				const b = grid[iy][ix];
				const c = grid[iy + 1][ix];
				const d = grid[iy + 1][ix + 1];

				if (iy !== 0 || thetaStart > 0) indicesTemp.push(a, b, d);
				if (iy !== heightSegments - 1 || thetaEnd < Math.PI) indicesTemp.push(b, c, d);
			}
		}

		const indices = new Uint32Array(indicesTemp);

		super({ vertices, indices });
	}
}
