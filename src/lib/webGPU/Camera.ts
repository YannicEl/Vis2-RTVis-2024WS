import { mat4, vec3 } from 'gl-matrix';
import { degToRad } from './helpers/helpers.js';

export class Camera {
	public position = vec3.fromValues(0, 0, 3);
	public front = vec3.fromValues(0, 0, -1);
	public worldUp = vec3.fromValues(0, 1, 0);
	public right = vec3.create();
	public up = vec3.create();

	public yaw = degToRad(-90);
	public pitch = degToRad(0);

	constructor(
		private fov = 60,
		private aspect = 1,
		private near = 1,
		private far = 2000
	) {}

	get viewMatrix(): mat4 {
		vec3.normalize(
			this.front,
			vec3.fromValues(
				Math.cos(this.yaw) * Math.cos(this.pitch),
				Math.sin(this.pitch),
				Math.sin(this.yaw) * Math.cos(this.pitch)
			)
		);

		vec3.normalize(this.right, vec3.cross(vec3.create(), this.front, this.worldUp));
		vec3.normalize(this.up, vec3.cross(vec3.create(), this.right, this.front));

		return mat4.lookAt(
			mat4.create(),
			this.position,
			vec3.add(vec3.create(), this.position, this.front),
			this.up
		);
	}

	get projectionMatrix(): mat4 {
		return mat4.perspective(mat4.create(), degToRad(this.fov), this.aspect, this.near, this.far);
	}

	get viewProjectionMatrix(): mat4 {
		return mat4.multiply(mat4.create(), this.projectionMatrix, this.viewMatrix);
	}
}
