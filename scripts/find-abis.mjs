import fs from 'fs';
import path from 'path';

function findAbisInSdk() {
  const dir = 'c:/Users/Administrator/CrossDevice/Pixel 8 Pro/SOLANA_REPRO_SUPERTEAM_FIRST_TRANCHE/node_modules/@bnbagent/sdk/dist';
  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (f.endsWith('.js')) {
      const content = fs.readFileSync(path.join(dir, f), 'utf8');
      // Look for abi definitions
      const match = content.match(/createJob|registerJob|settle|submit/g);
      if (match && match.length > 5) {
        console.log(`File ${f} contains ABI keywords: ${match.length}`);
        // Let's inspect function signatures in this file
        const funcMatches = content.match(/name:"[a-zA-Z0-9_]+",type:"function"/g);
        if (funcMatches) {
          console.log(`Found ${funcMatches.length} functions in ${f}:`);
          console.log(funcMatches.slice(0, 30));
        }
      }
    }
  }
}

findAbisInSdk();
