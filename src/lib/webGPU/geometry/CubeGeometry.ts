import { Geometry } from './Geometry.js';

export class CubeGeometry extends Geometry {
	constructor() {
		// prettier-ignore
		const vertices = new Float32Array([
      // position
      -1, 1, 1,
      1, 1, 1,
      -1, -1, 1,
      
      -1, -1, 1,
      1, -1, 1, 
      1, 1, 1,

      1, 1, 1,
      1, 1, -1,
      1, -1, 1,

      1, -1, 1,
      1, -1, -1,
      1, 1, -1,

      1, 1, -1,
      -1, 1, -1,
      1, -1, -1,
      
      1, -1, -1,
      -1, -1, -1,
      -1, 1, -1,

      -1, 1, -1,
      -1, 1, 1,
      -1, -1, -1,

      -1, -1, -1,
      -1, -1, 1,
      -1, 1, 1,


      -1, 1, -1,
      1, 1, -1,
      -1, 1, 1,

      -1, 1, 1,
      1, 1, 1,
      1, 1, -1,
      
      -1, -1, 1,
      1, -1, 1,
      -1, -1, -1,

      -1, -1, -1,
      1, -1, -1,
      1, -1, 1,
    ])

		super({ vertices });
	}
}
