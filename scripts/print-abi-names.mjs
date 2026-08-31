import fs from 'fs';

const content = fs.readFileSync('c:/Users/Administrator/CrossDevice/Pixel 8 Pro/SOLANA_REPRO_SUPERTEAM_FIRST_TRANCHE/node_modules/@bnbagent/sdk/dist/chunk-5XYQEBM2.js', 'utf8');

// Find all occurrences of function names in the file
const matches = content.match(/name: "([a-zA-Z0-9_]+)"/g);
console.log('Unique names in chunk-5XYQEBM2.js:');
const uniqueNames = [...new Set(matches ? matches.map(m => m.replace('name: "', '').replace('"', '')) : [])];
console.log(uniqueNames);
