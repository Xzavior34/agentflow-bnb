import fs from 'fs';
import path from 'path';

const rootDir = 'c:/Users/Administrator/CrossDevice/Pixel 8 Pro/SOLANA_REPRO_SUPERTEAM_FIRST_TRANCHE/src';

const terms = ['Agent Market', 'AgentMarket', 'Cronos', 'TCRO', 'zkEVM'];

function scan(dir) {
  const issues = [];
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    if (dir.includes('_archive')) continue;
    if (fs.statSync(full).isDirectory()) {
      issues.push(...scan(full));
    } else if (full.endsWith('.ts') || full.endsWith('.tsx') || full.endsWith('.html')) {
      const content = fs.readFileSync(full, 'utf8');
      for (const term of terms) {
        if (content.toLowerCase().includes(term.toLowerCase())) {
          issues.push({ file: path.relative(rootDir, full), term });
        }
      }
    }
  }
  return issues;
}

const res = scan(rootDir);
console.log('Active User-Facing Legacy Scan Result:', res);
