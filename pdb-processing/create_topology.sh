#!/bin/bash
read -p "Enter filename: " FILE

echo "Creating topology for $FILE"

grep -v HETATM "${FILE}.pdb" > "${FILE}_protein_tmp.pdb"
grep -v CONECT "${FILE}_protein_tmp.pdb" > "${FILE}_protein.pdb"
gmx pdb2gmx -f "${FILE}_protein.pdb" -o "${FILE}_processed_OUTPUT.gro" -water tip3p -ff "charmm27"