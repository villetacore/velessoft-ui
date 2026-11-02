import { mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
mkdirSync('artifacts', {recursive:true});
for (const name of ['@velessoft/tokens','@velessoft/ui']) execFileSync('npm',['pack','-w',name,'--pack-destination','artifacts'],{stdio:'inherit'});
