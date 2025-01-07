import { CylinderGeometry } from '$lib/webGPU/geometry/CylinderGeometry';
import { SphereGeometry } from '$lib/webGPU/geometry/SphereGeometry';
import { ColorMaterial } from '$lib/webGPU/material/ColorMaterial';
import { InstancedSceneObject } from '$lib/webGPU/scene/InstancedSceneObject';
import type { Pdb } from 'pdb-parser-js/dist/pdb';
import { vec3, type Vec3 } from 'wgpu-matrix';
import { elementColors } from './pdbColors';

export type AtomData = {
	color: string;
	position: Vec3;
};

export type Bond = {
	start: AtomData;
	end: AtomData;
};

export type MoleculeData = {
	atoms: AtomData[];
	bonds: Bond[];
};

export function parsePdb(pdb: Pdb): MoleculeData {
	const pdbAtoms = pdb.coordinate.atoms;
	const pdbHetAtoms = pdb.coordinate.hetatms;

	const atomsSorted = [...pdbAtoms, ...pdbHetAtoms].sort((a, b) => a.data.serial! - b.data.serial!);

	const atoms: AtomData[] = [];

	for (const atom of atomsSorted) {
		if (atom.data && atom.data.x !== null && atom.data.y !== null && atom.data.z !== null) {
			const { x, y, z, element } = atom.data;
			const color = element ? elementColors.Jmol[element] : elementColors.defaultColor;

			atoms.push({ color, position: vec3.create(x, y, z) });
		}
	}

	const bonds: Bond[] = [];

	for (let i = 0; i < pdb.connectivity.conects.length - 1; i++) {
		const connect = pdb.connectivity.conects[i];
		const primaryAtom = atoms[connect.atomSeqNum - 1];
		if (!primaryAtom) {
			console.error('primaryAtom not found or invalid', connect.atomSeqNum);
		}

		for (const bond of connect.bondedAtomSeqNums) {
			const secondaryAtom = atoms[bond - 1];

			if (!secondaryAtom) {
				console.error('secondaryAtom not found or invalid', bond);
				continue;
			}

			bonds.push({ start: primaryAtom, end: secondaryAtom });
		}
	}

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

	for (const atom of atoms) {
		atom.position = vec3.sub(atom.position, center);
	}

	console.log('atoms', atoms.length, 'bonds', bonds.length);
	return { atoms, bonds };
}

export function createMoleculeSceneObjects(data: MoleculeData) {
	const sphereGeometry = new SphereGeometry({
		radius: 0.15,
	});
	const cylinderGeometry = new CylinderGeometry({
		radiusTop: 0.15,
		radiusBottom: 0.15,
		height: 1,
	});
	const materials = materialCache();

	const atomsGroupdByColor: Map<string, AtomData[]> = new Map();
	data.atoms.forEach((atom) => {
		const found = atomsGroupdByColor.get(atom.color);
		if (found) {
			found.push(atom);
		} else {
			atomsGroupdByColor.set(atom.color, [atom]);
		}
	});

	const atoms = [...atomsGroupdByColor].map(([color, atoms]) => {
		const material = materials.get(color);

		const atomsInstanced = new InstancedSceneObject(sphereGeometry, material, atoms.length);

		for (let i = 0; i < atoms.length; i++) {
			const { position } = atoms[i];
			const atom = atomsInstanced.getInstance(i);
			atom.setPosition(vec3.create(...position));
		}

		return atomsInstanced;
	});

	const bonds = new InstancedSceneObject(
		cylinderGeometry,
		materials.get('#ccc'),
		data.bonds.length
	);
	for (let i = 0; i < data.bonds.length; i++) {
		const { start, end } = data.bonds[i];

		const direction = vec3.subtract(end.position, start.position);
		const distance = vec3.length(direction);

		const bond = bonds.getInstance(i);

		const u1 = vec3.create(0, 1, 0);
		const u2 = vec3.divScalar(direction, distance);

		const dot_u1u2 = vec3.dot(u1, u2);
		const angle = Math.acos(dot_u1u2);

		const axis = vec3.cross(u1, u2);
		bond.setRotation((180 * angle) / Math.PI, axis);
		bond.translate(vec3.divScalar(vec3.add(start.position, end.position), 2));
		bond.scaleY(distance);
	}

	return { atoms, bonds };
}

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
