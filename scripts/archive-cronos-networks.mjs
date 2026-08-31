import fs from 'fs';
import path from 'path';

const rootDir = 'c:/Users/Administrator/CrossDevice/Pixel 8 Pro/SOLANA_REPRO_SUPERTEAM_FIRST_TRANCHE/src';
const srcFile = path.join(rootDir, 'config', 'archive', 'cronosNetworks.ts');
const destFile = path.join(rootDir, '_archive', 'cronosNetworks.ts');

if (fs.existsSync(srcFile)) {
  fs.renameSync(srcFile, destFile);
  fs.rmdirSync(path.join(rootDir, 'config', 'archive'));
  console.log('Archived cronosNetworks.ts -> src/_archive/');
}
