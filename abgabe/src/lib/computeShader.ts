import computeShader from './compute.wgsl?raw';
import type { Object3D } from './webGPU/Object3D';
import { Texture } from './webGPU/texture/Texture';

export type Compute3DTextureParams = {
	device: GPUDevice;
	width: number;
	height: number;
	depth: number;
	radius?: number;
	scale?: number;
	atoms: Object3D[];
};

/**
 * Compute a 3D texture with the signed distance field of the atoms.
 */
export async function compute3DTexture({
	device,
	width,
	height,
	depth,
	radius = 1,
	scale = 1,
	atoms,
}: Compute3DTextureParams): Promise<Texture> {
	const { maxBufferSize } = device.limits;

	const maxScale = 1;
	while (true) {
		scale += 0.1;

		const size = width * height * depth * Math.pow(scale, 3) * 4;
		if (size > maxBufferSize * 0.3 || scale > maxScale) {
			scale -= 0.1;
			break;
		}

		// const maxResolution = 500;
		// if (
		// 	width * scale > maxResolution ||
		// 	height * scale > maxResolution ||
		// 	depth * scale > maxResolution
		// ) {
		// 	scale -= 0.1;
		// 	break;
		// }
	}

	width = Math.ceil(width * scale);
	height = Math.ceil(height * scale);
	depth = Math.ceil(depth * scale);
	radius = Math.ceil(radius * scale);
	console.log(`SDF Texture size: ${width}x${height}x${depth}`);
	atoms.forEach((atom) => {
		atom.setPosition(atom.position.map((value) => value * scale));
		return atom;
	});

	const texture = new Texture({
		format: 'rgba8snorm',
		size: [width, height, depth],
		dimension: '3d',
		usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING,
	});

	const dispatchCount = [width, height, depth].map((value) => Math.ceil(value / 4));

	const pipeline = await device.createComputePipelineAsync({
		label: 'compute pipeline',
		layout: 'auto',
		compute: {
			module: device.createShaderModule({ code: computeShader }),
			constants: {
				radius,
				scale,
			},
		},
	});

	// In the shader the buffer has the type array<vec3f>.
	// Each vec3f is 3 bytes long + 1 byte of padding.
	const atomsBufferData = new Float32Array(atoms.length * 4 - 1);
	for (let i = 0; i < atoms.length; i++) {
		atomsBufferData.set(atoms[i].position, i * 4);
	}

	const atomsBuffer = device.createBuffer({
		size: atomsBufferData.byteLength,
		usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
	});
	device.queue.writeBuffer(atomsBuffer, 0, atomsBufferData);

	const bindGroup = device.createBindGroup({
		label: 'Compute Bind Group',
		layout: pipeline.getBindGroupLayout(0),
		entries: [
			{ binding: 0, resource: texture.createView(device) },
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

	return texture;
}
