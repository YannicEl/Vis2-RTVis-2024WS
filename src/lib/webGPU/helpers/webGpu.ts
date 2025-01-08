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

	const adapter = await getWebGPUAdapter(adapterOptions);

	const device = await getWebGPUDevice(
		adapter,
		typeof deviceOptions === 'function' ? deviceOptions(adapter) : deviceOptions
	);

	return { adapter, device };
}

export async function getWebGPUAdapter(
	adapterOptions?: GPURequestAdapterOptions
): Promise<GPUAdapter> {
	if (!navigator.gpu) throw new Error('WebGPU not supported');

	const adapter = await navigator.gpu.requestAdapter(adapterOptions);
	if (!adapter) throw new Error('Error requesting WebGPU adapter');

	return adapter;
}

export async function getWebGPUDevice(
	adapter: GPUAdapter,
	deviceOptions?: GPUDeviceDescriptor
): Promise<GPUDevice> {
	const device = await adapter.requestDevice(deviceOptions);
	device.lost.then((info) => {
		console.error(`WebGPU device was lost: ${info.message}`);
		alert('A WebGPU error has been encountered. Reloading the page might fix the error.');
		window.location.reload();
	});

	return device;
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

export const queueBufferWrite = (device: GPUDevice, buffer: GPUBuffer, data: ArrayBuffer): void => {
	device.queue.writeBuffer(buffer, 0, data);
};
