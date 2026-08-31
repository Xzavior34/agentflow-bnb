import fs from 'fs';

const content = fs.readFileSync('c:/Users/Administrator/CrossDevice/Pixel 8 Pro/SOLANA_REPRO_SUPERTEAM_FIRST_TRANCHE/node_modules/@bnbagent/sdk/dist/chunk-5XYQEBM2.js', 'utf8');

// Find all abi definitions
const abiMatches = content.match(/var [a-zA-Z0-9_]+_abi = \[[\s\S]*?\];/g) || content.match(/const [a-zA-Z0-9_]+ = \[[\s\S]*?\];/g);
console.log('ABI match count:', abiMatches ? abiMatches.length : 0);

if (abiMatches) {
  for (const m of abiMatches.slice(0, 5)) {
    console.log(m.slice(0, 400) + '...\n---');
  }
} else {
  // Let's print snippets around 'createJob'
  const idx = content.indexOf('createJob');
  console.log('Around createJob:');
  console.log(content.slice(Math.max(0, idx - 200), idx + 800));
}
