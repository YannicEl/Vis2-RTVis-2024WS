import { PdbParser } from 'pdb-parser-js';

export const LOCAL_PDB_FILES = [
	'example',
	'1jjj',
	'AF_AFB5EZH0F1',
	'MA_MACOFFESLACC104963G1I1',
	'AF-U7Q5H6-F1-model_v4',
	'AF-Q6LA55-F1-model_v4',
] as const;

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
