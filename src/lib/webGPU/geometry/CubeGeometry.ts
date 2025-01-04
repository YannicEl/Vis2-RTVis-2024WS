import { Geometry } from './Geometry';

export class CubeGeometry extends Geometry {
	constructor() {
		// prettier-ignore
		const vertices = [
      // TOP LEFT FRONT
      -1, 1,  1,
  
      // TOP RIGHT FRONT
      1,  1,  1,
  
      // BOTTOM RIGHT FRONT
      1,  -1, 1,
  
      // BOTTOM LEFT FRONT
      -1, -1, 1,

      // TOP LEFT BACK
      -1, 1, -1,
  
      // TOP RIGHT BACK
      1,  1,  -1,
  
      // BOTTOM RIGHT BACK
      1,  -1, -1,

      // BOTTOM LEFT BACK
      -1, -1, -1,
    ];

		// prettier-ignore
		const indices = [
      // FRONT
      0, 3, 2,
      2, 1, 0,
  
      // RIGHT
      1,  2,  6,
      6,  5,  1,
  
      // BACK
      5,  6,  7,
      7,  4,  5,
  
      // LEFT
      4,  7,  3,
      3,  0,  4,
  
      // TOP
      4,  0,  1,
      1,  5,  4,
  
      // BOTTOM
      6,  2,  3,
      3,  7,  6,
    ];

		super({ vertices, indices });
	}
}
