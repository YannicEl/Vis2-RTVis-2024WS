import { PdbParser } from 'pdb-parser-js';

export const loadPDBLocal = async (fileName: string) => {
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
