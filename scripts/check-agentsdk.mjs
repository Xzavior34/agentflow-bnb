import fs from 'fs';
import path from 'path';

const rootDir = 'c:/Users/Administrator/CrossDevice/Pixel 8 Pro/SOLANA_REPRO_SUPERTEAM_FIRST_TRANCHE/src';

function scanDir(dir) {
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    if (dir.includes('_archive')) continue;
    if (fs.statSync(full).isDirectory()) {
      scanDir(full);
    } else if (full.endsWith('.ts') || full.endsWith('.tsx')) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes('AgentSDK')) {
        console.log(`Active import in: ${path.relative(rootDir, full)}`);
      }
    }
  }
}

scanDir(rootDir);
