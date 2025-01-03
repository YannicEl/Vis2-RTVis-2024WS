import type { CssColor } from '$lib/webGPU/color/Color';
import { CylinderGeometry } from '$lib/webGPU/geometry/CylinderGeometry';
import { SphereGeometry } from '$lib/webGPU/geometry/SphereGeometry';
import { ColorMaterial } from '$lib/webGPU/material/ColorMaterial';
import { InstancedSceneObject } from '$lib/webGPU/scene/InstancedSceneObject';
import type { Pdb } from 'pdb-parser-js/dist/pdb';
import type { Atom, Hetatm } from 'pdb-parser-js/dist/section/coordinate';
import { vec3 } from 'wgpu-matrix';
import { elementColors } from './pdbColors';

export const createPdbGeometry = (pdb: Pdb) => {
	const sphereGeometry = new SphereGeometry({
		radius: 0.1,
	});
	const cylinderGeometry = new CylinderGeometry({
		radiusTop: 0.05,
		radiusBottom: 0.05,
		height: 1,
	});
	const materials = materialCache();

	console.log('pdb', pdb);

	const pdbAtoms = pdb.coordinate.atoms;
	const pdbHetAtoms = pdb.coordinate.hetatms;

	const atomsSorted = [...pdbAtoms, ...pdbHetAtoms].sort((a, b) => a.data.serial! - b.data.serial!);

	const atomsFiltered = atomsSorted.filter(
		(atom) => atom.data && atom.data.x !== null && atom.data.y !== null && atom.data.z !== null
	);
	// tutorial
	// https://www.youtube.com/watch?v=vQO2Qrv5mN8&list=RDEMrmjaK60NOsLjTW1y6Mr5zg&index=2

	// const element = atom.data.element!;
	// const color = elementColors.Jmol[element] ?? elementColors.defaultColor;
	// let material = materials.get(color);

	const atomsGroupdByColor: Map<CssColor, (Atom | Hetatm)[]> = new Map();
	atomsFiltered.forEach((atom) => {
		const element = atom.data.element!;
		const color = elementColors.Jmol[element] ?? elementColors.defaultColor;

		const found = atomsGroupdByColor.get(color);
		if (found) {
			found.push(atom);
		} else {
			atomsGroupdByColor.set(color, [atom]);
		}
	});

	const atoms = [...atomsGroupdByColor].map(([color, atoms], i) => {
		const material = materials.get(color);

		const atomsInstanced = new InstancedSceneObject(sphereGeometry, material, atoms.length);

		for (let i = 0; i < atoms.length; i++) {
			const { data } = atoms[i];
			const atom = atomsInstanced.getInstance(i);
			atom.setPosition(vec3.create(data.x!, data.y!, data.z!));
		}

		return atomsInstanced;
	});

	const bondAtoms: { primary: Atom | Hetatm; secondary: Atom | Hetatm }[] = [];
	for (let i = 0; i < pdb.connectivity.conects.length - 1; i++) {
		const connect = pdb.connectivity.conects[i];
		// atom serials are 1-indexed 🤮
		const primaryAtom = atomsSorted[connect.atomSeqNum - 1];

		if (
			!primaryAtom?.data ||
			primaryAtom.data.x === null ||
			primaryAtom.data.y === null ||
			primaryAtom.data.z === null
		) {
			console.error('primaryAtom not found or invalid', connect.atomSeqNum);
			continue;
		}

		for (const bond of connect.bondedAtomSeqNums) {
			const secondaryAtom = atomsSorted[bond - 1];

			if (
				!secondaryAtom?.data ||
				secondaryAtom.data.x === null ||
				secondaryAtom.data.y === null ||
				secondaryAtom.data.z === null
			) {
				console.error('secondaryAtom not found or invalid', bond);
				continue;
			}

			bondAtoms.push({ primary: primaryAtom, secondary: secondaryAtom });
		}
	}

	const bonds = new InstancedSceneObject(cylinderGeometry, materials.get('#ccc'), bondAtoms.length);

	for (let i = 0; i < bondAtoms.length; i++) {
		const { primary, secondary } = bondAtoms[i];
		const start = vec3.create(primary.data.x!, primary.data.y!, primary.data.z!);
		const end = vec3.create(secondary.data.x!, secondary.data.y!, secondary.data.z!);

		const direction = vec3.subtract(end, start);
		const distance = vec3.length(direction);

		const bond = bonds.getInstance(i);

		const u1 = vec3.create(0, 1, 0);
		const u2 = vec3.divScalar(direction, distance);

		const dot_u1u2 = vec3.dot(u1, u2);
		const angle = Math.acos(dot_u1u2);

		const axis = vec3.cross(u1, u2);
		bond.setRotation((180 * angle) / Math.PI, axis);
		bond.translate(vec3.divScalar(vec3.add(start, end), 2));
		bond.scaleY(distance);
	}

	console.log('atoms', atomsFiltered.length, 'bonds', bonds.count);

	// center the molecule
	const center = vec3.create();
	for (const atomsInstanced of atoms) {
		for (const atom of atomsInstanced.instances) {
			center[0] += atom.position[0];
			center[1] += atom.position[1];
			center[2] += atom.position[2];
		}
	}

	center[0] /= atomsFiltered.length;
	center[1] /= atomsFiltered.length;
	center[2] /= atomsFiltered.length;

	for (const atomsInstanced of atoms) {
		for (const atom of atomsInstanced.instances) {
			atom.translate(vec3.negate(center));
		}
	}

	for (const bond of bonds.instances) {
		bond.translate(vec3.negate(center));
	}

	const atomsAndBonds = [...atoms, bonds];

	const atomsObject3D = atoms.map((atom) => atom.instances).flat();

	return { atoms: atomsObject3D, atomsAndBonds };
};

function materialCache() {
	const materials = new Map<string, ColorMaterial>();

	return {
		get: (color: string) => {
			let material = materials.get(color);
			if (!material) {
				material = new ColorMaterial(color, { instanced: true });
				materials.set(color, material);
			}

			return material;
		},
	};
}
