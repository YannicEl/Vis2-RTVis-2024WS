import { LOCAL_PDB_FILES } from '$lib/mol/pdbLoader';
import { getControls } from './controls.svelte';

export function addMoleculeSelectControl() {
	const controls = getControls();

	const moleculeSelect = controls.addControl({
		name: 'Search Local',
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

	return moleculeSelect;
}
