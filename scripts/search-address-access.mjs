import fs from 'fs';
import path from 'path';

const rootDir = 'c:/Users/Administrator/CrossDevice/Pixel 8 Pro/SOLANA_REPRO_SUPERTEAM_FIRST_TRANCHE/src';

function scan(dir) {
  const matches = [];
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    if (dir.includes('_archive')) continue;
    if (fs.statSync(full).isDirectory()) {
      matches.push(...scan(full));
    } else if (full.endsWith('.ts') || full.endsWith('.tsx')) {
      const lines = fs.readFileSync(full, 'utf8').split('\n');
      lines.forEach((line, i) => {
        if (line.includes('.address') && !line.includes('?.address')) {
          matches.push({ file: path.relative(rootDir, full), line: i + 1, content: line.trim() });
        }
      });
    }
  }
  return matches;
}

console.log('Unsafely chained .address accesses in active src:');
console.log(scan(rootDir));
