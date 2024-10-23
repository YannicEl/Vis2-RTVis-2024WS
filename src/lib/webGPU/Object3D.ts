import type { Mat4, Vec3 } from 'wgpu-matrix';
import { mat4, vec3 } from 'wgpu-matrix';

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

	rotateY(angle: number): void {
		this.modelMatrix = mat4.rotateY(this.modelMatrix, angle);
	}

	rotateX(angle: number): void {
		this.modelMatrix = mat4.rotateX(this.modelMatrix, angle);
	}

	moveX(distance: number): void {
		this.modelMatrix = mat4.translate(this.modelMatrix, [distance, 0, 0]);
	}

	setPosition(value: Vec3): void {
		this.position = value;
		this.modelMatrix = mat4.setTranslation(this.modelMatrix, value);
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
