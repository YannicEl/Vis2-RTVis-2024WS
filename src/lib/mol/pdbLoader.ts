import { PdbParser } from 'pdb-parser-js';

export const LOCAL_PDB_FILES = ['example', '1jjj', '4nkg', '1af6', '5xyu', '3iz8', '8z3k'] as const;

export type PdbFile = (typeof LOCAL_PDB_FILES)[number] | (string & {});

export const loadPDBLocal = async (fileName: PdbFile) => {
	try {
		const fileContent = await import(`../mol-files/${fileName.toLowerCase()}.pdb?raw`);

		const parser = new PdbParser();
		parser.collect(fileContent.default.split('\n'));
		const pdb = parser.parse();
		return pdb;
	} catch (e) {
		console.error('error', e);
	}
};

export const loadPDBWeb = async (id: string) => {
	const response = await fetch(`https://files.rcsb.org/download/${id}.pdb`);
	if (!response.ok) {
		return null;
	}

	const data = await response.text();

	const parser = new PdbParser();
	parser.collect(data.split('\n'));
	const pdb = parser.parse();
	return pdb;
};
