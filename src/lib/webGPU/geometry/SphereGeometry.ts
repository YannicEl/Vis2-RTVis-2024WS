import { Geometry } from './Geometry.js';

export class SphereGeometry extends Geometry {
	constructor(
		radius = 1,
		widthSegments = 16,
		heightSegments = 8,
		phiStart = 0,
		phiLength = Math.PI * 2,
		thetaStart = 0,
		thetaLength = Math.PI
	) {
		widthSegments = Math.max(3, Math.floor(widthSegments));
		heightSegments = Math.max(2, Math.floor(heightSegments));

		let index = 0;

		// buffers
		const vertices = new Float32Array((widthSegments + 1) * (heightSegments + 1) * 3);
		console.log(vertices.length);

		// generate sphere vertices
		for (let iy = 0; iy <= heightSegments; iy++) {
			const v = iy / heightSegments;
			for (let ix = 0; ix <= widthSegments; ix++) {
				const u = ix / widthSegments;
				const x =
					-radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
				const y = radius * Math.cos(thetaStart + v * thetaLength);
				const z =
					radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);

				vertices[index] = x;
				vertices[index + 1] = y;
				vertices[index + 2] = z;
				index += 3;

				// we do not have access to indices. we need to create the next triangle here to substitute for the index buffer
			}
		}

		console.log(vertices);

		super({ vertices });
	}
}
