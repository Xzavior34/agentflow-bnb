import fs from 'fs';
import path from 'path';

const rootDir = 'c:/Users/Administrator/CrossDevice/Pixel 8 Pro/SOLANA_REPRO_SUPERTEAM_FIRST_TRANCHE/src';
const srcFile = path.join(rootDir, 'hooks', 'useAgentContract.ts');
const destFile = path.join(rootDir, '_archive', 'useAgentContract.ts');

if (fs.existsSync(srcFile)) {
  fs.renameSync(srcFile, destFile);
  console.log('Archived useAgentContract.ts -> src/_archive/');
}
