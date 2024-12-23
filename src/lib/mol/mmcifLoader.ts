import type { mmcifAtom, mmcifBond } from './mmcifTypes';

export const loadMmcifLocal = async (fileName: string) => {
	try {
		const fileContent = await import(`../mol-files/${fileName}.cif?raw`);
		const parsed = parse(fileContent.default);
		return parsed;
	} catch (e) {
		console.error('error', e);
	}
};

// TODO: check if we want to include HETATM
const ATOM_NAMES = ['ATOM', 'HETATM'];

const FIELDS = [
	'type',
	'id',
	'type_symbol',
	'label_atom_id',
	'label_alt_id',
	'label_comp_id',
	'label_asym_id',
	'label_entity_id',
	'label_seq_id',
	'pdbx_PDB_ins_code',
	'Cartn_x',
	'Cartn_y',
	'Cartn_z',
	'occupancy',
	'B_iso_or_equiv',
	'pdbx_formal_charge',
	'auth_seq_id',
	'auth_comp_id',
	'auth_asym_id',
	'auth_atom_id',
	'pdbx_PDB_model_num',
];

const INTEGER_FIELDS = new Set([
	'id',
	'label_entity_id',
	'label_seq_id',
	'auth_seq_id',
	'pdbx_PDB_model_num',
]);

const FLOAT_FIELDS = new Set(['Cartn_x', 'Cartn_y', 'Cartn_z', 'occupancy', 'B_iso_or_equiv']);

const bondHeaders = [
	'_chem_comp_bond.comp_id',
	'_chem_comp_bond.atom_id_1',
	'_chem_comp_bond.atom_id_2',
	'_chem_comp_bond.value_order',
];

const parse = (mmcif: string) => {
	const sections = mmcif.split('# ');

	// ATOMS
	const atoms: mmcifAtom[] = [];
	const atomsRaw = sections.filter((section) => section.includes('_atom_site.id'));
	atomsRaw[0].split('\n').forEach((mmcifLine) => {
		if (ATOM_NAMES.includes(mmcifLine.split(' ')[0])) {
			let fieldIndex = 0;
			const atom = mmcifLine.split(' ').reduce(
				(atom, value) => {
					if (value === '') {
						return atom;
					}

					// Properly parse the value
					const field = FIELDS[fieldIndex];
					if (INTEGER_FIELDS.has(field)) {
						atom[field] = parseInt(value);
					} else if (FLOAT_FIELDS.has(field)) {
						atom[field] = parseFloat(value);
					} else {
						atom[field] = value;
					}

					fieldIndex++;
					return atom;
				},
				{} as Record<string, any>
			);
			atoms.push(atom as mmcifAtom);
		}
	});

	console.log('atoms', atoms);

	// BONDS
	const bondsRaw = sections.filter((section) => section.includes('chem_comp_bond.comp_id'));
	const bondsLines = bondsRaw[0].split('\n').filter((line) => line !== '');

	const headers = bondsLines.filter((line) => line.startsWith('_')).map((line) => line.trim());

	const bondsData = bondsLines.filter((line) => {
		if (line.startsWith('_')) {
			return false;
		}

		if (line.startsWith('loop_')) {
			return false;
		}

		return true;
	});

	const headerIndizes = headers
		.map((header) => {
			return bondHeaders.indexOf(header);
		})
		.filter((index) => index !== -1);

	const bonds = bondsData.map((line) => {
		const values = line
			.trim()
			.split(' ')
			.filter((value) => value !== '');

		const bond: Record<string, string> = {};
		for (let i = 0; i < headerIndizes.length; i++) {
			const headerIndex = headerIndizes[i];
			const header = bondHeaders[headerIndex];

			bond[header] = values[i];
		}

		return bond as mmcifBond;
	});

	console.log('bonds', bonds);

	return {
		atoms,
		bonds,
	};
};
