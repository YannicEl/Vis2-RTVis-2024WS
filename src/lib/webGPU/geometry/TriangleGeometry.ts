import { Geometry } from './Geometry.js';

export class TriangleGeometry extends Geometry {
	constructor() {
		// prettier-ignore
		const vertices = new Float32Array([
      // position
      0,  1,  0, 
      1,  -1, 0, 
      -1, -1, 0, 
    ])

		super({ vertices });
	}
}
