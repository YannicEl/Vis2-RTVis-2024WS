export function autoResizeCanvas(canvas: HTMLCanvasElement, device?: GPUDevice): void {
	const resizeObserver = new ResizeObserver((entries) => {
		for (const entry of entries) {
			if (entry.target instanceof HTMLCanvasElement) {
				const width = entry.contentBoxSize[0].inlineSize;
				const height = entry.contentBoxSize[0].blockSize;
				const { maxTextureDimension2D = Infinity } = device?.limits ?? {};
				canvas.width = Math.max(1, Math.max(width, maxTextureDimension2D));
				canvas.height = Math.max(1, Math.min(height, maxTextureDimension2D));
			}
		}
	});
	resizeObserver.observe(canvas);
}
