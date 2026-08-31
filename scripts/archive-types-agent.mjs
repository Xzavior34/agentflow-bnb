import fs from 'fs';
import path from 'path';

const rootDir = 'c:/Users/Administrator/CrossDevice/Pixel 8 Pro/SOLANA_REPRO_SUPERTEAM_FIRST_TRANCHE/src';
const srcFile = path.join(rootDir, 'types', 'agent.ts');
const destFile = path.join(rootDir, '_archive', 'agent.ts');

if (fs.existsSync(srcFile)) {
  fs.renameSync(srcFile, destFile);
  console.log('Archived agent.ts -> src/_archive/');
}
