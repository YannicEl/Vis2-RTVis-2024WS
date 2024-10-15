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

	public viewMatrix: mat4;
	public projectionMatrix: mat4;

	constructor(
		private fov = 60,
		private aspect = 1,
		private near = 1,
		private far = 2000
	) {
		this.projectionMatrix = mat4.create();
		this.viewMatrix = mat4.create();
		this.updateViewMatrix();
		this.updateProjectionMatrix();
	}

	updateViewMatrix(): void {
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

		this.viewMatrix = mat4.lookAt(
			this.viewMatrix,
			this.position,
			vec3.add(vec3.create(), this.position, this.front),
			this.up
		);
	}

	updateProjectionMatrix(): void {
		this.projectionMatrix = mat4.perspective(
			this.projectionMatrix,
			degToRad(this.fov),
			this.aspect,
			this.near,
			this.far
		);
	}
}
