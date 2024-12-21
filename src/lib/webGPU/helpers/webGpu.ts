export type InitWebGPUParmas = {
	adapterOptions?: GPURequestAdapterOptions;
	deviceOptions?: GPUDeviceDescriptor | ((adapter: GPUAdapter) => GPUDeviceDescriptor);
};

export type WebGPU = {
	adapter: GPUAdapter;
	device: GPUDevice;
};

export async function initWebGPU({
	adapterOptions,
	deviceOptions,
}: InitWebGPUParmas = {}): Promise<WebGPU> {
	if (!navigator.gpu) throw new Error('WebGPU not supported');

	const adapter = await navigator.gpu.requestAdapter(adapterOptions);
	if (!adapter) throw new Error('Error requesting WebGPU adapter');

	const device = await adapter.requestDevice(
		typeof deviceOptions === 'function' ? deviceOptions(adapter) : deviceOptions
	);
	device.lost.then((info) => {
		console.error(`WebGPU device was lost: ${info.message}`);
	});

	return { adapter, device };
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

export const queueBufferWrite = (
	device: GPUDevice,
	buffer: GPUBuffer,
	data: Float32Array
): void => {
	device.queue.writeBuffer(buffer, 0, data.buffer, data.byteOffset, data.byteLength);
};
