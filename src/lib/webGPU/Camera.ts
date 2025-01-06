import type { Mat4 } from 'wgpu-matrix';
import { mat4, vec3 } from 'wgpu-matrix';
import { degToRad } from './helpers/helpers';
import { Object3D } from './Object3D';

export type CameraParams = {
	fov?: number;
	aspect?: number;
	near?: number;
	far?: number;
};

export class Camera extends Object3D {
	public fov: number;
	public aspect: number;
	public near: number;
	public far: number;

	public front = vec3.create(0, 0, -1);
	public up = vec3.create(0, 1, 0);
	public right = vec3.create();

	constructor({ fov = 60, aspect = 1, near = 1, far = 100 }: CameraParams = {}) {
		super();

		this.fov = fov;
		this.aspect = aspect;
		this.near = near;
		this.far = far;
		this.position = vec3.create(0, 0, 3);
	}

	get viewMatrix(): Mat4 {
		this.right = vec3.normalize(vec3.cross(this.front, this.up));
		this.up = vec3.normalize(vec3.cross(this.right, this.front));

		return mat4.lookAt(this.position, vec3.add(this.position, this.front), this.up);
	}

	get viewMatrixInverse(): Mat4 {
		return mat4.inverse(this.viewMatrix);
	}

	get projectionMatrix(): Mat4 {
		return mat4.perspective(degToRad(this.fov), this.aspect, this.near, this.far);
	}

	get projectionMatrixInverse(): Mat4 {
		return mat4.inverse(this.projectionMatrix);
	}

	get viewProjectionMatrix(): Mat4 {
		return mat4.multiply(this.projectionMatrix, this.viewMatrix);
	}
}
