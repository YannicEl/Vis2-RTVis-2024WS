import { PdbParser } from 'pdb-parser-js';
type pdbFiles = '3iz8' | 'example';

export const loadPDB = async (fileName: pdbFiles) => {
	try {
		const fileContent = await import(`../mol-files/${fileName}.pdb?raw`);

		const parser = new PdbParser();
		parser.collect(fileContent.default.split('\n'));
		const pdb = parser.parse();
		return pdb;
	} catch (e) {
		console.error('error', e);
	}
};
