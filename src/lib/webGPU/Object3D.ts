import type { Mat4, Vec3 } from 'wgpu-matrix';
import { mat4, vec3 } from 'wgpu-matrix';
import { degToRad } from './helpers/helpers';

export abstract class Object3D {
	public modelMatrix: Mat4;
	public position: Vec3;

	constructor() {
		this.modelMatrix = mat4.identity();
		this.position = vec3.create();
	}

	reset(): void {
		this.modelMatrix = mat4.identity();
	}

	rotateX(angle: number): void {
		this.modelMatrix = mat4.rotateX(this.modelMatrix, degToRad(angle));
	}

	rotateY(angle: number): void {
		this.modelMatrix = mat4.rotateY(this.modelMatrix, degToRad(angle));
	}

	rotateZ(angle: number): void {
		this.modelMatrix = mat4.rotateZ(this.modelMatrix, degToRad(angle));
	}

	moveX(distance: number): void {
		this.modelMatrix = mat4.translate(this.modelMatrix, [distance, 0, 0]);
	}

	setPosition(value: Vec3): void {
		this.position = value;
		this.modelMatrix = mat4.setTranslation(this.modelMatrix, value);
	}

	// TODO: fix, does not work as expected
	setRotation(angle: number): void {
		// this.modelMatrix = mat4.translate(this.modelMatrix, value);
		// this.modelMatrix = mat4.rotateX(this.modelMatrix, value[0]);
		// this.modelMatrix = mat4.rotateY(this.modelMatrix, value[1]);
		// this.modelMatrix = mat4.rotateZ(this.modelMatrix, value[2]);

		console.log('angle', angle);
		this.modelMatrix = mat4.rotate(this.modelMatrix, vec3.create(1, 0, 0), angle);
	}

	scaleX(value: number): void {
		this.modelMatrix = mat4.scale(this.modelMatrix, [value, 1, 1]);
	}

	scaleY(value: number): void {
		this.modelMatrix = mat4.scale(this.modelMatrix, [1, value, 1]);
	}

	scaleZ(value: number): void {
		this.modelMatrix = mat4.scale(this.modelMatrix, [1, 1, value]);
	}

	scale(value: Vec3): void {
		this.modelMatrix = mat4.scale(this.modelMatrix, value);
	}
}
