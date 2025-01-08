import { Geometry } from './Geometry';

export class QuadGeometry extends Geometry {
	constructor() {
		// prettier-ignore
		const vertices = [
      // position
      -1,  1,  0, 
      1,  1, 0, 
      1, -1, 0,
      -1, -1, 0,
    ];

		// prettier-ignore
		const indices =[
      0, 3, 2,
      2, 1, 0,
    ];

		super({ vertices, indices });
	}
}
