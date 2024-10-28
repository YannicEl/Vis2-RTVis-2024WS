import { elementColors } from '$lib/mol/pdbColors';
import { CylinderGeometry } from '$lib/webGPU/geometry/CylinderGeometry';
import { SphereGeometry } from '$lib/webGPU/geometry/SphereGeometry';
import { ColorMaterial } from '$lib/webGPU/material/ColorMaterial';
import { SceneObject } from '$lib/webGPU/SceneObject';
import type { Pdb } from 'pdb-parser-js/dist/pdb';
import { vec3 } from 'wgpu-matrix';

export const renderPDB = (pdb: Pdb) => {
	const geometry = new SphereGeometry({
		radius: 0.1,
	});

	const atomsSorted = pdb.coordinate.atoms.sort((a, b) => a.data.serial! - b.data.serial!);

	const atoms = atomsSorted
		// tutorial
		// https://www.youtube.com/watch?v=vQO2Qrv5mN8&list=RDEMrmjaK60NOsLjTW1y6Mr5zg&index=2
		.map((atom) => {
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

	const bonds: SceneObject[] = [];
	for (let i = 0; i < pdb.connectivity.conects.length - 1; i++) {
		const connect = pdb.connectivity.conects[i];
		// atom serials are 1-indexed 🤮
		const primaryAtom = atomsSorted[connect.atomSeqNum - 1];

		if (
			primaryAtom.data === undefined ||
			primaryAtom.data.x === null ||
			primaryAtom.data.y === null ||
			primaryAtom.data.z === null
		)
			continue;

		for (const bond of connect.bondedAtomSeqNums) {
			const secondaryAtom = atomsSorted[bond - 1];

			if (
				secondaryAtom === undefined ||
				secondaryAtom.data === undefined ||
				secondaryAtom.data.x === null ||
				secondaryAtom.data.y === null ||
				secondaryAtom.data.z === null
			)
				continue;

			const start = vec3.create(primaryAtom.data.x, primaryAtom.data.y, primaryAtom.data.z);
			const end = vec3.create(secondaryAtom.data.x, secondaryAtom.data.y, secondaryAtom.data.z);

			const direction = vec3.subtract(end, start);
			const distance = vec3.length(direction);

			const cylinder = new SceneObject(
				new CylinderGeometry({
					radiusTop: 0.05,
					radiusBottom: 0.05,
					height: distance,
				}),
				new ColorMaterial('green')
			);

			// cylinder.setRotation(vec3.normalize(direction));
			cylinder.setPosition(vec3.add(start, vec3.scale(direction, 0.5)));

			bonds.push(cylinder);
		}
	}

	const bonds2: SceneObject[] = [];
	const connect = pdb.connectivity.conects[0];
	const primaryAtom = atomsSorted[connect.atomSeqNum - 1];
	console.log('primaryAtom', primaryAtom);
	for (const bond of connect.bondedAtomSeqNums) {
		const secondaryAtom = atomsSorted[bond - 1];

		console.log('secondaryAtom', secondaryAtom);

		const start = vec3.create(primaryAtom.data.x!, primaryAtom.data.y!, primaryAtom.data.z!);
		const end = vec3.create(secondaryAtom.data.x!, secondaryAtom.data.y!, secondaryAtom.data.z!);

		const direction = vec3.subtract(end, start);
		const distance = vec3.length(direction);

		const cylinder = new SceneObject(
			new CylinderGeometry({
				radiusTop: 0.05,
				radiusBottom: 0.05,
				height: distance,
			}),
			new ColorMaterial('green')
		);

		// cylinder.setRotation(vec3.normalize(direction));

		cylinder.setPosition(vec3.add(start, vec3.scale(direction, 0.5)));

		bonds2.push(cylinder);
	}

	const atom1 = new SceneObject(
		new SphereGeometry({
			radius: 0.1,
		}),
		new ColorMaterial('white')
	);
	atom1.setPosition(vec3.create(0, 0, 0));

	const atom2 = new SceneObject(
		new SphereGeometry({
			radius: 0.1,
		}),
		new ColorMaterial('white')
	);
	atom2.setPosition(vec3.create(1, 1, 0));

	const direction = vec3.subtract(atom2.position, atom1.position);
	const distance = vec3.length(direction);

	const cylinder = new SceneObject(
		new CylinderGeometry({
			radiusTop: 0.05,
			radiusBottom: 0.05,
			height: distance,
		}),
		new ColorMaterial('green')
	);

	// console.log('direction', direction);
	// console.log('angle', radToDeg(vec3.angle(direction, vec3.create(0, 0, 0))));

	// cylinder.setRotation(vec3.normalize(direction));
	// cylinder.rotateZ(90);
	cylinder.setRotation(vec3.angle(direction, vec3.create(0, 0, 0)));

	cylinder.setPosition(vec3.add(atom1.position, vec3.scale(direction, 0.5)));

	return [atom1, atom2, cylinder];
	// return [...atoms, ...bonds];
};
