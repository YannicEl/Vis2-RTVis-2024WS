import { Geometry } from './Geometry';

export class TriangleGeometry extends Geometry {
	constructor() {
		// prettier-ignore
		const vertices = new Float32Array([
      // position
      0,  1,  0, 
      1,  -1, 0, 
      -1, -1, 0, 
    ])

		// prettier-ignore
		const indices = new Uint32Array([
      0, 1, 2,
    ]);

		super({ vertices, indices });
	}
}
