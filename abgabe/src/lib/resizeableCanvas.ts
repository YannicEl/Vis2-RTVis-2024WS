export type AutoResizeCanvasParams = {
	canvas: HTMLCanvasElement;
	device: GPUDevice;
	onResize?: (canvas: HTMLCanvasElement) => void;
};

export function autoResizeCanvas({ canvas, device, onResize }: AutoResizeCanvasParams): void {
	const resizeObserver = new ResizeObserver((entries) => {
		for (const entry of entries) {
			if (entry.target instanceof HTMLCanvasElement) {
				const width = entry.contentBoxSize[0].inlineSize;
				const height = entry.contentBoxSize[0].blockSize;
				const { maxTextureDimension2D } = device.limits;
				canvas.width = Math.max(1, Math.min(width, maxTextureDimension2D));
				canvas.height = Math.max(1, Math.min(height, maxTextureDimension2D));

				onResize?.(entry.target);
			}
		}
	});

	resizeObserver.observe(canvas);
}
