import { Geometry } from './Geometry';

export class CubeGeometry extends Geometry {
	constructor() {
		// prettier-ignore
		const vertices = new Float32Array([
      // TOP LEFT FRONT
      -1, 1,  1,
  
      // TOP RIGHT FRONT
      1,  1,  1,
  
      // BOTTOM LEFT FRONT
      -1, -1, 1,
  
      // BOTTOM RIGHT FRONT
      1,  -1, 1,
  
      // TOP LEFT BACK
      -1, 1, -1,
  
      // TOP RIGHT BACK
      1,  1,  -1,
  
      // BOTTOM LEFT BACK
      -1, -1, -1,
  
      // BOTTOM RIGHT BACK
      1,  -1, -1
    ])

		// prettier-ignore
		const indices = new Uint32Array([
      // FRONT
      0,  1,  2,
      1,  2,  3,
  
      // RIGHT
      1,  5,  3,
      5,  3,  7,
  
      // // // BACK
      5,  4,  7,
      4,  7,  6,
  
      // // // LEFT
      4,  0,  6,
      0,  6,  2,
  
      // TOP
      4,  5,  0,
      5,  0,  1,
  
      // BOTTOM
      3,  2,  7,
      2,  7,  6
    ])

		super({ vertices, indices });
	}
}
