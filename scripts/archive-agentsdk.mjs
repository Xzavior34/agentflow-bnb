import fs from 'fs';
import path from 'path';

const rootDir = 'c:/Users/Administrator/CrossDevice/Pixel 8 Pro/SOLANA_REPRO_SUPERTEAM_FIRST_TRANCHE/src';
const srcFile = path.join(rootDir, 'utils', 'AgentSDK.ts');
const destFile = path.join(rootDir, '_archive', 'AgentSDK.ts');

if (fs.existsSync(srcFile)) {
  fs.renameSync(srcFile, destFile);
  console.log('Archived AgentSDK.ts -> src/_archive/');
}
