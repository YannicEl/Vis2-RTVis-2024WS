import { CylinderGeometry } from '$lib/webGPU/geometry/CylinderGeometry';
import { SphereGeometry } from '$lib/webGPU/geometry/SphereGeometry';
import { ColorMaterial } from '$lib/webGPU/material/ColorMaterial';
import { SceneObject } from '$lib/webGPU/scene/SceneObject';
import { vec3 } from 'wgpu-matrix';
import type { mmcifAtom, mmcifBond } from './mmcifTypes';

export const createMmcifGeometry = (atoms: mmcifAtom[], bonds: mmcifBond[]) => {
	const material = new ColorMaterial('red');
	const geometry = new SphereGeometry({
		radius: 0.1,
	});

	const atomsGeometry = atoms.map((atom) => {
		const sphere = new SceneObject(geometry, material);
		sphere.setPosition(vec3.create(atom.Cartn_x, atom.Cartn_y, atom.Cartn_z));

		return sphere;
	});

	const bondsGeometry = bonds
		.map((bond) => {
			const atom1 = atoms.find((atom) => atom.label_atom_id === bond['_chem_comp_bond.atom_id_1']);
			const atom2 = atoms.find((atom) => atom.label_atom_id === bond['_chem_comp_bond.atom_id_2']);

			if (atom1 === undefined || atom2 === undefined) return null;

			const start = vec3.create(atom1.Cartn_x, atom1.Cartn_y, atom1.Cartn_z);
			const end = vec3.create(atom2.Cartn_x, atom2.Cartn_y, atom2.Cartn_z);

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

			return stick;
		})
		.filter(Boolean) as SceneObject[];

	const atomsAndBonds = [...atomsGeometry, ...bondsGeometry];

	// center the molecule
	const center = vec3.create();
	for (const atom of atomsGeometry) {
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
