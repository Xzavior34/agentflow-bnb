import fs from 'fs';
import path from 'path';

function searchInDir(dir, query) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      searchInDir(full, query);
    } else if (f.endsWith('.js') || f.endsWith('.d.ts') || f.endsWith('.json')) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.toLowerCase().includes(query.toLowerCase())) {
        console.log(`Found "${query}" in: ${full}`);
        // print snippet
        const idx = content.toLowerCase().indexOf(query.toLowerCase());
        console.log(content.slice(Math.max(0, idx - 100), Math.min(content.length, idx + 200)));
        console.log('---');
      }
    }
  }
}

console.log('Searching for negotiate / invoke / token / erc8183 in @bnbagent/sdk...');
searchInDir('c:/Users/Administrator/CrossDevice/Pixel 8 Pro/SOLANA_REPRO_SUPERTEAM_FIRST_TRANCHE/node_modules/@bnbagent/sdk', 'invoke');
searchInDir('c:/Users/Administrator/CrossDevice/Pixel 8 Pro/SOLANA_REPRO_SUPERTEAM_FIRST_TRANCHE/node_modules/@bnbagent/sdk', 'negotiat');
