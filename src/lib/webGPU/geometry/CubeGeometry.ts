import { Geometry } from './Geometry';

export class CubeGeometry extends Geometry {
	constructor(width = 1, height = 1, depth = 1) {
		width /= 2;
		height /= 2;
		depth /= 2;

		// prettier-ignore
		const vertices = [
      // TOP LEFT FRONT
      -width, height,  depth,
  
      // TOP RIGHT FRONT
      width,  height,  depth,
  
      // BOTTOM RIGHT FRONT
      width,  -height, depth,
  
      // BOTTOM LEFT FRONT
      -width, -height, depth,

      // TOP LEFT BACK
      -width, height, -depth,
  
      // TOP RIGHT BACK
      width,  height,  -depth,
  
      // BOTTOM RIGHT BACK
      width,  -height, -depth,

      // BOTTOM LEFT BACK
      -width, -height, -depth,
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
