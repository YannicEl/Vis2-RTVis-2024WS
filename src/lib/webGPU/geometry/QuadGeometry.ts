import { Geometry } from './Geometry.js';

export class QuadGeometry extends Geometry {
	constructor() {
		// prettier-ignore
		const vertices = new Float32Array([
      // position
      -1,  1,  0, 
      1,  1, 0, 
      -1, -1, 0,
      
      -1, -1, 0,
      1,  1, 0,
      1, -1, 0,
    ])

		super({ vertices });
	}
}
