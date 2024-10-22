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
      0, 1, 2,
    ];

		super({ vertices, indices });
	}
}
