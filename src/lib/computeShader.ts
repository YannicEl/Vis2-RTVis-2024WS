import computeShader from './compute.wgsl?raw';
import type { SceneObject } from './webGPU/SceneObject';

export type Compute3DTextureParams = {
	device: GPUDevice;
	width: number;
	height: number;
	depth: number;
	radius?: number;
	scale?: number;
	atoms: SceneObject[];
	log?: boolean;
};

export async function compute3DTexture({
	device,
	width,
	height,
	depth,
	radius = 1,
	scale = 1,
	atoms,
	log = false,
}: Compute3DTextureParams): Promise<GPUTexture> {
	width = Math.ceil(width * scale);
	height = Math.ceil(height * scale);
	depth = Math.ceil(depth * scale);
	radius = Math.ceil(radius * scale);

	console.log('compute3DTexture', { width, height, depth });

	atoms = atoms.map((atom) => {
		atom.setPosition(atom.position.map((value) => value * scale));
		return atom;
	});

	const texture = device.createTexture({
		format: 'rgba8snorm',
		size: [width, height, depth],
		dimension: '3d',
		usage:
			GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_DST,
	});

	const dispatchCount = [width, height, depth].map((value) => Math.ceil(value / 4));

	const pipeline = device.createComputePipeline({
		label: 'compute pipeline',
		layout: 'auto',
		compute: {
			module: device.createShaderModule({ code: computeShader }),
			constants: {
				radius,
			},
		},
	});

	let usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST;

	// In the shader the buffer has the type array<vec3f>.
	// Each vec3f is 3 bytes long + 1 byte of padding.
	const atomsBufferData = new Float32Array(atoms.length * 4 - 1);
	for (let i = 0; i < atoms.length; i++) {
		atomsBufferData.set(atoms[i].position, i * 3 + i);
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
	pass.dispatchWorkgroups(...(dispatchCount as [number, number, number]));
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

	return texture;
}
