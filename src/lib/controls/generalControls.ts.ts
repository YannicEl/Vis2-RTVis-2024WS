import { LOCAL_PDB_FILES } from '$lib/proteins/pdb/pdbLoader';
import { getControls } from './controls.svelte';

export function addGeneralControls() {
	const controls = getControls();

	const molecule = controls.addControl({
		name: 'Molecule',
		type: 'select',
		value: 'example',
		options: [
			...LOCAL_PDB_FILES.map((file) => {
				return {
					label: file === 'example' ? 'Example' : file.toUpperCase(),
					value: file,
				};
			}),
		],
	});

	const showMoleculeSurface = controls.addControl({
		name: 'Show molecule surface',
		type: 'checkbox',
		value: true,
	});

	const showMoleculeStructure = controls.addControl({
		name: 'Show molecule structure',
		type: 'checkbox',
		value: true,
	});

	return {
		molecule,
		showMoleculeSurface,
		showMoleculeStructure,
	};
}
