import { elementColors } from '$lib/mol/pdbColors';
import { SphereGeometry } from '$lib/webGPU/geometry/SphereGeometry';
import { ColorMaterial } from '$lib/webGPU/material/ColorMaterial';
import { SceneObject } from '$lib/webGPU/SceneObject';
import type { Pdb } from 'pdb-parser-js/dist/pdb';
import { vec3 } from 'wgpu-matrix';

export const renderPDB = (pdb: Pdb) => {
	const geometry = new SphereGeometry();

	const atoms = pdb.coordinate.atoms
		.map((atom, i) => {
			if (
				atom.data === undefined ||
				atom.data.x === null ||
				atom.data.y === null ||
				atom.data.z === null
			)
				return null;

			const element = atom.data.element!;
			const color = elementColors.Jmol[element] ?? elementColors.defaultColor;

			const material = new ColorMaterial(color);
			const sphere = new SceneObject(geometry, material);

			sphere.setPosition(vec3.create(atom.data.x, atom.data.y, atom.data.z));

			return sphere;
		})
		.filter(Boolean) as SceneObject[];

	return atoms;
};
