import { elementColors } from '$lib/mol/pdbColors';
import { CylinderGeometry } from '$lib/webGPU/geometry/CylinderGeometry';
import { SphereGeometry } from '$lib/webGPU/geometry/SphereGeometry';
import { ColorMaterial } from '$lib/webGPU/material/ColorMaterial';
import { SceneObject } from '$lib/webGPU/SceneObject';
import type { Pdb } from 'pdb-parser-js/dist/pdb';
import { vec3 } from 'wgpu-matrix';

export const createPdbGeometry = (pdb: Pdb) => {
	const geometry = new SphereGeometry({
		radius: 0.1,
	});
	const materials = new Map<string, ColorMaterial>();

	console.log('pdb', pdb);

	const pdbAtoms = pdb.coordinate.atoms;
	const pdbHetAtoms = pdb.coordinate.hetatms;

	const atomsSorted = [...pdbAtoms, ...pdbHetAtoms].sort((a, b) => a.data.serial! - b.data.serial!);

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
			let material = materials.get(color);
			if (!material) {
				material = new ColorMaterial(color);
				materials.set(color, material);
			}

			const sphere = new SceneObject(geometry, material);

			sphere.setPosition(vec3.create(atom.data.x, atom.data.y, atom.data.z));

			return sphere;
		})
		.filter(Boolean) as SceneObject[];

	console.log(materials);

	const bonds: SceneObject[] = [];
	for (let i = 0; i < pdb.connectivity.conects.length - 1; i++) {
		const connect = pdb.connectivity.conects[i];
		// atom serials are 1-indexed 🤮
		const primaryAtom = atomsSorted[connect.atomSeqNum - 1];

		if (!primaryAtom) console.error('primaryAtom not found', connect.atomSeqNum);

		if (
			primaryAtom === undefined ||
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

			const stick = new SceneObject(
				new CylinderGeometry({
					radiusTop: 0.05,
					radiusBottom: 0.05,
					height: distance,
				}),
				new ColorMaterial('#ccc')
			);

			const u1 = vec3.create(0, 1, 0);
			const u2 = vec3.divScalar(direction, distance);

			const dot_u1u2 = vec3.dot(u1, u2);
			const angle = Math.acos(dot_u1u2);

			const axis = vec3.cross(u1, u2);
			stick.setRotation((180 * angle) / Math.PI, axis);
			stick.translate(vec3.divScalar(vec3.add(start, end), 2));

			bonds.push(stick);
		}
	}

	console.log('atoms', atoms.length, 'bonds', bonds.length);

	const atomsAndBonds = [...atoms, ...bonds];

	// center the molecule
	const center = vec3.create();
	for (const atom of atoms) {
		center[0] += atom.position[0];
		center[1] += atom.position[1];
		center[2] += atom.position[2];
	}
	center[0] /= atoms.length;
	center[1] /= atoms.length;
	center[2] /= atoms.length;

	for (const atom of atomsAndBonds) {
		atom.translate(vec3.negate(center));
	}

	return atomsAndBonds;
};
