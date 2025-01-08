export type mmcifAtom = {
	type: string;
	id: number;
	type_symbol: string;
	label_atom_id: string;
	label_alt_id: string;
	label_comp_id: string;
	label_asym_id: string;
	label_entity_id: number;
	label_seq_id: number;
	pdbx_PDB_ins_code: string;
	Cartn_x: number;
	Cartn_y: number;
	Cartn_z: number;
	occupancy: number;
	B_iso_or_equiv: number;
	pdbx_formal_charge: string;
	auth_seq_id: number;
	auth_comp_id: string;
	auth_asym_id: string;
	auth_atom_id: string;
	pdbx_PDB_model_num: number;
};

export type mmcifBond = {
	'_chem_comp_bond.comp_id': string;
	'_chem_comp_bond.atom_id_1': string;
	'_chem_comp_bond.atom_id_2': string;
	'_chem_comp_bond.value_order': string;
};
