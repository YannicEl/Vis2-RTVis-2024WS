import { Geometry } from './Geometry';

// https://github.com/mrdoob/three.js/blob/master/src/geometries/CylinderGeometry.js

export type CylinderGeometryParams = {
	radiusTop?: number;
	radiusBottom?: number;
	height?: number;
	radialSegments?: number;
	heightSegments?: number;
	openEnded?: boolean;
	thetaStart?: number;
	thetaLength?: number;
};

export class CylinderGeometry extends Geometry {
	constructor({
		radiusTop = 1,
		radiusBottom = 1,
		height = 1,
		radialSegments = 32,
		heightSegments = 1,
		openEnded = false,
		thetaStart = 0,
		thetaLength = Math.PI * 2,
	}: CylinderGeometryParams = {}) {
		radialSegments = Math.floor(radialSegments);
		heightSegments = Math.floor(heightSegments);

		// buffers
		const vertices: number[] = [];
		const indices: number[] = [];

		// helper variables
		let index = 0;
		const indexArray: number[][] = [];
		const halfHeight = height / 2;

		// generate geometry
		generateTorso();
		if (openEnded === false) {
			if (radiusTop > 0) generateCap(true);
			if (radiusBottom > 0) generateCap(false);
		}

		super({ vertices, indices });

		function generateTorso() {
			// generate vertices, normals and uvs
			for (let y = 0; y <= heightSegments; y++) {
				const indexRow = [];

				const v = y / heightSegments;

				// calculate the radius of the current row

				const radius = v * (radiusBottom - radiusTop) + radiusTop;

				for (let x = 0; x <= radialSegments; x++) {
					const u = x / radialSegments;

					const theta = u * thetaLength + thetaStart;

					const sinTheta = Math.sin(theta);
					const cosTheta = Math.cos(theta);

					// vertex
					// vertex.x = radius * sinTheta;
					// vertex.y = -v * height + halfHeight;
					// vertex.z = radius * cosTheta;
					// vertices.push(vertex.x, vertex.y, vertex.z);

					vertices[index * 3] = radius * sinTheta;
					vertices[index * 3 + 1] = -v * height + halfHeight;
					vertices[index * 3 + 2] = radius * cosTheta;

					// save index of vertex in respective row
					indexRow.push(index++);
				}

				// now save vertices of the row in our index array

				indexArray.push(indexRow);
			}

			// generate indices

			for (let x = 0; x < radialSegments; x++) {
				for (let y = 0; y < heightSegments; y++) {
					// we use the index array to access the correct indices

					const a = indexArray[y][x];
					const b = indexArray[y + 1][x];
					const c = indexArray[y + 1][x + 1];
					const d = indexArray[y][x + 1];

					// faces

					if (radiusTop > 0 || y !== 0) {
						indices.push(a, b, d);
					}

					if (radiusBottom > 0 || y !== heightSegments - 1) {
						indices.push(b, c, d);
					}
				}
			}

			// add a group to the geometry. this will ensure multi material support
		}

		function generateCap(top: boolean) {
			// save the index of the first center vertex
			const centerIndexStart = index;

			const radius = top === true ? radiusTop : radiusBottom;
			const sign = top === true ? 1 : -1;

			// first we generate the center vertex data of the cap.
			// because the geometry needs one set of uvs per face,
			// we must generate a center vertex per face/segment

			for (let x = 1; x <= radialSegments; x++) {
				// vertex
				vertices.push(0, halfHeight * sign, 0);

				// increase index
				index++;
			}

			// save the index of the last center vertex
			const centerIndexEnd = index;

			// now we generate the surrounding vertices, normals and uvs

			for (let x = 0; x <= radialSegments; x++) {
				const u = x / radialSegments;
				const theta = u * thetaLength + thetaStart;

				const cosTheta = Math.cos(theta);
				const sinTheta = Math.sin(theta);

				vertices[index * 3] = radius * sinTheta;
				vertices[index * 3 + 1] = halfHeight * sign;
				vertices[index * 3 + 2] = radius * cosTheta;

				// increase index
				index++;
			}

			// generate indices

			for (let x = 0; x < radialSegments; x++) {
				const c = centerIndexStart + x;
				const i = centerIndexEnd + x;

				if (top === true) {
					// face top
					indices.push(i, i + 1, c);
				} else {
					// face bottom
					indices.push(i + 1, i, c);
				}
			}
		}
	}
}
