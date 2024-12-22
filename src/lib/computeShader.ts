import computeShader from './compute.wgsl?raw';
import type { SceneObject } from './webGPU/SceneObject';

export type Compute3DTextureParams = {
	device: GPUDevice;
	width: number;
	height: number;
	depth: number;
	atoms: SceneObject[];
	log?: boolean;
};

export async function compute3DTexture({
	device,
	width,
	height,
	depth,
	atoms,
	log = false,
}: Compute3DTextureParams): Promise<GPUTexture> {
	const WORKGROUP_SIZE = 64;

	const texture = device.createTexture({
		format: 'rgba8unorm',
		size: [width, height, depth],
		dimension: '3d',
		usage:
			GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_DST,
	});

	const dispatchCount: [number, number, number] = [Math.ceil(16 / WORKGROUP_SIZE), height, depth];

	const pipeline = device.createComputePipeline({
		label: 'compute pipeline',
		layout: 'auto',
		compute: {
			module: device.createShaderModule({ code: computeShader }),
			constants: {
				workgroup_size: WORKGROUP_SIZE,
			},
		},
	});

	let usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST;
	const atomsBufferData = new Float32Array(atoms.length * 4);
	for (let i = 0; i < atoms.length; i++) {
		atomsBufferData.set(atoms[i].position, i * 4);
	}

	const atomsBuffer = device.createBuffer({
		size: atomsBufferData.byteLength,
		usage,
	});
	device.queue.writeBuffer(atomsBuffer, 0, atomsBufferData);

	const bindGroup = device.createBindGroup({
		label: 'Compute Bind Group',
		layout: pipeline.getBindGroupLayout(0),
		entries: [
			{ binding: 0, resource: texture.createView() },
			{ binding: 1, resource: { buffer: atomsBuffer } },
		],
	});

	// Encode commands to do the computation
	const encoder = device.createCommandEncoder({ label: 'compute builtin encoder' });
	const pass = encoder.beginComputePass({ label: 'compute builtin pass' });

	pass.setPipeline(pipeline);
	pass.setBindGroup(0, bindGroup);
	pass.dispatchWorkgroups(...dispatchCount);
	pass.end();

	// Finish encoding and submit the commands
	const commandBuffer = encoder.finish();
	device.queue.submit([commandBuffer]);

	// if (log) {
	// 	for (let z = 0; z < depth; z++) {
	// 		const columns = [];
	// 		for (let y = 0; y < height; y++) {
	// 			let row = [];
	// 			for (let x = 0; x < width; x++) {
	// 				const pixelIndex = x + width * y + width * height * z;
	// 				row.push(textureResult[pixelIndex]);
	// 			}

	// 			columns.push(row);
	// 		}
	// 		console.table(columns);
	// 	}
	// }

	// const texture = new Texture({
	// 	data: textureResult,
	// 	descriptor: {
	// 		format: 'r8unorm',
	// 		dimension: '3d',
	// 		size: {
	// 			width: width,
	// 			height: height,
	// 			depthOrArrayLayers: depth,
	// 		},
	// 	},
	// });

	return texture;
}
