import type { Vec4 } from 'wgpu-matrix';
import { vec4 } from 'wgpu-matrix';

export type ColorParams =
	| [red: number, green: number, blue: number, alpha: number]
	| {
			red: number;
			green: number;
			blue: number;
			alpha: number;
	  };

export class Color {
	public value: Vec4;

	constructor(params: ColorParams) {
		if (Array.isArray(params)) {
			this.value = vec4.fromValues(...params);
		} else {
			const { red, green, blue, alpha } = params;
			this.value = vec4.fromValues(red, green, blue, alpha);
		}
	}

	static fromCssString(cssColor: string): Color {
		// TODO cache offscreen canvas
		const canvas = new OffscreenCanvas(1, 1);
		const ctx = canvas.getContext('2d', { willReadFrequently: true });
		if (!ctx) throw new Error('Could not get 2d context');

		ctx.clearRect(0, 0, 1, 1);
		ctx.fillStyle = cssColor;
		ctx.fillRect(0, 0, 1, 1);

		const [red, green, blue, alpha] = ctx.getImageData(0, 0, 1, 1).data;
		return new Color([red, green, blue, alpha]);
	}
}