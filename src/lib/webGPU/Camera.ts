import type { Mat4 } from 'wgpu-matrix';
import { mat4, vec3 } from 'wgpu-matrix';
import { degToRad } from './helpers/helpers.js';

export type CameraParams = {
	fov?: number;
	aspect?: number;
	near?: number;
	far?: number;
};

export class Camera {
	public fov = 60;
	public aspect = 1;
	public near = 1;
	public far = 2000;

	public position = vec3.create(0, 0, 3);
	public front = vec3.create(0, 0, -1);
	public worldUp = vec3.create(0, 1, 0);
	public right = vec3.create();
	public up = vec3.create();

	public yaw = degToRad(-90);
	public pitch = degToRad(0);

	constructor({ fov, aspect, near, far }: CameraParams = {}) {
		if (fov) this.fov = fov;
		if (aspect) this.aspect = aspect;
		if (near) this.near = near;
		if (far) this.far = far;
	}

	get viewMatrix(): Mat4 {
		vec3.normalize(
			this.front,
			vec3.create(
				Math.cos(this.yaw) * Math.cos(this.pitch),
				Math.sin(this.pitch),
				Math.sin(this.yaw) * Math.cos(this.pitch)
			)
		);

		this.right = vec3.normalize(vec3.cross(this.front, this.worldUp));
		this.up = vec3.normalize(vec3.cross(this.right, this.front));

		return mat4.lookAt(this.position, vec3.add(this.position, this.front), this.up);
	}

	get projectionMatrix(): Mat4 {
		return mat4.perspective(degToRad(this.fov), this.aspect, this.near, this.far);
	}

	get viewProjectionMatrix(): Mat4 {
		return mat4.multiply(this.projectionMatrix, this.viewMatrix);
	}
}
