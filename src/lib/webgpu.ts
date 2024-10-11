type InitWebGPUParmas = {
	canvas: HTMLCanvasElement;
	adapterOptions?: GPURequestAdapterOptions;
	deviceOptions?: GPUDeviceDescriptor;
};

type WebGPU = {
	ctx: GPUCanvasContext;
	adapter: GPUAdapter;
	device: GPUDevice;
};

export async function initWebGPU({
	canvas,
	adapterOptions,
	deviceOptions,
}: InitWebGPUParmas): Promise<WebGPU> {
	if (!navigator.gpu) throw new Error('WebGPU not supported');

	const ctx = canvas.getContext('webgpu');
	if (!ctx) throw new Error('Error requesting WebPU context');

	const adapter = await navigator.gpu.requestAdapter(adapterOptions);
	if (!adapter) throw new Error('Error requesting WebGPU adapter');

	const device = await adapter.requestDevice(deviceOptions);
	device.lost.then((info) => {
		console.error(`WebGPU device was lost: ${info.message}`);
	});

	const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
	ctx.configure({
		device,
		format: presentationFormat,
		alphaMode: 'opaque',
	});

	const resizeObserver = new ResizeObserver((entries) => {
		for (const entry of entries) {
			if (entry.target instanceof HTMLCanvasElement) {
				const width = entry.contentBoxSize[0].inlineSize;
				const height = entry.contentBoxSize[0].blockSize;
				canvas.width = Math.max(1, Math.min(width, device.limits.maxTextureDimension2D));
				canvas.height = Math.max(1, Math.min(height, device.limits.maxTextureDimension2D));
			}
		}
	});
	resizeObserver.observe(canvas);

	return { ctx, adapter, device };
}

export function draw(callback: (deltaTime: number) => void): void {
	let deltaTime = 0;

	const onFrame = (lastFrame: number, thisFrame: number) => {
		deltaTime = thisFrame - lastFrame;

		callback(deltaTime);

		window.requestAnimationFrame((now) => onFrame(thisFrame, now));
	};

	window.requestAnimationFrame((now) => onFrame(0, now));
}
