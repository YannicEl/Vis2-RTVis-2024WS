import type { Mat4 } from 'wgpu-matrix';
import { mat4, vec3 } from 'wgpu-matrix';
import { degToRad } from './helpers/helpers';

export type CameraParams = {
	fov?: number;
	aspect?: number;
	near?: number;
	far?: number;
};

export class Camera {
	public fov: number;
	public aspect: number;
	public near: number;
	public far: number;

	public position = vec3.create(0, 0, 3);
	public front = vec3.create(0, 0, -1);
	public up = vec3.create(0, 1, 0);
	public right = vec3.create();

	public yaw = degToRad(-90);
	public pitch = degToRad(0);

	constructor({ fov = 60, aspect = 1, near = 1, far = 2000 }: CameraParams = {}) {
		this.fov = degToRad(fov);
		this.aspect = aspect;
		this.near = near;
		this.far = far;
	}

	get viewMatrix(): Mat4 {
		// this.front = vec3.normalize(
		// 	vec3.create(
		// 		Math.cos(this.yaw) * Math.cos(this.pitch),
		// 		Math.sin(this.pitch),
		// 		Math.sin(this.yaw) * Math.cos(this.pitch)
		// 	)
		// );

		this.right = vec3.normalize(vec3.cross(this.front, this.up));
		this.up = vec3.normalize(vec3.cross(this.right, this.front));

		return mat4.lookAt(this.position, vec3.add(this.position, this.front), this.up);
	}

	get projectionMatrix(): Mat4 {
		return mat4.perspective(this.fov, this.aspect, this.near, this.far);
	}

	get viewProjectionMatrix(): Mat4 {
		return mat4.multiply(this.projectionMatrix, this.viewMatrix);
	}
}
