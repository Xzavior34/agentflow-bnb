import fs from 'fs';

const content = fs.readFileSync('c:/Users/Administrator/CrossDevice/Pixel 8 Pro/SOLANA_REPRO_SUPERTEAM_FIRST_TRANCHE/node_modules/@bnbagent/sdk/dist/chunk-5XYQEBM2.js', 'utf8');

// Find all function entries in agenticCommerceAbi
const functionRegex = /{\s*"inputs":\s*\[[\s\S]*?\],\s*"name":\s*"([a-zA-Z0-9_]+)",\s*"outputs":\s*\[[\s\S]*?\],\s*"stateMutability":\s*"([a-zA-Z0-9_]+)",\s*"type":\s*"function"\s*}/g;

let m;
const functions = [];
while ((m = functionRegex.exec(content)) !== null) {
  functions.push({ name: m[1], stateMutability: m[2] });
}

console.log(`Found ${functions.length} functions in ABI:`);
console.log(functions);
