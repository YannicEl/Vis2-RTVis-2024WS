<script lang="ts">
	import { initWebGPU } from '$lib/webGPU/helpers/webGpu';
	import { onMount } from 'svelte';
	import { vec3 } from 'wgpu-matrix';
	import { compute3DTexture } from '$lib/computeShader';
	import { SceneObject } from '$lib/webGPU/SceneObject';
	import { ColorMaterial } from '$lib/webGPU/material/ColorMaterial';
	import { SphereGeometry } from '$lib/webGPU/geometry/SphereGeometry';

	onMount(async () => {
		try {
			console.time('Compute');

			const { device } = await initWebGPU({
				deviceOptions: (adapter) => ({
					requiredLimits: {
						maxStorageBufferBindingSize: adapter.limits.maxStorageBufferBindingSize,
					},
				}),
			});

			const material = new ColorMaterial('white');
			const geometry = new SphereGeometry();

			const atom1 = new SceneObject(geometry, material);
			atom1.setPosition(vec3.create(0, 0, 0));

			const atom2 = new SceneObject(geometry, material);
			atom2.setPosition(vec3.create(4, 4, 0));

			const atom3 = new SceneObject(geometry, material);
			atom3.setPosition(vec3.create(15, 15, 0));

			const atom4 = new SceneObject(geometry, material);
			atom4.setPosition(vec3.create(10, 2, 0));

			const atoms = [atom1, atom2, atom3, atom4];

			console.time();
			const texture = await compute3DTexture({
				device,
				width: 16,
				height: 16,
				depth: 1,
				atoms,
				log: true,
			});
			console.timeEnd();
		} catch (error) {
			alert(error);
		}
	});
</script>
