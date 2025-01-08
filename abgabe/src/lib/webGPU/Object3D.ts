import type { Mat4, Quat, Vec3 } from 'wgpu-matrix';
import { mat4, quat, vec3 } from 'wgpu-matrix';
import { degToRad } from './helpers/helpers';

export class Object3D {
	public position: Vec3;
	public scale: Vec3;
	public quaternion: Quat;

	constructor() {
		this.position = vec3.create();
		this.scale = vec3.create(1, 1, 1);
		this.quaternion = quat.identity();
	}

	// TODO: don't recompute matrix every time
	get modelMatrix(): Mat4 {
		let matrix = mat4.identity();
		const { axis, angle } = quat.toAxisAngle(this.quaternion);
		matrix = mat4.translate(matrix, this.position);
		matrix = mat4.rotate(matrix, axis, angle);
		matrix = mat4.scale(matrix, this.scale);
		return matrix;
	}

	reset(): void {
		this.position = vec3.create();
		this.scale = vec3.create(1, 1, 1);
		this.quaternion = quat.identity();
	}

	rotateX(angle: number): void {
		this.quaternion = quat.rotateX(this.quaternion, degToRad(angle));
	}

	rotateY(angle: number): void {
		this.quaternion = quat.rotateY(this.quaternion, degToRad(angle));
	}

	rotateZ(angle: number): void {
		this.quaternion = quat.rotateZ(this.quaternion, degToRad(angle));
	}

	translate(value: Vec3): void {
		this.position = vec3.add(this.position, value);
	}

	setPosition(value: Vec3): void {
		this.position = value;
	}

	setRotation(angle: number, axis: Vec3): void {
		this.quaternion = quat.fromAxisAngle(axis, degToRad(angle));
	}

	scaleX(value: number): void {
		this.scale[0] = value;
	}

	scaleY(value: number): void {
		this.scale[1] = value;
	}

	scaleZ(value: number): void {
		this.scale[2] = value;
	}

	scaleAll(value: Vec3): void {
		const [x, y, z] = value;
		this.scaleX(x);
		this.scaleY(y);
		this.scaleZ(z);
	}
}
