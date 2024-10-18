import { cssColors } from '$lib/webGPU/color/Color';
import { TriangleGeometry } from '$lib/webGPU/geometry/TriangleGeometry';
import { ColorMaterial } from '$lib/webGPU/material/ColorMaterial';
import { SceneObject } from '$lib/webGPU/SceneObject';
import { type Pdb } from 'pdb-parser-js/dist/pdb';

export const renderPDB = (pdb: Pdb) => {
	const geometry = new TriangleGeometry();

	const atoms = pdb.coordinate.atoms
		.map((atom, i) => {
			if (
				atom.data === undefined ||
				atom.data.x === null ||
				atom.data.y === null ||
				atom.data.z === null
			)
				return null;

			const color = cssColors[i % cssColors.length];
			const material = new ColorMaterial(color);
			const triangle = new SceneObject(geometry, material);

			triangle.setPosition(atom.data.x, atom.data.y, atom.data.z);

			return triangle;
		})
		.filter(Boolean) as SceneObject[];

	return atoms;
};
