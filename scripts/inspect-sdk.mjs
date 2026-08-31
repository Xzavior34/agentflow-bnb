import * as sdk from '@bnbagent/sdk';
import fs from 'fs';

console.log('--- @bnbagent/sdk Exports ---');
console.log(Object.keys(sdk));

if (sdk.NETWORKS) {
  console.log('\n--- sdk.NETWORKS ---');
  console.log(JSON.stringify(sdk.NETWORKS, null, 2));
}

for (const k of Object.keys(sdk)) {
  console.log(`Export: ${k} (typeof: ${typeof sdk[k]})`);
  if (typeof sdk[k] === 'function' && sdk[k].prototype) {
    console.log(`  Prototype methods:`, Object.getOwnPropertyNames(sdk[k].prototype));
  }
}
