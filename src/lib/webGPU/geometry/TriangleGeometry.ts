import { Geometry } from './Geometry';

export class TriangleGeometry extends Geometry {
	constructor() {
		// prettier-ignore
		const vertices = [
      // position
      0,  1,  0, 
      1,  -1, 0, 
      -1, -1, 0, 
    ];

		// prettier-ignore
		const indices = [
      2, 1, 0,
    ];

		super({ vertices, indices });
	}
}
